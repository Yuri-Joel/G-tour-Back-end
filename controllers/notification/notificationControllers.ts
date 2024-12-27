import { prisma } from "../../database/prisma";
import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
import { notificationModel } from "../../models/notificationModel/notification-model";


class NotificationControllers {

    async CreateNotification(notification: { userId?: number, type: string, message: string, adminType?:boolean, postId?:number , localId?: number, commentId?: number}) {
        // Supondo que você está usando um ORM como Prisma
        return prisma.notification.create({
            data: notification
        });
    }


    async GetNotification(req: Request, res: Response) {

        const { id } = req.params
        try {
            const data = await notificationModel.getUserNotifications(Number(id))

            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async GetAdminNotification(_:any, res: Response) {

       
        try {
            const data = await notificationModel.getAdminNotifications()

            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }

    async DeleteNotification(req: Request, res: Response) {

        const { id } = req.params
        try {
            const data = await notificationModel.deleteNotification(Number(id))

    
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }
    async MarcarUmaNotification(req: Request, res: Response) {

        const { id } = req.params
        try {
            const data = await notificationModel.MarcarumaNotification(Number(id))

    
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }
    async MarcarTodasNotification(req: Request, res: Response) {

        const { userId } = req.params
        try {
            const data = await notificationModel.MarcarTodasNotification(Number(userId))

    
            res.status(200).json({ data })
        } catch (error: any) {
            Errors.BadRequestError(error, res)
        }
    }


}

export const notificationControl = new NotificationControllers()