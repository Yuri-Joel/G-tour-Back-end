import { prisma } from "../../database/prisma"
import { LocalType } from "@prisma/client"

class Local_TurismoModel {



  Create = async (name: string, about: string, provinceId: number, latitude: number, longitude: number, address: string, localType: LocalType, photos: string[], videos: string[]) => {


    const result = await prisma.touristSpot.create({
      data: {
        name,
        about,
        provinceId,
        latitude,
        longitude,
        address,
        localType,
        Photo_TouristSpot: {
          create: photos?.map((photo: string) => ({ photo })) || []
        },
        Video_TouristSpot: {
          create: videos?.map((video: string) => ({ Video: video })) || []
        }
      }

    })

   

    return result

  }

  Add_photos_videos = async (id: number, photos: string[], videos: string[]) => {

    return await prisma.touristSpot.update({
      where: {
        id
      },
      data: {
        Photo_TouristSpot: {
          create: photos?.map((photo: string) => ({ photo })) || []
        },
        Video_TouristSpot: {
          create: videos?.map((video: string) => ({ Video: video })) || []
        }
      },
      include: {
        Photo_TouristSpot: true,
        Video_TouristSpot: true
      }
    })
  }

  Get_Local = async () => {
    return await prisma.touristSpot.findMany({
      orderBy: {
        name: 'asc', // para ordem crescente (A-Z)
        // name: 'desc' // para ordem decrescente (Z-A), se necessário
      },
      include: {
        province: {
          select: {
            name: true
          }
        },
        Photo_TouristSpot: true,
        Video_TouristSpot: true

      }
    })
  }


  Update = async (id: number, data: { name: string, about: string, provinceId: number, latitude: number, longitude: number, address: string, localType: "ZONA_TURISTICA" | "AMBIENTE_CONSTITUIDO" }) => {

    const result = await prisma.touristSpot.update({
      where: {
        id
      },
      data
    })

    return result
  }

  Delete = async (id: number) => {
    return await prisma.touristSpot.delete({
      where: {
        id
      }
    })
  }


  async searchGlobal(query: string) {

    const touristSpots = await prisma.touristSpot.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { province: { name: { contains: query, mode: "insensitive" } } }
        ],
      },
      include: {
        Photo_TouristSpot: true,
        Video_TouristSpot: true,
        province: true,
      }
    });
    return touristSpots;

  }


  async searchByType(type: "ZONA_TURISTICA" | "AMBIENTE_CONSTITUIDO") {

    const touristSpots = await prisma.touristSpot.findMany({
      where: {
        localType: type,
      },
      include: {
        Photo_TouristSpot: true,
        Video_TouristSpot: true,
        province: {
          select: {
            name: true,
          }
        },
      },
    });
    return touristSpots;

  }

  async searchByProvince(query: string) {

    const touristSpots = await prisma.touristSpot.findMany({
      where: {
        OR: [
          { province: { name: { contains: query, mode: "insensitive" } } }
        ],
      },
      include: {

        Photo_TouristSpot: true,
        Video_TouristSpot: true,
        province: true,
      },
    });
    return touristSpots

  }
  async GetLocalId  (id: number){
   return  await  prisma.touristSpot.findFirst({
      where: {id :Number(id)},
      include: {
        Photo_TouristSpot: true,
        Video_TouristSpot: true
      }
    })
  }

  async DeleteMediaPhoto(id: number) {

    const result = await prisma.photo_TouristSpot.delete({
      where: {
        id
      }
    })

    return result
  }

  async DeleteMediaVideo(id: number) {

    const result = await prisma.video_TouristSpot.delete({
      where: {
        id
      }
    })

    return result
  }


}

export const localModel = new Local_TurismoModel()