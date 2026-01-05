import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

/**
 * @swagger
 * tags:
 *   - name: Usuários
 *     description: Gerenciamento de usuários (Admin/Atendente)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lista todos os usuários
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso
 */
export const listUsers = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true
      },
      orderBy: { criadoEm: 'desc' }
    });

    return res.json({ usuarios });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao listar usuários' }
    });
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário (qualquer perfil)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
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
 *               - perfil
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *                 minLength: 8
 *               perfil:
 *                 type: string
 *                 enum: [ADMIN, PACIENTE, ATENDENTE, MEDICO]
 */
export const createUser = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha || !perfil) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Campos obrigatórios ausentes' }
      });
    }

    if (senha.length < 8) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Senha mínima de 8 caracteres' }
      });
    }

    const perfisValidos = ['ADMIN', 'PACIENTE', 'ATENDENTE', 'MEDICO'];
    if (!perfisValidos.includes(perfil)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Perfil inválido' }
      });
    }

    const emailExistente = await prisma.usuario.findUnique({ where: { email } });
    if (emailExistente) {
      return res.status(409).json({
        error: { code: 'RESOURCE_CONFLICT', message: 'Email já cadastrado' }
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: { nome, email, senhaHash, perfil },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true
      }
    });

    return res.status(201).json({ message: 'Usuário criado com sucesso', usuario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar usuário' }
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Busca um usuário por ID
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const getUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        criadoEm: true,
        atualizadoEm: true
      }
    });

    if (!usuario) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' }
      });
    }

    return res.json({ usuario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar usuário' }
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Atualiza dados de um usuário
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha, perfil, ativo } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { id } });

    if (!usuarioExistente) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' }
      });
    }

    const dadosAtualizacao = {};
    if (nome) dadosAtualizacao.nome = nome;

    if (email && email !== usuarioExistente.email) {
      const emailEmUso = await prisma.usuario.findUnique({ where: { email } });
      if (emailEmUso) {
        return res.status(409).json({
          error: { code: 'RESOURCE_CONFLICT', message: 'Email já está em uso' }
        });
      }
      dadosAtualizacao.email = email;
    }

    if (perfil) {
      const perfisValidos = ['ADMIN', 'PACIENTE', 'ATENDENTE', 'MEDICO'];
      if (!perfisValidos.includes(perfil)) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Perfil inválido' }
        });
      }
      dadosAtualizacao.perfil = perfil;
    }

    if (typeof ativo === 'boolean') dadosAtualizacao.ativo = ativo;

    if (senha) {
      if (senha.length < 8) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Senha mínima de 8 caracteres' }
        });
      }
      dadosAtualizacao.senhaHash = await bcrypt.hash(senha, 10);
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: dadosAtualizacao,
      select: {
        id: true,
        nome: true,
        email: true,
        perfil: true,
        ativo: true,
        atualizadoEm: true
      }
    });

    return res.json({ message: 'Usuário atualizado com sucesso', usuario });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao atualizar usuário' }
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Desativa um usuário (Soft Delete)
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const usuario = await prisma.usuario.findUnique({ where: { id } });

    if (!usuario) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Usuário não encontrado' }
      });
    }

    await prisma.usuario.update({
      where: { id },
      data: { ativo: false }
    });

    return res.json({ message: 'Usuário desativado com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao desativar usuário' }
    });
  }
};
