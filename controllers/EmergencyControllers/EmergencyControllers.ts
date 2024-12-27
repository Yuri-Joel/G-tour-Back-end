
// src/controllers/EmergenciaController.ts
import { Request, Response } from 'express';
import { emergenciaModel } from '../../models/EmergencyModel/emergencyModel';
import { Errors } from '../../utils/Errors';
import Validations from '../../utils/validate';
// Certifique-se de ter um módulo de Errors definido

class EmergenciaController {
    async createEmergencia(req: Request, res: Response) {
        const { name, telefone, description, type, latitude, longitude } = req.body;

        const isphoneNumber: any = Validations.isValidPhoneNumber(telefone)
        const Isname: any = Validations.isValidName(name)
        const isdescription: any = Validations.isValidDescription(description)
        const islatitude: any = Validations.isValidLatitude(latitude)
        const islongitude: any = Validations.isValidLongitude(longitude)
      /*   if (isphoneNumber.message) {
            return Errors.BadRequestError({ message: isphoneNumber.message, name: "" }, res);
        } */
        if (Isname.message) {
            return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
        }
        if (isdescription.message) {
            return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
        }
        
        if (islatitude.message) {
            return Errors.BadRequestError({ message: islatitude.message, name: "" }, res);
        }
        if (islongitude.message) {
            return Errors.BadRequestError({ message: islongitude.message, name: "" }, res);
        }
               
        try {
            const result = await emergenciaModel.getEmergenciasByname(name);
            if (result) {
                return Errors.handleError({ message: "Nome Já existe", name: "" }, res)
            }
            const emergencia = await emergenciaModel.createEmergencia({ name, telefone, description, type, latitude: Number(latitude), longitude: Number(longitude) });
            res.status(201).json(emergencia);
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async getEmergencias(req: Request, res: Response) {
        try {
            const data = await emergenciaModel.getEmergencias();
            res.status(200).json({ data });
        } catch (error) {
            Errors.BadRequestError({ message: "Erro no servidor", name: "" }, res)
        }
    }

    async updateEmergencia(req: Request, res: Response) {
        const { id } = req.params;
        const { name, telefone, description, type, latitude, longitude } = req.body;


        const isphoneNumber: any = Validations.isValidPhoneNumber(telefone)
        const Isname: any = Validations.isValidName(name)
        const isdescription: any = Validations.isValidDescription(description)
        const islatitude: any = Validations.isValidLatitude(latitude)
        const islongitude: any = Validations.isValidLongitude(longitude)
       
        /* if (isphoneNumber.message) {
            return Errors.BadRequestError({ message: isphoneNumber.message, name: "" }, res);
        } */
        if (Isname.message) {
            return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
        }
        if (isdescription.message) {
            return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
        }

        if (islatitude.message) {
            return Errors.BadRequestError({ message: islatitude.message, name: "" }, res);
        }
        if (islongitude.message) {
            return Errors.BadRequestError({ message: islongitude.message, name: "" }, res);
        }
        if (isdescription.message) {
            return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
        }
        

        try {
            const emergencia = await emergenciaModel.updateEmergencia(parseInt(id, 10), { name, telefone, description, type, latitude: Number(latitude), longitude: Number(longitude) });
            res.status(200).json(emergencia);
        } catch (error) {
            Errors.BadRequestError({ message: "Erro no servidor", name: "" }, res)
        }
    }

    async deleteEmergencia(req: Request, res: Response) {
        const { id } = req.params;

        try {
            await emergenciaModel.deleteEmergencia(Number(id));
            res.status(200).json({ message: "deletado Emergencia" });
        } catch (error) {
            Errors.BadRequestError({ message: "Erro no servidor", name: "" }, res)
        }
    }
    async SearchEmergencia(req: Request, res: Response) {
        const { query } = req.body;

        try {
            const data = await emergenciaModel.SearchEmergencia(query);
            res.status(200).json({ data });
        } catch (error) {
            Errors.BadRequestError({ message: "Erro no servidor", name: "" }, res)
        }
    }


}

export const emergenciaController = new EmergenciaController();
