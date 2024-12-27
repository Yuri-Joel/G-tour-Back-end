import { prisma } from "../../database/prisma";


class BusinessModel {



    async Create (data: {name: string,description: string}){
        return prisma.businessArea.create({
            data
        })
    }
    
    async Get_Business (){
        return prisma.businessArea.findMany({ 
            orderBy: {
            name: 'asc', // para ordem crescente (A-Z)
            // name: 'desc' // para ordem decrescente (Z-A), se necessário
          },})
    }
    
    async Update_Business (id: number,data: {name: string, description: string}){
        return prisma.businessArea.update({
            where: {
                id
            },
            data
        })
    }
    
    async Delete_Business (id:number){
        return prisma.businessArea.delete({
            where: {
                id
            }
        })
    }

    async Search (query: string){

        return await prisma.businessArea.findMany({
            where:{
                OR: [
                    {name: {contains: query, mode: "insensitive"}}
                ]
            }
        })
    }


}

export const businessModel = new BusinessModel()