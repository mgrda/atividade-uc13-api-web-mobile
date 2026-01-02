import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';

/**
 * REGISTER
 * Apenas PACIENTE se registra sozinho
 */
export const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    // Validação básica
    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Nome, email e senha são obrigatórios'
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

    // Verifica email duplicado
    const existingUser = await prisma.usuario.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          code: 'RESOURCE_CONFLICT',
          message: 'Email já cadastrado'
        }
      });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 10);

    // Criação do usuário (sempre PACIENTE)
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
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao registrar usuário'
      }
    });
  }
};

/**
 * LOGIN
 */
export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Email e senha são obrigatórios'
        }
      });
    }

    // Busca usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    // Mensagem única (anti enumeração de usuários)
    if (!usuario) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos'
        }
      });
    }

    if (!usuario.ativo) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Usuário inativo'
        }
      });
    }

    // Verifica senha
    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_CREDENTIALS',
          message: 'Email ou senha inválidos'
        }
      });
    }

    // Access token
    const accessToken = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    // Refresh token
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
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao fazer login'
      }
    });
  }
};

/**
 * REFRESH TOKEN
 */
export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Refresh token é obrigatório'
        }
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET
      );
    } catch {
      return res.status(401).json({
        error: {
          code: 'AUTH_INVALID_TOKEN',
          message: 'Refresh token inválido ou expirado'
        }
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Usuário não encontrado ou inativo'
        }
      });
    }

    const accessToken = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
    );

    return res.json({
      message: 'Token renovado com sucesso',
      accessToken
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    return res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Erro ao renovar token'
      }
    });
  }
};
