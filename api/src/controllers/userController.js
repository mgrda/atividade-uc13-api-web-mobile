import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';

/**
 * LISTAR USUÁRIOS
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
 * CRIAR USUÁRIO
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

    const emailExistente = await prisma.usuario.findUnique({
      where: { email }
    });

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
 * BUSCAR USUÁRIO
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
 * ATUALIZAR USUÁRIO
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
 * "DELETAR" USUÁRIO (SOFT DELETE)
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
