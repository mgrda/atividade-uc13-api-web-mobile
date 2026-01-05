import { Prisma } from '@prisma/client';

export const errorHandler = (err, req, res, next) => {
    // Log do erro para o desenvolvedor
    console.error(' [Error Handler]:', err);

    // Erros de Validação (Geral)
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: {
                code: 'VALIDATION_ERROR',
                message: err.message || 'Erro de validação',
                details: err.errors
            }
        });
    }

    // Erros Específicos do Prisma
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Conflito de Unique Constraint (ex: e-mail duplicado ou conflito de horário)
        if (err.code === 'P2002') {
            return res.status(409).json({
                error: {
                    code: 'RESOURCE_CONFLICT',
                    message: 'Um registro com estes dados já existe.',
                    target: err.meta?.target // Indica qual campo causou o erro
                }
            });
        }

        // P2025: Operação falhou porque o registro não foi encontrado
        if (err.code === 'P2025') {
            return res.status(404).json({
                error: {
                    code: 'RESOURCE_NOT_FOUND',
                    message: 'O registro solicitado não foi encontrado.'
                }
            });
        }
    }

    // Erros de Token (JWT)
    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: {
                code: 'AUTH_INVALID_TOKEN',
                message: 'Token inválido ou malformatado.'
            }
        });
    }

    // Erro Padrão (Fallback para 500)
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Ocorreu um erro interno no servidor.',
            // Mostra o erro real apenas se estiver em modo desenvolvimento
            stack: isDev ? err.stack : undefined 
        }
    });
};