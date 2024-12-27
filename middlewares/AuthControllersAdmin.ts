import { NextFunction, Request, Response } from "express"; // Importa os tipos Request, Response e NextFunction do Express
import jwt from "jsonwebtoken";// Importa a biblioteca jsonwebtoken para trabalhar com tokens JWT
import { Errors } from "../utils/Errors";
import { prisma } from "../database/prisma";

// Interface para representar o token decodificado
interface DecodedToken {
    userId: string; // ID do usuário contido no token
}
export const updateSessionInfo = async (userId: number) => {
    const now = new Date();
    const sessionExpiresAt = new Date(now.getTime() + (2 * 60 * 60 * 1000)); // Adiciona 2 horas à data atual

    const data = await prisma.user_Admin.update({
        where: { id: userId },
        data: {
            lastActivity: now,
            sessionExpiresAt: sessionExpiresAt,
        },
    });
    return data;
};
// Middleware de autenticação
export const authMiddlewareAdmin = (requiredPermissions?: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization; // Obtém o cabeçalho de autorização da requisição

        // Verifica se o cabeçalho de autorização ou o token não foram fornecidos
        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return Errors.UnathourizedError({ message: "Token não fornecido", name: "" }, res) // Retorna um erro de não autorizado
        }

        const token = authHeader.substring(7); // Extrai o token JWT do cabeçalho

        try {
            const JWT_SECRET: string = process.env.JWT_SECRET || " "; // Obtém o segredo JWT da variável de ambiente ou usa um valor padrão
            // Verifica se o token é válido e decodifica-o
            const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
            req.user = { id: decodedToken.userId }; // Define o ID do usuário na requisição



            // Verifica se são necessárias permissões específicas
            if (requiredPermissions) {
                // Busca o usuário no banco de dados pelo ID contido no token decodificado
                const user = await prisma.user_Admin.findUnique({
                    where: {
                        id: Number(decodedToken.userId)
                    }, include: {
                        profileTypes: {
                            include: {
                                type: {
                                    select: {
                                        permissions: {
                                            select: {
                                                permissoes: {
                                                    select: {
                                                        name: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                )

                // Retorna um erro se o usuário não for encontrado
                if (!user) {
                    return Errors.NotFoundError({ message: "Usuário não encontrado", name: "" }, res)
                }
                if (!user.active) return Errors.UnathourizedError({ message: "Não autorizado, Usuario Bloqueado", name: "" }, res);

                const now = new Date();
                const sessionExpiresAt = user?.sessionExpiresAt;

                if (!sessionExpiresAt || now > sessionExpiresAt) {
                    return Errors.UnathourizedError({ message: 'Sessão expirada. Faça login novamente.', name: "" }, res);
                }

                // Atualiza lastActivity para estender a sessão
                await updateSessionInfo(user.id);

                if (user?.isSuperAdmin) {
                    return next();
                }
                // Obtém as permissões do usuário a partir dos tipos de perfil associados a ele
                const userPermissions = user.profileTypes.flatMap(profile =>
                    profile.type.permissions.map(permission => permission.permissoes.name)
                );

                // Verifica se o usuário possui todas as permissões necessárias
                const hasPermissions = requiredPermissions.every(p => userPermissions.includes(p));

                // Retorna um erro de acesso proibido se o usuário não tiver as permissões necessárias
                if (!hasPermissions) {
                    return Errors.UnathourizedError({ message: "Permissão negada", name: "" }, res);
                }
            }
            return next(); // Chama o próximo middleware na cadeia de execução
        } catch (error: any) {

            if (error.name === 'TokenExpiredError') {
                return Errors.UnathourizedError({ message: 'Token expirado', name: '' }, res);
            }
            return Errors.BadRequestError({ message: error.message, name: error.name }, res)
        }
    };
};
