import { Request, Response } from 'express';
import { connectionModel } from '../../models/ConexaoModel/conexaoModel';
import { Errors } from '../../utils/Errors';
import { userModel } from '../../models/usersModel/userModel';
import { notificationModel } from '../../models/notificationModel/notification-model';
import { notificationControl } from '../notification/notificationControllers';

class ConnectionController {
  async createConnection(req: Request, res: Response) {
    const { userId, connectedUserId } = req.body;
    try {

      const existingConnection = await connectionModel.VerifyConnection(Number(userId), Number(connectedUserId))

      const existingConnection2 = await connectionModel.VerifyConnection(Number(connectedUserId), Number(userId))


      if (existingConnection || existingConnection2) {
        return Errors.UnathourizedError({ message: "usuario já fez um pedido", name: "" }, res)
      }

      const newConnection = await connectionModel.createConnection(Number(userId), Number(connectedUserId));

      const Name = await userModel.findById(userId)
      const notification = {
        userId: connectedUserId, // Usuário que receberá a notificação
        type: 'Pedido de Amizade',
        message: `Você recebeu um pedido de amizade de ${Name?.name}`, // Mensagem personalizada

      };
      await notificationControl.CreateNotification(notification)

      res.status(201).json(newConnection);

    } catch (error: any) {

      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async getPendingByUserId(req: Request, res: Response) {
    const { userId } = req.body;

    try {
      const data = await connectionModel.getPendingConnections(Number(userId));
      res.status(200).json({ data });
    } catch (error) {

      res.status(500).json({ message: "Error fetching connections" });
    }
  }
  async MeusPedidos(req: Request, res: Response) {
    const { userId } = req.body;

    try {
      const data = await connectionModel.getPendingConnectionsId(Number(userId));
      res.status(200).json({ data });
    } catch (error) {

      res.status(500).json({ message: "Error fetching connections" });
    }
  }


  async getAcceptConnections(req: Request, res: Response) {
    const { userId } = req.body;
    try {
      const connections = await connectionModel.getAcceptedConnections(Number(userId));
      res.status(200).json(connections);
    } catch (error: any) {

      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async updateConnectionStatus(req: Request, res: Response) {
    const { id } = req.body;
    const { status, connectedUserId, userId } = req.body;
    try {
      const updatedConnection = await connectionModel.updateConnectionStatus(Number(id), status);


      if (status === "ACCEPTED") {
        const Name = await userModel.findById(userId)

        const notification = {
          userId: connectedUserId, // Usuário que receberá a notificação
          type: 'Pedido de Amizade',
          message: `${Name?.name} aceitou o seu pedido de amizade`, // Mensagem personalizada

        };
        await notificationControl.CreateNotification(notification)
      }
      res.status(200).json(updatedConnection);
    } catch (error: any) {

      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async deleteConnection(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await connectionModel.deleteConnection(Number(id));
      res.status(204).json({ message: "sucesso" })
    } catch (error: any) {

      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async possibleConnection(req: Request, res: Response) {

    try {
      const { UserId } = req.params;
      const data = await connectionModel.PossibleConnection(Number(UserId));
      res.status(200).json({ data });

    } catch (error: any) {
      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async IgnoretedUser(req: Request, res: Response) {

    try {
      const { userId, ignoredUserId } = req.body;
      const data = await connectionModel.IgnoretedUserId(Number(userId), Number(ignoredUserId));
      res.status(200).json({ data });

    } catch (error: any) {
      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }
  async VerificarFriend(req: Request, res: Response) {

    try {
      const { userId, userId2 } = req.body;
    
      
      
      const friends = await connectionModel.getAcceptedConnections(Number(userId))

      if (friends) { 
        const friend = friends.find(user => user.id === userId2)
            if (friend) return res.status(200).json({ message: "Somos amigos", connectionId: friend.connectionId});
      }
      const MeusPedidos = await connectionModel.getPendingConnectionsId(Number(userId));
      
      if (MeusPedidos) {
        const pedido = MeusPedidos.find(item => item.user.id === userId2);
        if (pedido) {
            return res.status(200).json({ 
             message: "usuario lhe fiz pedido",
                connectionId: pedido.id 
            });
        }
    }

      const OutrosPedidos = await connectionModel.getPendingConnections(Number(userId));
      if (OutrosPedidos) {
        const outroPedido = OutrosPedidos.find(item => item.user.id === userId2)
        
        if (outroPedido) return res.status(200).json({ message: "usuario me fez pedido",connectionId: outroPedido.id  });
      }

      return res.status(200).json({ message: "nada" });


    } catch (error: any) {
      return Errors.BadRequestError(error, res)// Loga um erro genérico no console
    }
  }

  async Search(req: Request, res: Response) {
    const { query } = req.body;

    try {
      const data = await connectionModel.getPendingConnectionsId(Number(userId));
      res.status(200).json({ data });
    } catch (error) {

      res.status(500).json({ message: "Error fetching connections" });
    }
  }
}

export const connectionController = new ConnectionController();
