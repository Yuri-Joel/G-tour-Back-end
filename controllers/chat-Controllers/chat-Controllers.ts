import { Response, Request } from "express";
import { userModel } from "../../models/usersModel/userModel";
import { chatModel } from "../../models/chat-model/chat-model";
import { Errors } from "../../utils/Errors";
import { prisma } from "../../database/prisma";


class ChatControllers {

  async StartConversation(req: Request, res: Response) {
    const { userId1, userId2 } = req.body;
    try {
      const user1 = await userModel.findById(Number(userId1));
      const user2 = await userModel.findById(Number(userId2));

      if (!user1 || !user2) {
        return Errors.NotFoundError({ message: 'Um ou ambos os usuários não foram encontrados', name: "" }, res);
      }
      const existingConversation = await chatModel.ExistingChat(Number(userId1), Number(userId2))

      if (existingConversation) {
        return Errors.handleError({ message: 'Conversa já existe entre os usuários', name: "" }, res);
      }


      const data = await chatModel.CreateChat(Number(userId1), Number(userId2))

      res.json({ data })
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }
  async StartChatGrupo(req: Request, res: Response) {
    const { name, adminId, userIds } = req.body;
    try {
      /* const user1 = await userModel.findById(Number(userId1));
      const user2 = await userModel.findById(Number(userId2));

      if (!user1 || !user2) {
        return Errors.NotFoundError({ message: 'Um ou ambos os usuários não foram encontrados', name: "" }, res);
      }
      const existingConversation = await chatModel.ExistingChat(Number(userId1), Number(userId2))

      if (existingConversation) {
        return Errors.handleError({ message: 'Conversa já existe entre os usuários', name: "" }, res);
      } */  


      const data = await chatModel.CreateChatGroup(Number(adminId), name, userIds)

      res.json({ data })
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }


  async SendMessage(req: Request, res: Response) {
    const { conversationId, senderId, content, user2 } = req.body;
    try {
      const conversation = await chatModel.FindChat(Number(conversationId))
      let IdConversa = { id: 0 }
      if (!conversation) {
        IdConversa = await chatModel.CreateChat(Number(senderId), Number(user2))
      }

      /*  const isUserInConversation = conversation?.users.some(user => user.id === senderId);
 
       if (!isUserInConversation) {
         return Errors.ForbiddenError({ message: 'Você não está autorizado a enviar mensagens para esta conversa', name: "" }, res);
       } */

      const data = await chatModel.SendMessage(content, conversationId ? Number(conversationId) : IdConversa.id, Number(senderId))

      res.status(200).json({ data });
    } catch (error: any) {

      Errors.BadRequestError(error, res)
    }
  }

  async getConversationMessages(req: Request, res: Response) {
    const { conversaId } = req.params;
    console.log(conversaId);
    try {
      const messages = await chatModel.FindMessageConversaId(Number(conversaId))

      if (!messages.length) {
        return Errors.NotFoundError({ message: 'Nenhuma mensagem encontrada para esta conversa', name: "" }, res);
      }

      res.status(200).json(messages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao buscar as mensagens' });
    }

  }

  async getUserConversations(req: Request, res: Response) {
    const { userId } = req.params;

    try {
 
      const data = await chatModel.FindConversaUserId(Number(userId))


      if (!data.length) {
        return Errors.NotFoundError({ message: 'Nenhuma conversa encontrada para este usuário', name: "" }, res);
      }

      res.status(200).json({ data });
    } catch (error: any) {

      Errors.BadRequestError(error, res)
    }
  }

  async markMessageAsViewed(req: Request, res: Response) {
    const { messageId } = req.body;
    const { userId } = req.body;

    try {
      const message = await chatModel.findMessageId(Number(messageId))

      if (!message) {
        return Errors.NotFoundError({ message: 'Mensagem não encontrada', name: "" }, res);
      }

      const { senderId, conversation } = message;

      // Verifica se o usuário que está marcando a mensagem como visualizada é um dos participantes da conversa
      const isUserInConversation = conversation.users.some(user => user.id === userId);

      if (!isUserInConversation) {
        return Errors.ForbiddenError({ message: 'Você não está autorizado a visualizar esta mensagem', name: "" }, res);
      }

      // Verifica se o usuário não é o remetente da mensagem
      if (userId === senderId) {
        return Errors.ForbiddenError({ message: 'O remetente da mensagem não pode marcar a mensagem como visualizada', name: "" }, res);
      }

      const data = await chatModel.VisualizarMessage(Number(messageId))

      res.status(200).json({ data });
    } catch (error: any) {
      console.error(error);
      Errors.BadRequestError(error, res);
    }
  };

  async DeleteChat(req: Request, res: Response) {
    const { id } = req.params
    try {
      const data = await chatModel.DeleteChat(Number(id));

      res.status(200).json({ data, message: "conversa Apagada" });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async Update_Message_Chat(req: Request, res: Response) {
    const { id, content, senderId } = req.body
    try {
      const data = await chatModel.UpdateMessage(Number(id), content, Number(senderId));

      res.status(200).json({ data, message: "mensagem actualizada" });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }
  async DeleteMessageIdChat(req: Request, res: Response) {
    const { id, senderId } = req.body
    try {
      const data = await chatModel.DeleteMessage(Number(id), Number(senderId));

      res.status(200).json({ data, message: "mensagem Apagada" });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async SearchChat(req: Request, res: Response) {
    const { query, userId } = req.body
    try {
      const data = await chatModel.SearchChat(query, userId);

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }


  async Add_UserChat_Group(req: Request, res: Response) {
    const { conversaId, userIds } = req.body;

    try {

      const data = await chatModel.Add_users_group(Number(conversaId), userIds)

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }


  async Remove_Users_Chat_Group(req: Request, res: Response) {
    const { conversaId, userIds, adminId } = req.body;
    try {
      const conversation = await chatModel.FindChat(Number(conversaId)
    )

    if (!conversation) {
      return Errors.NotFoundError({ message: "Conversation not found", name:"", }, res);
    }

    const isAdmin = conversation.groupAdminId === adminId ||
      conversation.secondaryAdmins.some(admin => admin.id === adminId);

    if (!isAdmin) {
      return Errors.UnathourizedError({ message: "Unauthorized: Not an admin" , name:""}, res);
    }

      const data = await chatModel.remove_users_group(Number(conversaId), userIds)

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }
  async Add_AdminSecundary_Chat_Group(req: Request, res: Response) {
    const { conversaId, adminId } = req.body;

    try {
      const conversation = await chatModel.FindChat(Number(conversaId))

    if (!conversation) {
      return Errors.NotFoundError({ message: "Conversation not found", name:"", }, res);
    }

    const isAdmin = conversation.groupAdminId === adminId ||
      conversation.secondaryAdmins.some(admin => admin.id === adminId);

    if (!isAdmin) {
      return Errors.UnathourizedError({ message: "Unauthorized: Not an admin" , name:""}, res);
    }

      const data = await chatModel.Add_Adminsecundary(Number(conversaId), Number(adminId))

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async Remove_AdminSecundary_Chat_Group(req: Request, res: Response) {
    const { conversaId, adminId } = req.body;

    try {

      const conversation = await chatModel.FindChat(Number(conversaId))

      if (!conversation) {
        return Errors.NotFoundError({ message: "Conversation not found", name:"", }, res);
      }

      const isAdmin = conversation.groupAdminId === adminId ||
        conversation.secondaryAdmins.some(admin => admin.id === adminId);

      if (!isAdmin) {
        return Errors.UnathourizedError({ message: "Unauthorized: Not an admin" , name:""}, res);
      }

      const data = await chatModel.remover_Adminsecundary(Number(conversaId), Number(adminId))

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async OnlyAdminSend (req: Request, res: Response) {
    const { conversaId, adminId,  onlyAdminsCanSend } = req.body;

    try {

      const conversation = await chatModel.FindChat(Number(conversaId))

      if (!conversation) {
        return Errors.NotFoundError({ message: "Conversation not found", name:"", }, res);
      }

      const isAdmin = conversation.groupAdminId === adminId ||
        conversation.secondaryAdmins.some(admin => admin.id === adminId);

      if (!isAdmin) {
        return Errors.UnathourizedError({ message: "Unauthorized: Not an admin" , name:""}, res);
      }

      const data = await chatModel.onlyAdminsCanSend(Number(conversaId), onlyAdminsCanSend)

      res.status(200).json({ data });
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async Blocked_desblocked_chat(req: Request, res: Response) {
    const {conversaId, isBlocked, adminId } = req.body;

    try {
      const conversation = await chatModel.FindChat(Number(conversaId))

    if (!conversation) {
      return Errors.NotFoundError({ message: "Conversation not found", name:"", }, res);
    }

    const isAdmin = conversation.groupAdminId === adminId ||
      conversation.secondaryAdmins.some(admin => admin.id === adminId);

    if (!isAdmin) {
      return Errors.UnathourizedError({ message: "Unauthorized: Not an admin" , name:""}, res);
    }

    const data = await chatModel.Blocked_desblocked_chat(Number(conversaId), isBlocked)
    res.status(200).json({ data });
    } catch (error:any) {
      Errors.BadRequestError(error, res)
    }
}

}


export const Chat = new ChatControllers()