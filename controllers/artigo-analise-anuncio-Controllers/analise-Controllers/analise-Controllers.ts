import { Request, Response } from "express";
import { Errors } from "../../../utils/Errors";
import { analiseMercado } from "../../../models/Artigo-analise-anuncio-model/analise-model/analise-model";


class Analise_Controllers {


    async CreateAnalise(req: Request, res: Response){
        const { id_artigo, questao, tipo_resposta, opcoes, authorId} = req.body

        try {
            console.log(id_artigo, questao, tipo_resposta, opcoes, authorId, req.body)
            const data = await analiseMercado.CreateAnaliseMercado(Number(id_artigo),Number(authorId), questao, tipo_resposta, opcoes)

            res.status(201).json({data})
            
        } catch (error: any) {
            Errors.BadRequestError({message: error.message, name: ""}, res)
        }
    }
    async GetAnalise(req: Request, res: Response){
        const {id_artigo} = req.params

        try {
            const data = await analiseMercado.get_AnaliseMercado(Number(id_artigo))

            res.status(200).json({data})
        } catch (error) {
            Errors.BadRequestError({message: "Erro ao Obter Analise", name: ""}, res)
        }
    }
    async UpdateAnalise(req: Request, res: Response){
        const { id ,questao} = req.body

        try {
            const result = await analiseMercado.Get_AnaliseMercado_Unique(Number(id))

            if(!result){
             return   Errors.NotFoundError({message: "Erro Produto não encotrado", name: ""}, res)
            }

            const data = await analiseMercado.Update_AnaliseMercado(Number(id), questao)

            res.status(200).json({data})
        } catch (error) {
            Errors.BadRequestError({message: "Erro ao Actualizar Analise", name: ""}, res)
        }
    }

    async DeleteAnalise(req: Request, res: Response){
        const { id } = req.params

        try {
            const result = await analiseMercado.Get_AnaliseMercado_Unique(Number(id))

            if(!result){
             return   Errors.NotFoundError({message: "Erro Produto não encotrado", name: ""}, res)
            }

            const data = await analiseMercado.Delete_AnaliseMercado_Unique(Number(id));

            res.status(200).json({data})
        } catch (error) {
            Errors.BadRequestError({message: "Erro ao Deletar Analise de Mercado", name: ""}, res)
        }
    }

    async Resposta_analise_Mercado(req: Request, res: Response){
        const {id_user, id_resposta} = req.body

        try {
    
    console.log(id_resposta, id_user);
            
            const data = await analiseMercado.resposta_AnaliseMercado(Number(id_resposta),Number(id_user));

            res.status(201).json({data})
        } catch (error: any) {
            Errors.BadRequestError({message: error.message, name: ""}, res)
        }

    }
}

export const analise_Control = new Analise_Controllers()