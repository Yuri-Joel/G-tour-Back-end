// src/controllers/profileController.ts
import { Request, Response } from 'express'; // Importa os tipos Request e Response do Express
import { profileModel } from '../../models/PerfilModel/PerfilModel'; // Importa o modelo de perfil
import { Errors } from '../../utils/Errors';
import { Controler } from '../controller/controler';

export class ProfileController extends Controler {

    constructor(){
        super()
    }
    // Método para criar um novo perfil

    async createProfile(req: Request, res: Response) {
        const { name, description, permissionIds } = req.body;  // Extrai os dados do corpo da requisição
        try {
         
            // Verifica se um perfil com o mesmo nome já existe
            const existingPermission = await profileModel.findByName(name);
            if (existingPermission) {
                
                return Errors.handleError({ message: "Perfil já existe", name: ""}, res) // Retorna um erro se o perfil já existir
            }

            // Cria um novo perfil com as permissões fornecidas
            const data = await profileModel.create({ name, description, permissionIds });
            res.status(200).json({data}); // Retorna o novo perfil criado
            
        } catch (error: any) {
           return Errors.BadRequestError(error, res)// Loga um erro genérico no console
        }
    }
    async UpdateProfile(req: Request, res: Response) {
        const { name, description } = req.body;  // Extrai os dados do corpo da requisição
        const {id}=req.params
        try {
            // Actualiza o  perfil 
            const data = await profileModel.UpdateProfile(Number(id),{name, description})
            res.status(200).json({data}); // Retorna o novo perfil criado
            
        } catch (error: any) {
           return Errors.BadRequestError(error, res)// Loga um erro genérico no console
        }
    }

    // Método para obter todos os perfis
    async getAllProfiles(req: Request, res: Response) {
        try {
   
            const data = await profileModel.findAll(); // Busca todos os perfis
           
            res.json({data}); // Retorna os perfis encontrados
        } catch (error: any) {
           return Errors.BadRequestError({message: "erro no servidor", name: ""}, res)// Loga um erro genérico no console
        }
    }
  // Método para obter todos os perfis
  async StatusProfile(req: Request, res: Response) {
    try {
        const {id, status} = req.body
        const data = await profileModel.StatusProfie(Number(id), status) // Busca todos os perfis
       
        res.json({data, message: "Actualizado"}); // Retorna os perfis encontrados
    } catch (error: any) {
       return Errors.BadRequestError({message: "erro no servidor", name: ""}, res)// Loga um erro genérico no console
    }
}
async DeleteProfile(req: Request, res: Response) {
    try {
        const {id} = req.params
        const data = await profileModel.Delete(Number(id)) // Busca todos os perfis
       
        res.status(200).json({data, message: "Deletado perfil"}); // Retorna os perfis encontrados
    } catch (error: any) {
       return Errors.BadRequestError({message: "erro no servidor", name: ""}, res)// Loga um erro genérico no console
    }
}

    // Método para adicionar uma permissão a um perfil
    async addPermissionToProfile(req: Request, res: Response) {
        const { profileId, permissionId } = req.body; // Extrai os dados do corpo da requisição
        try {
            // Adiciona a permissão ao perfil
            const updatedProfile = await profileModel.addPermissionToProfile(Number(profileId),Number (permissionId));
            res.json({data: updatedProfile, message: "permisssoes adicionada"}); // Retorna o perfil atualizado
        } catch (error: any) {
            console.error(error); // Loga o erro específico no console
            return Errors.BadRequestError(error, res)// Loga um erro genérico no console
        }
    }

    // Método para remover uma permissão de um perfil
    async removePermissionFromProfile(req: Request, res: Response) {
        const { profileId, permissionId } = req.body; // Extrai os dados do corpo da requisição
        try {
            // Remove a permissão do perfil
            await profileModel.removePermissionFromProfile(Number(profileId),Number(permissionId));
            res.json({ message: 'Permissao Removida do perfil' }); // Retorna uma mensagem de sucesso
        } catch (error: any) {
            console.error(error); // Loga o erro específico no console
            return Errors.BadRequestError(error, res)// Loga um erro genérico no console
        }
    }
}

// Exporta uma instância da classe ProfileController
export const profileController = new ProfileController();
