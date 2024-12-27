import { prisma } from "../../database/prisma";

export class PasswordReset {


    async removeExpiredTokens() {
        try {
            const result = await prisma.passwordReset.deleteMany({
                where: {
                    expiresAt: {
                        lt: new Date(),
                    },
                },
            });

            console.log(`Deletado ${result.count} tokens expirados.`);
        } catch (error) {
            console.error('Error removing expired tokens:', error);
        }

    }

    static async find_Token(token: string) {
      return await prisma.passwordReset.findFirst(
            {
                where: {
                    token
                }
            })   
    }

    static async DeleteToken(id: number) {
        return await prisma.passwordReset.delete({
            where: {
                id
            }
        })
    }

   static async CreateToken(data:{email: string, token: string, expiresAt: Date}){
        return  await prisma.passwordReset.create({
         data
         })
    }
}



