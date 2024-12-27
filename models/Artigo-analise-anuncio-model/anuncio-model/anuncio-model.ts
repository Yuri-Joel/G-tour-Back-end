import { TipoAnuncio } from "@prisma/client";
import { prisma } from "../../../database/prisma";


class Anuncio {

    async CreateAnuncio(id_artigo: number, authorId: number, percentagem_desconto: number, tipo_anuncio: TipoAnuncio, descricao: string) {

        const post = await prisma.post.create({
            data: {
                descricao,
                authorId,/* id do usuário que está criando o anúncio */
                postType: "SONDAGEM"
            },
        });

        return await prisma.anuncio.create({
            data: {
                id_artigo,
                percentagem_desconto,
                tipo_anuncio,
                descricao,
                Post: {
                    connect: {
                        id: post.id,
                        postType: "ANUNCIO"
                    },
                },
            }
        })
    }
   

    async Update_Anuncio(id: number, percentagem_desconto: number, tipo_anuncio: TipoAnuncio, descricao: string) {
        return await prisma.anuncio.update({
            where: {
                id
            },
            data: {
                percentagem_desconto,
                tipo_anuncio,
                descricao
            }

        })
    }
    async Get_Anuncio_Unique(id: number) {
        return await prisma.anuncio.findUnique({
            where: {
                id
            },

        })
    }

    async Delete_Anuncio_Unique(id: number) {
        return await prisma.anuncio.delete({
            where: {
                id
            },
        })
    }


}


export const anuncio = new Anuncio()