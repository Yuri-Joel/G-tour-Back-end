import { TipoResposta } from "@prisma/client";
import { prisma } from "../../../database/prisma";



class AnaliseMercado {


    async CreateAnaliseMercado(id_artigo: number,authorId: number, questao: string, tipo_resposta: TipoResposta,opcoes: string[]) {

        const post = await prisma.post.create({
            data: {
              descricao: questao,
              authorId,
              postType: "SONDAGEM"
            },
          });
        return await prisma.analiseMercado.create({
            data: {
              id_artigo,
              questao,
              tipo_resposta,
              RespostaAnaliseMercado: {
                create: opcoes.map(opcao => ({
                  opcao,
                })),
              }, 
              Post: {         
                connect: {
                  id: post.id,
                  postType: "SONDAGEM"
                },
              },
            },
            include: {
              RespostaAnaliseMercado: true,
            },
          });
    }
    async get_AnaliseMercado(id_artigo: number) {
        return await prisma.analiseMercado.findMany({
            where: {
                id_artigo
            },
            include: {
                Artigo: true,
                RespostaAnaliseMercado: {
                    include: {
                        UserRespostaAnaliseMercado: {
                            select: {
                                id: true,
                                id_resposta_analise_mercado: true,
                                outro: true,
                                id_user: true,
                                User: {
                                    select: {
                                        name: true,
                                        photo: true,
                                        id: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
    }

    async Update_AnaliseMercado(id: number, questao?: string, tipo_resposta?: TipoResposta, opcoes?: string[]) {
        return await prisma.analiseMercado.update({
            where: { id },
            data: {
              questao,
              tipo_resposta,
              RespostaAnaliseMercado: {
                deleteMany: {}, // Remove as opções anteriores
                create: opcoes?.map(opcao => ({
                  opcao,
                })),
              },
            },
            include: {
              RespostaAnaliseMercado: true,
            },
          });
    }
    async Get_AnaliseMercado_Unique(id: number) {
        return await prisma.analiseMercado.findUnique({
            where: {
                id
            },

        })
    }

    async Delete_AnaliseMercado_Unique(id: number) {
        return await prisma.analiseMercado.delete({
            where: {
                id
            },

        })
    }

    async resposta_AnaliseMercado(id_resposta_analise_mercado: number, id_user: number) {
        const user = await prisma.user.findUnique({
            where: { id: id_user }
        });
    
        if (!user) {
            throw new Error("Usuário não encontrado");
        }
    
        // Verifica se a resposta da análise de mercado existe
        const resposta = await prisma.respostaAnaliseMercado.findUnique({
            where: { id: id_resposta_analise_mercado }
        });
    
        if (!resposta) {
            throw new Error("Resposta de análise de mercado não encontrada");
        }
    
       await prisma.userRespostaAnaliseMercado.create({
            data: {
              id_user,
              id_resposta_analise_mercado,
            },
          });

        const opcoes = await prisma.respostaAnaliseMercado.findMany({
            where: { id_analise_mercado: resposta.id_analise_mercado },
            include: {
                _count: { select: { UserRespostaAnaliseMercado: true } },
                UserRespostaAnaliseMercado: { select: { id_user: true } }
            }
        });
    
        const totalVotes = opcoes.reduce((sum, opcao) => sum + opcao._count.UserRespostaAnaliseMercado, 0);
    
        const opcoesComPercentagens = opcoes.map(opcao => ({
            id: opcao.id,
            opcao: opcao.opcao,
            totalVotes: opcao._count.UserRespostaAnaliseMercado,
            porcentagem: ((opcao._count.UserRespostaAnaliseMercado / totalVotes) * 100).toFixed(2),
            usuarios: opcao.UserRespostaAnaliseMercado.map(resposta => resposta.id_user)
        }));
    
        return {
            analiseMercado: {
                id: resposta.id_analise_mercado,
                opcoes: opcoesComPercentagens,
            },
        };
    }


    
    async buscarRespostasPorAnalise(id_analise_mercado: number) {
        try {
          const respostas = await prisma.respostaAnaliseMercado.findMany({
            where: { id_analise_mercado },
            include: { 
              UserRespostaAnaliseMercado: true,  // Incluir o usuário que respondeu
            },
          });
          return respostas;
        } catch (error: any) {
          throw new Error(`Erro ao buscar respostas: ${error.message}`);
        }
      }
}


export const analiseMercado = new AnaliseMercado()