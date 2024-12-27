import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
import { follow } from "../../models/follow/follow-model";

class Follow_Users_Controllers {

    async Create(req: Request, res: Response) {
        try {
            const { userId, provinceId, touristLocationId } = req.body;

            const data = await follow.CreateFollow(Number(userId), Number(provinceId), Number(touristLocationId))
            res.status(201).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }
    async Verify(req: Request, res: Response) {
        try {
            
            const { userId, provinceId } = req.body;

            //  console.log(userId, provinceId);

            const data = await follow.Getprovince(Number(provinceId))
            if (!data) return Errors.NotFoundError({ message: "Não há nenhum seguidor", name: "" }, res)

            const IdSeguidores = data.followers.flatMap((item) => item.user.id)

            const has = IdSeguidores.includes(userId)

            res.status(201).json({ message: has })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async Delete_Follow(req: Request, res: Response){
        try {
            const { userId, provinceId, touristLocationId } = req.body;
            
            const data = await follow.DeleteFollow(Number(userId),Number(provinceId))
            res.status(201).json({ data, message: false})
        } catch (error:any) {
            Errors.BadRequestError(error, res)
        }
    }
    async following(req: Request, res: Response){
        try {
            const { id } = req.params;
            
            const data = await follow.GetUserMyseguidores(Number(id))
            res.status(201).json({ data, message: false})
        } catch (error:any) {
            Errors.BadRequestError(error, res)
        }
    }
}

export const followControl = new Follow_Users_Controllers()