import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
//import { provider } from "../PostControllers/post_image";
import { habito } from "../../models/habito_Model/habito_Model";
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";
import Validations from "../../utils/validate";


class Habito_Controllers {

    async Create(req: Request, res: Response) {
        const { name, provinceId, description, type } = req.body

       
        const Isname :any =  Validations.isValidName(name)
        const isdescription :any =  Validations.isValidDescription(description)
       
           if(Isname.message){
            return  Errors.BadRequestError({ message: Isname.message, name: "" }, res);
           }
           if(isdescription.message){
            return  Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
           }

        let photos: string[] = []
        try {
            if (req.files && Array.isArray(req.files)) {
                // Process multiple files
                for (const file of req.files) {
                    //   const uploadResult = await provider.upload(file, "habitos/");

                    if (file.mimetype.startsWith('image/')) {
                        photos.push('media/' + file.filename)
                    }
                }
            } else if (req.file) {

                if (req.file.mimetype.startsWith('image/')) {
                    photos.push('media/' + req.file.filename)
                }
            }
            const data = await habito.Create(name, Number(provinceId), description, type, photos)
    
            return res.status(201).json({ message: "Cadastrado", data})
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }

    }

    async getAllProvinceHabitatsByProvince(req: Request, res: Response) {
        try {
            const {provinceId} = req.params
            const data = await habito.getAllProvinceHabitatsByProvince( Number(provinceId));
            return res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao obter habitos nesta provincia", name: "" }, res)
        }

    }

    async getProvinceHabitatsByType(req: Request, res: Response) {
        const { type } = req.body;

        try {
            const data = await habito.getProvinceHabitatsByType(type)

            return res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao obter habitos nesta provincia", name: "" }, res)
        }
    }

    async SearchProvinceHabitatsByProvince(req: Request, res: Response) {
        const { query } = req.body;

        try {
            const data = await habito.SearchProvinceHabitatsByProvince(query)

            return res.status(200).json({ data })
        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao obter habitos nesta provincia", name: "" }, res)
        }
    }


    async updateProvinceHabitats(req: Request, res: Response) {

        const { id, name, provinceId, description, type } = req.body

        try {
            const data = await habito.updateProvinceHabitat(Number(id), { name, provinceId: Number(provinceId), description, type })

            return res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }


    async Delete(req: Request, res: Response) {
        const { id } = req.params
        try {

            const result: any = await habito.getProvinceHabitatsById(Number(id))
                if(result?.photos.length > 0){
                    for(const file of result.photos){
                    await excluirImagemNoDiretorio(file)
                }
                }
            const data = await habito.deleteProvinceHabitat(Number(id))
            res.status(200).json({ message: `Habito da provincia ${result.name} deletado`, data })
        } catch (error) {
            Errors.BadRequestError({ message: "erro ao deletar habitos da provincia", name: "" }, res)
        }

    }
}

export const habitoControllers = new Habito_Controllers()