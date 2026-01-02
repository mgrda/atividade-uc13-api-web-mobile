import prisma from '../config/database.js';

/**
 * CRIAR CONSULTA
 */
export const createConsulta = async (req, res) => {
  try {
    const { pacienteId, medicoId, dia, hora, detalhes } = req.body;
    const userPerfil = req.user.perfil;
    const userId = req.user.id;

    if (!pacienteId || !medicoId || !dia || !hora) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Campos obrigatórios ausentes' }
      });
    }

    // Paciente só agenda para si
    if (userPerfil === 'PACIENTE' && pacienteId !== userId) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Você só pode agendar para si' }
      });
    }

    const paciente = await prisma.usuario.findUnique({
      where: { id: pacienteId }
    });

    if (!paciente || !paciente.ativo) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Paciente inválido ou inativo' }
      });
    }

    const medico = await prisma.usuario.findUnique({
      where: { id: medicoId }
    });

    if (!medico || medico.perfil !== 'MEDICO' || !medico.ativo) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Médico inválido ou inativo' }
      });
    }

    const [h, m] = hora.split(':');
    const dataHora = new Date(dia);
    dataHora.setHours(Number(h), Number(m), 0, 0);

    const conflito = await prisma.consulta.findFirst({
      where: { medicoId, dataHora }
    });

    if (conflito) {
      return res.status(409).json({
        error: { code: 'SLOT_UNAVAILABLE', message: 'Horário indisponível' }
      });
    }

    const consulta = await prisma.consulta.create({
      data: {
        pacienteId,
        medicoId,
        dia: new Date(dia),
        hora,
        dataHora,
        detalhes
      },
      include: {
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true, email: true } }
      }
    });

    return res.status(201).json({
      message: 'Consulta agendada com sucesso',
      consulta
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar consulta' }
    });
  }
};

/**
 * LISTAR CONSULTAS
 */
export const listConsultas = async (req, res) => {
  try {
    const { perfil, id } = req.user;
    const where = {};

    if (perfil === 'PACIENTE') where.pacienteId = id;
    if (perfil === 'MEDICO') where.medicoId = id;

    const consultas = await prisma.consulta.findMany({
      where,
      include: {
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true, email: true } }
      },
      orderBy: { dataHora: 'asc' }
    });

    return res.json({ consultas });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao listar consultas' }
    });
  }
};

/**
 * BUSCAR CONSULTA
 */
export const getConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil, id: userId } = req.user;

    const consulta = await prisma.consulta.findUnique({
      where: { id },
      include: {
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true, email: true } }
      }
    });

    if (!consulta) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Consulta não encontrada' }
      });
    }

    if (
      (perfil === 'PACIENTE' && consulta.pacienteId !== userId) ||
      (perfil === 'MEDICO' && consulta.medicoId !== userId)
    ) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Acesso negado' }
      });
    }

    return res.json({ consulta });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar consulta' }
    });
  }
};

/**
 * ATUALIZAR CONSULTA
 */
export const updateConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, detalhes } = req.body;
    const { perfil, id: userId } = req.user;

    const consulta = await prisma.consulta.findUnique({ where: { id } });

    if (!consulta) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Consulta não encontrada' }
      });
    }

    if (
      (perfil === 'PACIENTE' && consulta.pacienteId !== userId) ||
      (perfil === 'MEDICO' && consulta.medicoId !== userId)
    ) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Acesso negado' }
      });
    }

    const data = {};

    if (status) {
      const validos = ['AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU'];
      if (!validos.includes(status)) {
        return res.status(400).json({
          error: { code: 'VALIDATION_ERROR', message: 'Status inválido' }
        });
      }
      data.status = status;
    }

    if (detalhes !== undefined) data.detalhes = detalhes;

    const consultaAtualizada = await prisma.consulta.update({
      where: { id },
      data,
      include: {
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true, email: true } }
      }
    });

    return res.json({
      message: 'Consulta atualizada com sucesso',
      consulta: consultaAtualizada
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao atualizar consulta' }
    });
  }
};

/**
 * CANCELAR CONSULTA
 */
export const deleteConsulta = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil, id: userId } = req.user;

    const consulta = await prisma.consulta.findUnique({ where: { id } });

    if (!consulta) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Consulta não encontrada' }
      });
    }

    if (
      (perfil === 'PACIENTE' && consulta.pacienteId !== userId) ||
      (perfil === 'MEDICO' && consulta.medicoId !== userId)
    ) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Acesso negado' }
      });
    }

    const consultaCancelada = await prisma.consulta.update({
      where: { id },
      data: { status: 'CANCELADA' }
    });

    return res.json({
      message: 'Consulta cancelada com sucesso',
      consulta: consultaCancelada
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao cancelar consulta' }
    });
  }
};
