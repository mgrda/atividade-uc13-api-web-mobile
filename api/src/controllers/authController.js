import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

/**
 * @swagger
 * tags:
 *   name: Autenticação
 *   description: Sistema de login e registro
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra um novo paciente
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - email
 *               - senha
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 */
export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Campos obrigatórios ausentes'
        }
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'A senha deve ter no mínimo 8 caracteres'
        }
      });
    }

    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'RESOURCE_CONFLICT',
          message: 'Email já cadastrado'
        }
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senhaHash,
        perfil: 'PACIENTE',
        ativo: true
      },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        criadoEm: true
      }
    });

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      usuario
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao registrar'
      }
    });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Autentica um usuário e retorna tokens
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email e senha obrigatórios'
        }
      });
    }

    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos'
        }
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
    if (!senhaValida) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos'
        }
      });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    const refreshToken = jwt.sign(
      { id: usuario.id },
      process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET,
      { expiresIn: process.env.REFRESH_JWT_EXPIRES_IN || '7d' }
    );

    return res.json({
      message: 'Login realizado com sucesso',
      accessToken,
      refreshToken,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao fazer login'
      }
    });
  }
};

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renova o Access Token usando um Refresh Token
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado com sucesso
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Token obrigatório'
        }
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET
    );

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Inativo ou inexistente'
        }
      });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return res.json({
      message: 'Token renovado',
      accessToken
    });
  } catch {
    return res.status(401).json({
      error: {
        code: 'AUTH_INVALID_TOKEN',
        message: 'Token expirado'
      }
    });
  }
};
