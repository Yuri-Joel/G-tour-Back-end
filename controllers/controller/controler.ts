import { permissionsModel } from "../../models/PermissionModel/PermissionModel"
import { PasswordReset } from "./Token_Controler";

export class Controler  extends PasswordReset {
    private Permissoes = [
        {
            name: "Singular",
            description: "utilizador normal do sistema, sem conta",
        },
        {
            name: "Empresarial",
            description: "utilizador normal do sistema, sem conta",   
        }, {
            name: "status",
            description: "utilizador normal do sistema, sem conta",   
        }, {
            name: "delete-user",
            description: "utilizador normal do sistema, sem conta",   
        }, {
            name: "list-local",
            description: "utilizador normal do sistema, sem conta",   
        },
        {
            name: "perfil-master",
            description: "utilizador normal do sistema, sem conta",   
        },{
            name: "create-admin",
            description: "permissao que cria outros administradores",  
        },
        {
            name: "bloquear",
            description: "permissao para bloquear ou desbloquear usuarios da aplicacao",  
        },
        {
            name: "bloquear-admin",
            description: "permissao para bloquear ou desbloquear utilizadores admininstradores",  
        }
    ]
   
    private async addMissingPermissions() {
        try {
            const permissionsFromDb = await permissionsModel.findAll();
            const existingPermissions = permissionsFromDb.map(p => p.name);
            const newPermissions = this.Permissoes.filter(p => !existingPermissions.includes(p.name));
          
            if (newPermissions.length > 0) {
                
                for (const perm of newPermissions) {
                   
                    
                      await permissionsModel.create({
                        name: perm.name, description: perm.description
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
        await super.removeExpiredTokens() // Chama o método initialize da classe base
        await this.addMissingPermissions(); // Chama o método de adicionar permissões
    }
}
(async () => {
    const controler = new Controler();
    await controler.initialize();
})();