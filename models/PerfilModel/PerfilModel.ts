import { prisma } from '../../database/prisma'; // Importa o cliente Prisma para interagir com o banco de dados

class ProfileModel {
  
    // Método para criar um novo perfil com permissões associadas
    async create(data: { name: string, description?: string, permissionIds: number[] | [] }) {
        return prisma.profileType.create({
            data: {
                name: data.name, // Nome do perfil
                description: data.description, // Descrição opcional do perfil
                permissions: {
                    create: data.permissionIds ? data.permissionIds.map(permissionId => ({ permissoesId: permissionId })) : [], // Cria as associações de permissões com o perfil
                },
            },
        });
    }
    async UpdateProfile(id: number,data: { name: string, description?: string}) {
        return prisma.profileType.update({
            where:{
                id
            },
            data: {
                name: data.name, // Nome do perfil
                description: data.description, // Descrição opcional do perfil
            },
        });
    }
    
    async Delete(id: number) {
        return await prisma.profileType.delete({
           where:{
            id
           }
        });
    }
    // Método para buscar todos os perfis com suas permissões associadas
    async findAll() {
        return await prisma.profileType.findMany({
            orderBy: {
                name: 'asc', // para ordem crescente (A-Z)
                // name: 'desc' // para ordem decrescente (Z-A), se necessário
              },
            include: { permissions: { include: { permissoes: true } } }, // Inclui as permissões associadas aos perfis
        });
    }
    async StatusProfie(id: number, status: boolean) {
        return await prisma.profileType.update({
            where: {id},
            data:{
                status
            }, // Inclui as permissões associadas aos perfis
        });
    }
    // Método para buscar um perfil pelo nome
    async findByName(name: string) {
        return prisma.profileType.findUnique({
            where: { name }, // Condição de busca pelo nome do perfil
        });
    }
    

    // Método para associar um usuário a um perfil específico
    async addUserToProfile(userId: number, profileId: number) {
        return prisma.userProfile.create({ 
            data: { userId, perfilId: profileId } // Associa o usuário ao perfil
        });
    }

    // Método para adicionar uma permissão a um perfil específico
    async addPermissionToProfile(profileId: number, permissionId: number) {
        return prisma.profilePermission.create({ 
            data: { perfilId: profileId, permissoesId: permissionId } // Associa a permissão ao perfil
            
        });
    }

    // Método para remover uma permissão de um perfil específico
    async removePermissionFromProfile(profileId: number, permissionId: number) {
        return prisma.profilePermission.deleteMany({ 
            where: { perfilId: profileId, permissoesId: permissionId } // Remove a associação da permissão com o perfil
        });
    }

    // Outros métodos conforme necessário
}

// Exporta uma instância da classe ProfileModel
export const profileModel = new ProfileModel();
