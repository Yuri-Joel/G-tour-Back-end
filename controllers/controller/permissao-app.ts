import { prisma } from "../../database/prisma";
import { permissions_app } from "../../models/PermissionModel/Permission-app";

export class Controler_App  {
    private Permissoes = [
        {
            name: "c-post",
            description: "Permissao para criar um post",
            is_singular : true,
            is_empresa  : true
        },
        {
            name: "c-comentarios",
            description: "Permissao para criar um comentario",
            is_singular : true,
            is_empresa  : true  
        }, {
            name: "c-reagir",
            description: "Permissao para criar uma reação",  
            is_singular : true,
            is_empresa  : true
        },
        {
            name: "ver-perfil",
            description: "Permissao para ver o perfil",  
            is_singular : true,
            is_empresa  : true
        },
        {
            name: "default",
            description: "Permissao default do sistema do usuario App",  
            is_singular : true,
            is_empresa  : true
        }
    ]
   
    private async addMissingPermissions() {
        try {
            const permissionsFromDb = await permissions_app.findAll_App();
            const existingPermissions = permissionsFromDb.map(p => p.name);
            const newPermissions = this.Permissoes.filter(p => !existingPermissions.includes(p.name));
          
            if (newPermissions.length > 0) {
                
                for (const perm of newPermissions) {
                   
                    
                      await permissions_app.create({
                        name: perm.name, description: perm.description,is_singular: perm.is_singular, is_empresa: perm.is_empresa 
                    });  
                }
            
                console.log("permissao adicionada");
                
             } else {
                console.log("Nenhuma nova permissão a adicionar.");
            }
        } catch (err) {
            console.error("Erro ao buscar permissões do banco de dados:", err);
        }
    }

    async initialize() {
       
        await this.addMissingPermissions(); // Chama o método de adicionar permissões
    }

    async BloquearUser(UserId:number, permissionId: number, blockedUntil: Date)  {
        return await prisma.bloqueio_user_app.create({
            data:{
                UserId,
                permissionId,
                blockedUntil
            }
        })
    }
    async DesbloquearUser(UserId:number, permissionId: number)  {
        return await prisma.bloqueio_user_app.deleteMany({
           where:{
                UserId,
                permissionId
            }
        })
    }
    async removeExpiredBlocks() {
      return  await prisma.bloqueio_user_app.deleteMany({
          where: {
            blockedUntil: {
              lt: new Date(),
            },
          },
        });
      }
}
export const controler_app = new Controler_App();
(async () => {
    const controler = new Controler_App();
    await controler.initialize();
})();