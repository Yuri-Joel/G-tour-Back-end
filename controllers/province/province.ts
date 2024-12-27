import { prisma } from "../../database/prisma"
import { Request, Response } from "express"
import { Errors } from "../../utils/Errors"
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";
import { postModel } from "../../models/PostModel/postModel";
import { follow } from "../../models/follow/follow-model";


export class Province {

    async GetProvince(_: any, res: Response) {

        try {
            const data = await provinceModel.getProvince();
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }
    async GetProvinceID(req: Request, res: Response) {

        try {
            const { id } = req.params
            const data = await provinceModel.getProvinceId(Number(id));
            const post = await postModel.getAllPostsProvinceId(Number(id))
            // const followers =  await follow.Getprovince(2)
            res.status(200).json({ data, post })

        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }

    }
    async UpdateProvinceId(req: Request, res: Response) {
        const { name, capital, address, latitude, longitude, about, id } = req.body
        try {
            const province = await provinceModel.getProvinceId(Number(id))

            if (!province) {
                return res.status(404).json({ message: 'Província não encontrada' });
            }


            let photo: string = province.photo ?province.photo :"" 
            if (req.files && Array.isArray(req.files)) {

                for (const file of req.files) {

                    if (file.mimetype.startsWith('image/')) {

                        photo = 'media/' + file.filename
                    }
                }
            } else if (req.file) {
                // Process a single file
                if (req.file.mimetype.startsWith('image/')) {
                    photo = 'media/' + req.file.filename
                }
            }

            const data = await provinceModel.updateProvinceId(Number(id), { name, capital, latitude: Number(latitude), longitude: Number(longitude), about, address, photo })
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }

    }
    async AddMedia(req: Request, res: Response) {
        const { id } = req.body
        try {
            let photos: string[] = [];
            let videos: string[] = [];
            const province = await provinceModel.getProvinceId(Number(id))

            if (!province) {
                return res.status(404).json({ message: 'Província não encontrada' });
            }

            if (req.files && Array.isArray(req.files)) {

                for (const file of req.files) {
                    if (file.mimetype.startsWith('image/')) {

                        photos.push('media/' + file.filename)
                    } else if (file.mimetype.startsWith('video/')) {
                        videos.push('media/' + file.filename)
                    }
                }
            } else if (req.file) {
                // Process a single file
                if (req.file.mimetype.startsWith('image/')) {
                    photos.push('media/' + req.file.filename);
                } else if (req.file.mimetype.startsWith('video/')) {
                    videos.push('media/' + req.file.filename);
                }
            }

            const updatedPhotos = [...province.photos, ...photos];
            const updatedVideos = [...province.videos, ...videos];
            const data = await provinceModel.Addmedia(Number(id), updatedPhotos, updatedVideos)
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async AddMediaPrincipal(req: Request, res: Response) {
        const { id } = req.body
        let photo: string = " ";
        try {
            if (req.files && Array.isArray(req.files)) {

                for (const file of req.files) {
                    if (file.mimetype.startsWith('image/')) {

                        photo = 'media/' + file.filename
                    }
                }
            } else if (req.file) {
                // Process a single file
                if (req.file.mimetype.startsWith('image/')) {
                    photo = 'media/' + req.file.filename
                }

            }
            const data = await provinceModel.AddphotoMain(Number(id), photo)
            res.status(200).json({ data })

        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async DeleteMedia(req: Request, res: Response) {
        const { id, mediaPath } = req.body;

        try {
            const province = await provinceModel.getProvinceId(Number(id))

            if (!province) {
                return res.status(404).json({ message: 'Província não encontrada' });
            }
            const updatedPhotos = province.photos.filter(photo => photo !== mediaPath);
            const updatedVideos = province.videos.filter(video => video !== mediaPath);


            const data = await provinceModel.Addmedia(Number(id), updatedPhotos, updatedVideos)
            await excluirImagemNoDiretorio(mediaPath);
            res.status(200).json({ data, message: 'Mídia removida com sucesso' })

        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }

    }
}

export class ProvinceModel {

    async getProvince() {
        return prisma.province.findMany({
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
               name: true,
               photo: true,
               capital: true,

                _count: {
                    select: {
                        posts: true,
                        touristSpots: true,
                        followers: true,
                    },
                },
                followers: {
                    take: 5, // Limita a busca a 5 seguidores
                    orderBy: {
                        createdAt: 'asc', // Ordena por data de criação para obter uma seleção aleatória
                    },
                    select: {
                        user: {
                            select: {
                                name: true,
                                photo: true,
                                id: true,
                            }
                        },
                    },
                },
            },
        });

    }

    async getProvinceId(id: number) {
        return prisma.province.findUnique({
            where: {
                id
            },
            include: {
                provinceHabitat: true,
                touristSpots: {
                    include: {
                        Photo_TouristSpot: true,
                        Video_TouristSpot: true,
                    }
                },
                followers: {
                    select: {

                        user: {

                            select: {

                                name: true,
                                photo: true,
                                id: true,
                            }
                        },
                    }
                }


            }
        })

    }

    async updateProvinceId(id: number, data: {
        name: string, capital?: string, latitude: number, longitude: number, about: string, address: string, photo: string

    }) {
        return await prisma.province.update({
            where: {
                id
            },
            data
        })
    }

    async Addmedia(id: number, photos?: string[], videos?: string[]) {


        return await prisma.province.update({
            where: {
                id
            },
            data: {
                photos: photos || [],
                videos: videos || [],
            }
        })
    }
    async AddphotoMain(id: number, photo: string) {

        return await prisma.province.update({
            where: {
                id
            },
            data: {
                photo
            }
        })
    }



}



export const provinceModel = new ProvinceModel()
export const ProvinceControllers = new Province()