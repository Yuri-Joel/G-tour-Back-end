import { Response, Request } from "express"
import { businessModel } from "../../models/NegocioModel/NegocioModel"
import { Errors } from "../../utils/Errors"
import Validations from "../../utils/validate"

class BusinessControllers {

    async Create(req: Request, res: Response) {
        const { name, description } = req.body
        console.log(name, description)
        const Isname: any = Validations.isValidName(name)
        const isdescription: any = Validations.isValidDescription(description)

        if (Isname.message) {
            return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
        }

        if (isdescription.message) {
            return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
        }

        try {
            const data = await businessModel.Create({ name, description })
            res.status(201).json({ message: "area de negocio adicionada", data })
        } catch (error) {
            Errors.BadRequestError({ message: "erro ao inserir Area de negocio", name: "" }, res)
        }

    }

    async Get_Business(_: any, res: Response) {

        try {
            const data = await businessModel.Get_Business();
            res.status(200).json({ data })

        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao obter a area de negocio", name: "" }, res)
        }
    }

    async Update_Business(req: Request, res: Response) {
        const { id, name, description } = req.body
        const Isname: any = Validations.isValidName(name)
        const isdescription: any = Validations.isValidDescription(description)

        if (Isname.message) {
            return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
        }

        if (isdescription.message) {
            return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
        }

        try {
            const data = await businessModel.Update_Business(Number(id), { name, description })

            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao Actualizar a area de negocio", name: "" }, res)
        }
    }

    async Delete_Business(req: Request, res: Response) {
        const { id } = req.params
        try {
            await businessModel.Delete_Business(Number(id))
            res.status(200).json({ message: "Deletado com sucesso" })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao Deletar a area de negocio", name: "" }, res)
        }
    }

    async Search_Business(req: Request, res: Response) {
        const { query } = req.body
        try {
            const data = await businessModel.Search(query)
            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao Deletar a area de negocio", name: "" }, res)
        }
    }



}

export const businessControllers = new BusinessControllers()