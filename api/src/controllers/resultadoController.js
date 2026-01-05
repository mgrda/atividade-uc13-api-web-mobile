import prisma from '../config/database.js';

/**
 * @swagger
 * tags:
 *   - name: Resultados
 *     description: Laudos e arquivos de resultados de exames
 */

/**
 * @swagger
 * /resultados:
 *   post:
 *     summary: Cria um novo resultado de exame
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - exameId
 *               - pacienteId
 *               - medicoId
 *             properties:
 *               exameId:
 *                 type: string
 *               pacienteId:
 *                 type: string
 *               medicoId:
 *                 type: string
 *               detalhes:
 *                 type: string
 *               arquivoUrl:
 *                 type: string
 */
export const createResultado = async (req, res) => {
  try {
    const { exameId, pacienteId, medicoId, detalhes, arquivoUrl } = req.body;
    const { perfil: userPerfil, id: userId } = req.user;

    if (!exameId || !pacienteId || !medicoId) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Exame, paciente e médico são obrigatórios' }
      });
    }

    if (!['MEDICO', 'ADMIN'].includes(userPerfil)) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'Apenas médicos e administradores podem criar resultados'
        }
      });
    }

    if (userPerfil === 'MEDICO' && medicoId !== userId) {
      return res.status(403).json({
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'O médico só pode criar resultados vinculados a si mesmo'
        }
      });
    }

    const exame = await prisma.exame.findUnique({ where: { id: exameId } });
    if (!exame) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Exame não encontrado' }
      });
    }

    const resultado = await prisma.resultadoExame.create({
      data: { exameId, pacienteId, medicoId, detalhes, arquivoUrl },
      include: {
        exame: { select: { id: true, nome: true } },
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true } }
      }
    });

    return res.status(201).json({
      message: 'Resultado criado com sucesso',
      resultado
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar resultado' }
    });
  }
};

/**
 * @swagger
 * /resultados:
 *   get:
 *     summary: Lista resultados de exames do usuário
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 */
export const listResultados = async (req, res) => {
  try {
    const { perfil: userPerfil, id: userId } = req.user;
    const whereClause = {};

    if (userPerfil === 'PACIENTE') whereClause.pacienteId = userId;
    else if (userPerfil === 'MEDICO') whereClause.medicoId = userId;

    const resultados = await prisma.resultadoExame.findMany({
      where: whereClause,
      include: {
        exame: { select: { id: true, nome: true, dia: true, hora: true } },
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true } }
      },
      orderBy: { publicadoEm: 'desc' }
    });

    return res.json({ resultados });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao listar resultados' }
    });
  }
};

/**
 * @swagger
 * /resultados/{id}:
 *   get:
 *     summary: Busca um resultado específico por ID
 *     tags: [Resultados]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const getResultado = async (req, res) => {
  try {
    const { id } = req.params;
    const { perfil: userPerfil, id: userId } = req.user;

    const resultado = await prisma.resultadoExame.findUnique({
      where: { id },
      include: {
        exame: { select: { id: true, nome: true, dia: true, hora: true } },
        paciente: { select: { id: true, nome: true, email: true } },
        medico: { select: { id: true, nome: true } }
      }
    });

    if (!resultado) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Resultado não encontrado' }
      });
    }

    const acessoNegado =
      (userPerfil === 'PACIENTE' && resultado.pacienteId !== userId) ||
      (userPerfil === 'MEDICO' && resultado.medicoId !== userId);

    if (acessoNegado) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Acesso negado' }
      });
    }

    return res.json({ resultado });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao buscar resultado' }
    });
  }
};
