import { Request, Response } from "express";
import { Errors } from "../../../utils/Errors";
import { anuncio } from "../../../models/Artigo-analise-anuncio-model/anuncio-model/anuncio-model";


class Anuncio_Controllers {


    async CreateAnuncio(req: Request, res: Response) {
        const { id_artigo,
            percentagem_desconto,
            tipo_anuncio,
            descricao, authorId } = req.body

        try {
            const data = await anuncio.CreateAnuncio(Number(id_artigo),Number(authorId), Number(percentagem_desconto), tipo_anuncio, descricao)

            res.status(201).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao criar Anuncio", name: "" }, res)
        }
    }
   
    async UpdateAnuncio(req: Request, res: Response) {
        const { id, percentagem_desconto, tipo_anuncio, descricao } = req.body

        try {
            const result = await anuncio.Get_Anuncio_Unique(Number(id))

            if (!result) {
                return Errors.NotFoundError({ message: "Erro Anuncio não encotrado", name: "" }, res)
            }

            const data = await anuncio.Update_Anuncio(Number(id), Number(percentagem_desconto), tipo_anuncio, descricao)

            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao actualizar anuncio", name: "" }, res)
        }
    }

    async Delete_Anuncio(req: Request, res: Response) {
        const { id } = req.params

        try {
            const result = await anuncio.Get_Anuncio_Unique(Number(id))

            if (!result) {
                return Errors.NotFoundError({ message: "Erro anuncio não encotrado", name: "" }, res)
            }

            const data = await anuncio.Delete_Anuncio_Unique(Number(id));

            res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao deletar Artigo", name: "" }, res)
        }
    }
}

export const Anuncio_Control = new Anuncio_Controllers()

