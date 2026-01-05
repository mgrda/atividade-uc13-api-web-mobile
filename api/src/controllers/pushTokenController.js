import prisma from '../config/database.js';

/**
 * @swagger
 * tags:
 *   - name: Push Tokens
 *     description: Gerenciamento de tokens para notificações mobile/web
 */

/**
 * @swagger
 * /push-tokens:
 *   post:
 *     summary: Registra ou atualiza um token de push notification
 *     tags: [Push Tokens]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - plataforma
 *             properties:
 *               token:
 *                 type: string
 *               plataforma:
 *                 type: string
 *                 enum: [ios, android, web]
 */
export const registerPushToken = async (req, res) => {
  try {
    const { token, plataforma } = req.body;
    const userId = req.user.id;

    if (!token || !plataforma) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Token e plataforma são obrigatórios' }
      });
    }

    const plataformasValidas = ['ios', 'android', 'web'];
    if (!plataformasValidas.includes(plataforma)) {
      return res.status(400).json({
        error: { code: 'VALIDATION_ERROR', message: 'Plataforma inválida' }
      });
    }

    const tokenExistente = await prisma.pushToken.findUnique({
      where: { token }
    });

    if (tokenExistente) {
      const pushToken = await prisma.pushToken.update({
        where: { token },
        data: {
          usuarioId: userId,
          plataforma,
          ativo: true
        }
      });

      return res.json({ message: 'Token atualizado com sucesso', pushToken });
    }

    const pushToken = await prisma.pushToken.create({
      data: {
        usuarioId: userId,
        token,
        plataforma,
        ativo: true
      }
    });

    return res.status(201).json({ message: 'Token registrado com sucesso', pushToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao registrar token' }
    });
  }
};

/**
 * @swagger
 * /push-tokens/{id}:
 *   delete:
 *     summary: Desativa um token de push notification
 *     tags: [Push Tokens]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
export const deletePushToken = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const pushToken = await prisma.pushToken.findUnique({ where: { id } });

    if (!pushToken) {
      return res.status(404).json({
        error: { code: 'RESOURCE_NOT_FOUND', message: 'Token não encontrado' }
      });
    }

    if (pushToken.usuarioId !== userId) {
      return res.status(403).json({
        error: { code: 'AUTH_FORBIDDEN', message: 'Acesso negado' }
      });
    }

    await prisma.pushToken.update({
      where: { id },
      data: { ativo: false }
    });

    return res.json({ message: 'Token removido com sucesso' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao remover token' }
    });
  }
};
