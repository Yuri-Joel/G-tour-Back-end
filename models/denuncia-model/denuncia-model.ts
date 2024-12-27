import { TipoDenuncia } from "@prisma/client";
import { prisma } from "../../database/prisma";
interface DenunciasAgrupadas {
    usuarios: {
        [key: number]: {
            id: number;
            name: string;
            email: string;
            photo: string | null;  // Permite que photo seja string ou null
            status: string;
            type: string;
            warningsCount: number | null; // Permite que warningsCount seja number ou null
            Block_User_app: Array<{
                Permission: any; // Defina o tipo apropriado conforme seu modelo
            }>;
            denuncias: Array<{
                id: number;
                name: string;
            }>;
        };
    };
    posts: {
        [key: number]: {
            id: number;
            descricao: string | null;  // Permite que descricao seja string ou null
            author: {
                Block_User_app: Array<{
                    Permission: any; // Defina o tipo apropriado conforme seu modelo
                }>;
            };
            photos: string[] | null; // Ajuste conforme seu modelo
            videos: string[] | null; // Ajuste conforme seu modelo
            isOriginalPostDeleted: boolean | null; // Permite que seja boolean ou null
            denuncias: Array<{
                id: number;
                name: string;
            }>;
        };
    };
    locaisTuristicos: {
        [key: number]: {
            id: number;
            name: string;
            Photo_TouristSpot: Array<{
                id: number;
                photo: string;
                TouristSpotId: number;
                createdAt: Date;
                updatedAt: Date;
            }>;
            Video_TouristSpot: Array<{
                id: number;
                Video: string;
                TouristSpotId: number;
                createdAt: Date;
                updatedAt: Date;
            }>;
            denuncias: Array<{
                id: number;
                name: string;
            }>;
        };
    };
}

class DenunciaModel {
    async criarDenuncia(
        denuncianteId: number, 
        tipoDenuncia: TipoDenuncia, 
        descricao?: string, 
        denunciadoUserId?: number, 
        denunciadoPostId?: number, 
        denunciadoLocalId?: number 
    ) {
       
            // Verifica se o denunciante existe
            const denuncianteExiste = await prisma.user.findUnique({ where: { id: denuncianteId } });
            if (!denuncianteExiste) {
                throw new Error("Denunciante não encontrado");
            }
    
            // Verifica se o denunciado existe, dependendo do tipo de denúncia
            if (denunciadoUserId) {
                const usuarioExiste = await prisma.user.findUnique({ where: { id: denunciadoUserId } });
                if (!usuarioExiste) {
                    throw new Error("Usuário denunciado não encontrado");
                }
            }
    
            if (denunciadoPostId) {
                const postExiste = await prisma.post.findUnique({ where: { id: denunciadoPostId } });
                if (!postExiste) {
                    throw new Error("Post denunciado não encontrado");
                }
            }
    
            if (denunciadoLocalId) {
                const localExiste = await prisma.touristSpot.findUnique({ where: { id: denunciadoLocalId } });
                if (!localExiste) {
                    throw new Error("Local turístico denunciado não encontrado");
                }
            }
            // Cria a denúncia
            return await prisma.denuncia.create({
                data:{
                    denuncianteId, 
                    tipoDenuncia, 
                    descricao, 
                    denunciadoUserId, 
                    denunciadoPostId, 
                    denunciadoLocalId, 
                }
               
            });
       
    }
    
    async UpdatepostDenunciados (denunciadoPostId:number){
        const post = await prisma.post.update({
            where: { id: denunciadoPostId },
            data: {
              denunciasCount: { increment: 1 },
            },
            include:{
                author: {
                    select:{
                        name: true,
                        id: true,
                        photo: true,
                    }
                }
            }
          });

          return post
    }
    async UpdateusersDenunciados (denunciadoUserId:number){
        const user = await prisma.user.update({
            where: { id: denunciadoUserId },
            data: {
              warningsCount: { increment: 1 },
            },
                    select:{
                        name: true,
                        id: true,
                        photo: true,
                        warningsCount: true
                    }
                
            
          });

          return user
    }
    async UpdateLocalDenunciado (denunciadoUserId:number){
       return await prisma.touristSpot.update({
            where: { id: denunciadoUserId },
            data: {
                denunciasCount: { increment: 1 },
            },
                    select:{
                        name: true,
                        id: true,
                        denunciasCount: true
                    }
                
            
          });
        }
        async  Denuncias() {
            const denuncias = await prisma.denuncia.findMany({
                include: {
                    denunciante: {
                        select: {
                            id: true,
                            name: true,
                            // O campo 'descricao' deve estar no modelo Denuncia
                        },
                    },
                    denunciadoUser: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            photo: true,
                            status: true,
                            type: true,
                        
                            warningsCount: true,
                            Block_User_app: {
                                include: {
                                    Permission: true,
                                },
                            },
                        },
                    },
                    denunciadoPost: {
                        select: {
                            id: true,
                            descricao: true,
                            
                            author: {
                                include: {
                                    Block_User_app: {
                                        include: {
                                            Permission: true,
                                        },
                                    },
                                },
                            },
                            photos: true,
                            videos: true,
                            isOriginalPostDeleted: true,
                        },
                    },
                    denunciadoLocal: {
                        select: {
                            id: true,
                            name: true,
                            Photo_TouristSpot: true,
                            Video_TouristSpot: true,
                        },
                    },
                },
            });
        
            const usuarios: any[] = [];
            const posts: any[] = [];
            const locaisTuristicos: any[] = [];
        
            denuncias.forEach(denuncia => {
                const { denunciante, denunciadoUser, denunciadoPost, denunciadoLocal, descricao, status, tipoDenuncia } = denuncia;
        
                // Adiciona as denúncias para o usuário denunciado
                if (denunciadoUser) {
                    // Verifica se o usuário já foi adicionado ao vetor de usuários
                    let usuario = usuarios.find(u => u.id === denunciadoUser.id);
        
                    if (!usuario) {
                        usuario = {
                            id: denunciadoUser.id,
                            name: denunciadoUser.name,
                            email: denunciadoUser.email,
                            photo: denunciadoUser.photo,
                            status: denunciadoUser.status,

                            type: denunciadoUser.type,
                            warningsCount: denunciadoUser.warningsCount,
                            Block_User_app: denunciadoUser.Block_User_app,
                            denuncias: [],
                        };
                        usuarios.push(usuario);
                    }
        
                    usuario.denuncias.push({
                        id: denunciante.id,
                        name: denunciante.name,
                        description: descricao, // Descrição da denúncia
                        statusDenuncia: status,
                        type: tipoDenuncia, // Tipo da denúncia
                    });
                }
        
                // Adiciona as denúncias para o post denunciado
                if (denunciadoPost) {
                    // Verifica se o post já foi adicionado ao vetor de posts
                    let post = posts.find(p => p.id === denunciadoPost.id);
        
                    if (!post) {
                        post = {
                            id: denunciadoPost.id,
                            descricao: denunciadoPost.descricao,
                            author: {
                                id: denunciadoPost.author.id,
                                name: denunciadoPost.author.name,
                                Block_User_app: denunciadoPost.author.Block_User_app,
                            },
                            photos: denunciadoPost.photos,
                            videos: denunciadoPost.videos,
                            isOriginalPostDeleted: denunciadoPost.isOriginalPostDeleted,
                            denuncias: [],
                        };
                        posts.push(post);
                    }
        
                    post.denuncias.push({
                        id: denunciante.id,
                        name: denunciante.name,
                        description: descricao, // Descrição da denúncia
                        statusDenuncia: status,
                        type: tipoDenuncia, // Tipo da denúncia
                    });
                }
        
                // Adiciona as denúncias para o local turístico denunciado
                if (denunciadoLocal) {
                    // Verifica se o local já foi adicionado ao vetor de locais turísticos
                    let local = locaisTuristicos.find(l => l.id === denunciadoLocal.id);
        
                    if (!local) {
                        local = {
                            id: denunciadoLocal.id,
                            name: denunciadoLocal.name,
                            Photo_TouristSpot: denunciadoLocal.Photo_TouristSpot,
                            Video_TouristSpot: denunciadoLocal.Video_TouristSpot,
                            denuncias: [],
                        };
                        locaisTuristicos.push(local);
                    }
        
                    local.denuncias.push({
                        id: denunciante.id,
                        name: denunciante.name,
                        description: descricao, // Descrição da denúncia
                        statusDenuncia: status,
                        type: tipoDenuncia, // Tipo da denúncia
                    });
                }
            });
        
            return {
                usuarios,
                posts,
                locaisTuristicos
            };
        }
        
        
        
        
    
    // Outros métodos como buscar denúncias, contar denúncias, etc.
}

export const denuncia = new DenunciaModel();
