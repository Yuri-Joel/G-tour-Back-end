import { prisma } from "../../database/prisma";

class Follow_Users_Model {


    async CreateFollow (userId: number, provinceId: number, touristLocationId: number){
        
        return await prisma.follower.create({
            data: {
              userId,
              provinceId,
              touristLocationId,
            },
          });

    }

    async DeleteFollow (userId: number, provinceId: number){
        
      const follow = await prisma.follower.findFirst({
        where:{
          userId,
          provinceId
        }
      })
      if(!follow) throw new Error("usuario não segue esta provincia")
      return await prisma.follower.delete({
          where: {
           id: follow.id
          },
        });

  }
    async Getprovince (provinceId: number){
     return  await prisma.province.findUnique({
            where: { id: provinceId },
            
            include: {
              followers: {
                include: {
                  user: {
                    select:{
                      id: true,
                      name: true,
                      photo: true,
                    }
                  }
                }
              }
            },
          
          });
    }

    async GetTouristSpot (touristSpotId: number){
        return  await prisma.touristSpot.findUnique({
            where: { id: touristSpotId },
            include: {
              followers: {
                include: {
                  user: {
                    select:{
                      id: true,
                      name: true,
                      photo: true,
                    }
                  }
                }
              }
            }
          });   
    }

    async GetUserMyseguidores (userId: number){
      return  await prisma.user.findUnique({
          where: { id: userId },
         select:{
          _count:{
            select:{
              followers: true
            }
          }
         }
        });   
  }
}

export const follow =  new Follow_Users_Model()