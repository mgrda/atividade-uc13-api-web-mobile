import prisma from '../config/database.js';

const STATUS_VALIDOS = ['AGENDADA', 'REALIZADA', 'CANCELADA', 'NAO_COMPARECEU'];

/**
 * @swagger
 * tags:
 *   - name: Exames
 *     description: Gerenciamento de exames laboratoriais e clínicos
 */

/**
 * @swagger
 * /exames:
 *   post:
 *     summary: Cria um novo exame
 *     tags: [Exames]
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
 *               - pacienteId
 *               - medicoId
 *               - dia
 *               - hora
 *             properties:
 *               nome:
 *                 type: string
 *               pacienteId:
 *                 type: string
 *               medicoId:
 *                 type: string
 *               dia:
 *                 type: string
 *                 format: date
 *               hora:
 *                 type: string
 *                 example: "08:00"
 *               detalhes:
 *                 type: string
 */
export const createExame = async (req, res) => {
  try {
    const { nome, pacienteId, medicoId, dia, hora, detalhes } = req.body;
    const { perfil: userPerfil, id: userId } = req.user;

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
 * @swagger
 * /exames:
 *   get:
 *     summary: Lista os exames do usuário logado
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 */
export const listExames = async (req, res) => {
  try {
    const { perfil: userPerfil, id: userId } = req.user;

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
 * @swagger
 * /exames/{id}:
 *   get:
 *     summary: Busca detalhes de um exame e seus resultados
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const getExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil: userPerfil, id: userId } = req.user;

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
 * @swagger
 * /exames/{id}:
 *   put:
 *     summary: Atualiza status ou detalhes de um exame
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const updateExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, detalhes } = req.body;
    const { perfil: userPerfil, id: userId } = req.user;

    const exame = await prisma.exame.findUnique({ where: { id } });
    if (!exame) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

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

    res.json({ message: 'Exame atualizado com sucesso', exame: exameAtualizado });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};

/**
 * @swagger
 * /exames/{id}:
 *   delete:
 *     summary: Cancela um exame
 *     tags: [Exames]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const deleteExame = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: userId, perfil: userPerfil } = req.user;

    const exame = await prisma.exame.findUnique({ where: { id } });
    if (!exame) return res.status(404).json({ error: { code: 'NOT_FOUND' } });

    if (userPerfil === 'PACIENTE' && exame.pacienteId !== userId) {
      return res.status(403).json({ error: { code: 'FORBIDDEN' } });
    }

    const cancelado = await prisma.exame.update({
      where: { id },
      data: { status: 'CANCELADA' }
    });

    res.json({ message: 'Exame cancelado com sucesso', exame: cancelado });
  } catch (error) {
    res.status(500).json({ error: { code: 'SERVER_ERROR' } });
  }
};
