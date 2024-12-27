import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../models/usersModel/userModel";
import { Errors } from "../utils/Errors";
import { prisma } from "../database/prisma";

// Interface para representar o token decodificado
interface DecodedToken {
    userId: string;
}

// Middleware de autenticação
export const authMiddleware = (requiredPermissions?: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return Errors.UnathourizedError({ message: "Token não fornecido", name: "" }, res);
        }

        const token = authHeader.substring(7);
        try {
            const JWT_SECRET: string = process.env.JWT_SECRET || " ";
            const decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
            req.user = { id: decodedToken.userId };

            if (requiredPermissions) {
                const user = await userModel.findById(Number(decodedToken.userId));

                if (!user) {
                    return Errors.NotFoundError({ message: "Usuário não encontrado", name: "" }, res);
                }

                // Verificar se o usuário possui as permissões necessárias e não está bloqueado
                for (const permissionName of requiredPermissions) {
                    let permission, isBlocked;
                    if (user.type === "Singular") {

                        permission = await prisma.permissions_app.findFirst({
                            where: {
                                name: permissionName,
                                is_singular: true,
                            },
                        });

                        if (!permission) {
                            return Errors.ForbiddenError({ message: `Permissão ${permissionName} não encontrada ou não é singular`, name: "" }, res);
                        }
                        if (!permission?.status) return Errors.ForbiddenError({ message: `Permissão ${permissionName} está desativada ou não é singular`, name: "" }, res);

                        isBlocked = await prisma.bloqueio_user_app.findFirst({
                            where: {
                                UserId: Number(decodedToken.userId),
                                permissionId: permission.id,
                                blockedUntil: {
                                    gte: new Date(), // Verifique se a data e hora atual estão antes de `blockedUntil`
                                  },
                            },
                        });


                        if (isBlocked) {
                            return Errors.ForbiddenError({ message: `Usuário bloqueado para a permissão ${permissionName}`, name: "" }, res);
                        }
                    }
                     else if (user.type === "Empresa") {
                        permission = await prisma.permissions_app.findFirst({
                            where: {
                                name: permissionName,
                                is_empresa: true,
                            },
                        });

                        if (!permission) {
                            return Errors.ForbiddenError({ message: `Permissão ${permissionName} não encontrada ou não é empresa`, name: "" }, res);
                        }
                        if (!permission?.status) return Errors.ForbiddenError({ message: `Permissão ${permissionName} está desativada ou não é empresa`, name: "" }, res);

                        isBlocked = await prisma.bloqueio_user_app.findFirst({
                            where: {
                                UserId: Number(decodedToken.userId),
                                permissionId: permission.id,
                            },
                        });

                        if (isBlocked) {
                            return Errors.ForbiddenError({ message: `Usuário bloqueado para a permissão ${permissionName}`, name: "" }, res);
                        }
                    }
                     else {
                        return Errors.ForbiddenError({ message: `Tipo de usuário inválido`, name: "" }, res);
                    }
                }
            }

            return next();
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                return Errors.UnathourizedError({ message: 'Token expirado', name: '' }, res);
            }

            return Errors.BadRequestError({ message: "Erro no middleware de autenticação", name: "" }, res);
        }
    };
};
