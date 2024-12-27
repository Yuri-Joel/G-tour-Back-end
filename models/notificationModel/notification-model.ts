import { prisma } from "../../database/prisma";

class NotificationModel {
  // Método para criar uma notificação


  // Método para obter notificações de um usuário específico
  async getUserNotifications(userId: number) {
    return prisma.notification.findMany({
      where: {
        userId: userId,
        user:{
          status:{
            in:["ativo","confirmar"]
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  
  // Método para obter notificações de um usuário específico
  async getAdminNotifications() {
    return prisma.notification.findMany({
      where: {
        adminType: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }


  // Método para deletar notificação
  async deleteNotification(notificationId: number) {
    return prisma.notification.delete({
      where: { id: notificationId }
    });
  }
  // Método para marcar notificação como lida
  async MarcarumaNotification(notificationId: number) {
    return prisma.notification.update({
      where: { id: notificationId },
      data: { read: true }
    });
  }
  // Método para marcar todas as notificações como lida
  async MarcarTodasNotification(userId: number) {
    return prisma.notification.updateMany({
      where: { userId },
      data: {
        read: true
      }
    });
  }
}

export const notificationModel = new NotificationModel();
