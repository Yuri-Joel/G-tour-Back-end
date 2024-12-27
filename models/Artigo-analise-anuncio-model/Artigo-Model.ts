import { Estado, Familia } from "@prisma/client";
import { prisma } from "../../database/prisma";



class Artigo {
   

    async CreateArtigo (nome_artigo:string, imagem:string, preco: number, userId:number, familia: Familia, estado: Estado){

    return await prisma.artigo.create({
        data: {
            nome_artigo,
            preco,
            imagem,
            id_user_app: userId,
            familia,
             estado
        }
    })
    }

async get_Artigo(id_user_app: number){
    return await prisma.artigo.findMany({
        where:{
            id_user_app
        },
      include:{
        AnaliseMercado: {
            include:{
                RespostaAnaliseMercado:{
                    include:{
                        UserRespostaAnaliseMercado:{
                           include: {
                            User:{
                                select:{
                                id: true,
                                name: true,
                                photo: true,
                                email: true,
                                telefone: true,
                                }
                            }
                           }
                        }
                    }
                }
            }
        },
        Anuncio: true,
        User: {
            select:{
                id: true,
                photo: true,
                name: true,
                companyLocation: true,
                companyName: true,
                companyPhotos: true,
            }
        },
      }  
    })
}

async get_Artigo_all(){
    return await prisma.artigo.findMany({
      include:{
        AnaliseMercado: true,
        Anuncio: true,
        User: {
            select:{
                id: true,
                photo: true,
                name: true,
                companyLocation: true,
                companyName: true,
                companyPhotos: true,
            }
        },
      }  
    })
}
async Update_Artigo(id: number,nome_artigo:string, imagem:string, preco: number, userId:number, familia: Familia, estado: Estado){
    return await prisma.artigo.update({
        where:{
            id
        },
        data: {
            nome_artigo,
            preco,
            imagem,
            id_user_app: userId,
            familia,
             estado
        }
    })
}
async Get_Artigo_Unique(id: number){
    return await prisma.artigo.findUnique({
        where:{
            id
        },
    
    })
}

async Delete_Artigo_Unique(id: number){
    return await prisma.artigo.delete({
        where:{
            id
        },
    })
}




}


export const artigo = new Artigo()