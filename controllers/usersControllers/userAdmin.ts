import { user_admin } from "../../models/usersModel/user_admin";
import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
import bcrypt from 'bcrypt'
import Validations from "../../utils/validate";
class UserAdmin {

    async CreateAdmin(req: Request, res: Response) {

        const { nome, telefone, senha, email } = req.body

        try {
            const isphoneNumber: any = Validations.isValidPhoneNumber(telefone)

            const isvalidName: any = Validations.isValidName(nome)
            const isPassword: any = Validations.validatePassword(senha)


            if (isPassword.message) {
                return Errors.BadRequestError({ message: isPassword.message, name: "" }, res);
            }
            if (isphoneNumber.message) {
                return Errors.BadRequestError({ message: isphoneNumber.message, name: "" }, res);
            }
            if (isvalidName.message) {
                return Errors.BadRequestError({ message: isvalidName.message, name: "" }, res);
            }

            const existingUser = await user_admin.findByEmail(email)
            const existingUserTelefone = await user_admin.findByEmail(telefone)

            if (existingUser || existingUserTelefone) {

                return Errors.handleError({ message: "Email ou Telefone Já existe", name: "" }, res)
            }
            const data = await user_admin.Store(email, senha, nome, telefone)
            res.status(200).json({ data, message: `Utilizador ${data.name} criado com sucesso` })
        } catch (error: any) {
            Errors.BadRequestError({ message: error.message, name: "" }, res)
        }
    }
    async StatusAdmin(req: Request, res: Response) {

        const { userId, active } = req.body

        try {
            const data = await user_admin.UpdateAdminStatus(Number(userId), { active })
            res.status(200).json({ data, message: "Actualizado com Sucesso" })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }
    async GetById(req: Request, res: Response) {
        const data = await user_admin.findById(Number(req.params.id))
        try {
            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }
    async Delete_Admin(req: Request, res: Response) {
        const data = await user_admin.Delete(Number(req.params.id))
        try {
            res.status(200).json({ data, message: ` usuario ${data.name} Eliminado` })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }
    async GetAll(_: any, res: Response) {

        try {
            const data = await user_admin.findAll();
            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }

    async UpdateProfile(req: Request, res: Response) {
        const { name, telefone, email } = req.body
        try {
            const data = await user_admin.UpdateAdmin(Number(req.params.id), { name, telefone, email })
            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }

    async UpdatePassword(req: Request, res: Response) {
        const { novaSenha, senhaActual } = req.body

        try {
            const user = await user_admin.findById(Number(req.params.id));

            // Se o usuário não existir ou a senha estiver incorreta
            if (!user || !(await bcrypt.compare(senhaActual, user.password))) {
                const error: any = {
                    message: "Senha Errada"
                };
                // Retorna um erro de não autorizado
                return Errors.BadRequestError(error, res);
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(novaSenha, salt);
            const data = await user_admin.UpdatePassowrd(Number(req.params.id), { password: hashedPassword })
            res.status(200).json({ data, message: "Actualizada" })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro na busca de dados", name: "" }, res)
        }
    }


    async AddPerfil(req: Request, res: Response) {
        const { userId, perfilId } = req.body;
        try {
            const data = await user_admin.AddPerfil(Number(userId), Number(perfilId))
            res.status(200).json({ data, message: "Perfil Adicionado" })
        } catch (error) {
            Errors.BadRequestError({ message: "Erroao adicionar Perfil", name: "" }, res)
        }
    }
    async RemovePerfil(req: Request, res: Response) {
        const { userId, perfilId } = req.body;
        try {
            const data = await user_admin.RemovePerfil(Number(userId), Number(perfilId))
            res.status(200).json({ data, message: "Perfil Removido" })
        } catch (error) {
            Errors.BadRequestError({ message: "Erroao adicionar Perfil", name: "" }, res)
        }
    }

}

export const userAdmin = new UserAdmin()