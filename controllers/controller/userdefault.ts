import { prisma } from "../../database/prisma"


export class userDefaultAdm {

    private user = {
        name: "Dev Bantu",
        email: "devbantu@gmail.com",
        active: true,
        isSuperAdmin: true,
        password: "devbantu"
    }

    async Create_UserAdm() {
        const usercreated = await prisma.user_Admin.create({
            data: this.user
        })
        console.log("criado", usercreated);


    }
}
/* 
(async () => {
    const user_admin = new userDefaultAdm()
    await user_admin.Create_UserAdm()
})(); */