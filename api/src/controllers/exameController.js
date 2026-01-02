import prisma from '../config/database.js';

const STATUS_VALIDOS = ['AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU'];

/**
 * CRIAR EXAME
 */
export const createExame = async (req, res) => {
  try {
    const { nome, pacienteId, medicoId, dia, hora, detalhes } = req.body;
    const { userPerfil, userId } = req;

    if (!nome || !pacienteId || !medicoId || !dia || !hora) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Campos obrigatórios ausentes' }
      });
    }

    if (userPerfil === 'PACIENTE' && pacienteId !== userId) {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Paciente só pode agendar para si' }
      });
    }

    const medico = await prisma.usuario.findUnique({ where: { id: medicoId } });
    if (!medico || medico.perfil !== 'MEDICO') {
      return res.status(400).json({
        error: { code: 'INVALID_MEDICO', message: 'Médico inválido' }
      });
    }

    const [h, m] = hora.split(':').map(Number);
    const dataHora = new Date(dia);
    dataHora.setHours(h, m, 0, 0);

    const conflito = await prisma.exame.findFirst({
      where: { medicoId, dataHora }
    });

    if (conflito) {
      return res.status(409).json({
        error: { code: 'SLOT_UNAVAILABLE', message: 'Horário indisponível' }
      });
    }

    const exame = await prisma.exame.create({
      data: {
        nome,
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
      message: 'Exame criado com sucesso',
      exame
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};

/**
 * LISTAR EXAMES
 */
export const listExames = async (req, res) => {
  try {
    const { userPerfil, userId } = req;

    const where = {};
    if (userPerfil === 'PACIENTE') where.pacienteId = userId;
    if (userPerfil === 'MEDICO') where.medicoId = userId;

    const exames = await prisma.exame.findMany({
      where,
      orderBy: { dataHora: 'asc' },
      include: {
        paciente: { select: { id: true, nome: true } },
        medico: { select: { id: true, nome: true } }
      }
    });

    res.json({ exames });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};

/**
 * BUSCAR EXAME POR ID
 */
export const getExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { userPerfil, userId } = req;

    const exame = await prisma.exame.findUnique({
      where: { id },
      include: {
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true, email: true } },
        resultados: true
      }
    });

    if (!exame) {
      return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    }

    if (
      (userPerfil === 'PACIENTE' && exame.pacienteId !== userId) ||
      (userPerfil === 'MEDICO' && exame.medicoId !== userId)
    ) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    res.json({ exame });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};

/**
 * ATUALIZAR EXAME
 */
export const updateExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, detalhes } = req.body;
    const { userPerfil, userId } = req;

    const exame = await prisma.exame.findUnique({ where: { id } });
    if (!exame) {
      return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    }

    if (
      (userPerfil === 'PACIENTE' && exame.pacienteId !== userId) ||
      (userPerfil === 'MEDICO' && exame.medicoId !== userId)
    ) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    if (status && !STATUS_VALIDOS.includes(status)) {
      return res.status(400).json({ error: { code: 'INVALID_STATUS' } });
    }

    const exameAtualizado = await prisma.exame.update({
      where: { id },
      data: { status, detalhes },
      include: {
        paciente: { select: { id: true, nome: true } },
        medico: { select: { id: true, nome: true } }
      }
    });

    res.json({
      message: 'Exame atualizado com sucesso',
      exame: exameAtualizado
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};

/**
 * CANCELAR EXAME (DELETE LÓGICO)
 */
export const deleteExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { userPerfil, userId } = req;

    const exame = await prisma.exame.findUnique({ where: { id } });
    if (!exame) {
      return res.status(404).json({ error: { code: 'NOT_FOUND' } });
    }

    if (userPerfil === 'PACIENTE' && exame.pacienteId !== userId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    const cancelado = await prisma.exame.update({
      where: { id },
      data: { status: 'CANCELADA' }
    });

    res.json({
      message: 'Exame cancelado com sucesso',
      exame: cancelado
    });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};
