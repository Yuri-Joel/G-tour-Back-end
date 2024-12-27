import { prisma } from "../../database/prisma";


class ChatModel {
  async CreateChat(userId1: number, userId2: number) {
    return await prisma.conversation.create({
      data: {
        users: {
          connect: [{ id: userId1 }, { id: userId2 }],
        }
      }
    });
  }
  async CreateChatGroup(userIdAdmin: number, namegroup: string, users: number[]) {
    return await prisma.conversation.create({
      data: {
        name: namegroup,
        isGroup: true,
        groupAdmin: { connect: { id: userIdAdmin } }, // Define o usuário como administrador do grupo
        users: { connect: users.map(userId => ({ id: userId })) }, // Mapeia e adiciona todos os usuários ao grupo
      },
    });
  }

  async remover_Adminsecundary(conversationId: number, userId: number) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        secondaryAdmins: {
          connect: { id: userId }
        }
      }
    });
  }


  async Add_Adminsecundary(conversationId: number, userId: number) {
    return await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        secondaryAdmins: {
          connect: { id: userId }
        }
      }
    });
  }
  async Add_users_group(id: number, userIds: number[]) {
    return await prisma.conversation.update({
      where: { id },
      data: {
        users: { connect: userIds.map((id: number) => ({ id })) }
      },
      include: { users: true }
    });
  }
  async remove_users_group(id: number, userIds: number[]) {
    return await prisma.conversation.update({
      where: { id },
      data: {
        users: { disconnect: userIds.map((id: number) => ({ id })) }
      },
      include: { users: true }
    });

  }
  async FindChat(id: number) {
    return await prisma.conversation.findUnique({
      where: { id },
      include: {
        users: true,
        groupAdmin: true,
        secondaryAdmins: true
      }
    });
  }


  async SendMessage(content: string, conversationId: number, senderId: number) {
    return await prisma.message.create({
      data: {
        content,
        conversationId,
        senderId
      },
      include: {
        sender: {
          select: {
            name: true,
            photo: true,
            job: true,
            id: true,
          },
        },
      },
    });

  }

  async FindMessageConversaId(conversationId: number) {
    return await prisma.message.findMany({
      where: {
        conversationId,
        sender: {
          status: {
            in: ["ativo", "confirmar"]
          }
        }
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: {
          select: {
            name: true,
            photo: true,
            job: true,
            id: true,
          },
        },
      },
    });
  }
  async findMessageId(messageId: number) {
    return await prisma.message.findUnique({
      where: {
        id: Number(messageId),
        sender: {
          status: {
            in: ["ativo", "confirmar"]
          }
        }
      },
      include: {
        conversation: {
          include: {
            users: true,
          },
        },
      },
    });
  }

  async FindConversaUserId(userId: number) {
    try {
      const chat = await prisma.conversation.findMany({
        where: {
          users: {
            some: {
              id: userId,
              status: {
                in: ["ativo", "confirmar"]
              }
            }
          }
        },
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
              photo: true,
            }
          },
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1
          },
          groupAdmin: true,
          secondaryAdmins: true
        }
      });

      console.log(chat);
      
      const ChatBox = chat
        .map(item => {
          const otherUsers = item.users.filter(user => user.id !== userId);
          const groupName = item.name || otherUsers.slice(0, 3).map(user => user.name).join(', ');
          const groupfoto = item.photo

          return {
            conversaId: item.id,
            groupName: item.isGroup ? groupName : undefined, // Only include groupName for groups
            groupfoto: item.isGroup ? groupfoto : undefined,
            user: item.isGroup ? undefined : otherUsers[0], // Only include user for individual chats
            userCount: item.isGroup ? item.users.length : undefined, // Contagem de usuários
            users: item.isGroup ? item.users : undefined,
            lastMessage: item.messages[0]
          };
        })
        .sort((a, b) => {
          // Sort by the creation date of the last message in descending order
          const aDate = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
          const bDate = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
          return bDate - aDate;
        });

      return ChatBox;
    } catch (error:any) {
      console.error("Error fetching conversations:", error.message);
      throw new Error(error.message);
    }
  }

  async ExistingChat(userId1: number, userId2: number) {
    return await prisma.conversation.findFirst({
      where: {
        AND: [
          { users: { some: { id: userId1 } } },
          { users: { some: { id: userId2 } } }
        ]
      }
    });
  }

  async VisualizarMessage(messageId: number) {
    return await prisma.message.update({
      where: { id: Number(messageId) },
      data: { viewedAt: new Date() },
    });
  }
  async UpdateMessage(messageId: number, content: string, senderId: number) {
    return await prisma.message.update({
      where: { id: Number(messageId), senderId },
      data: {
        content,
        viewedAt: null,
      },
    });
  }

  async DeleteMessage(messageId: number, senderId: number) {
    return await prisma.message.update({
      where: { id: Number(messageId), senderId },
      data: {
        deleted: true,
      }

    });
  }

  async DeleteChat(conversaId: number) {
    return await prisma.conversation.delete({
      where: { id: conversaId },
      include: {
        messages: true,
        users: true,
      }

    });
  }

  async SearchChat(query: string, userId: number) {
    // Find conversations matching the query
    const chats = await prisma.conversation.findMany({
      where: {
        OR: [
          { messages: { some: { content: { contains: query, mode: "insensitive" } } } },
          {
            users: {
              some: {
                name: { contains: query, mode: 'insensitive' },
                status: {
                  in: ["ativo", "confirmar"]
                }
              }
            }
          },
        ],
      },
      include: {
        users: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    // Map and sort the conversations
    const chatBox = chats
      .map(item => ({
        conversaId: item.id,
        user: item.users.find(user => user.id !== userId), // Ensure we exclude the current user
        lastMessage: item.messages[0]
      }))
      .filter(item => item.user) // Exclude items where user is not found
      .sort((a, b) => {
        // Sort by the creation date of the last message in descending order
        const aDate = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
        const bDate = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
        return bDate - aDate;
      });

    return chatBox;
  }

  async Blocked_desblocked_chat(conversaId: number, isBlocked: boolean) {
    return await prisma.conversation.update({
      where: { id: conversaId },
      data: { isBlocked },
      include: { users: true }
    });
  }

  async onlyAdminsCanSend(id: number, onlyAdminsCanSend: boolean) {
    return await prisma.conversation.update({
      where: { id },
      data: { onlyAdminsCanSend },
      include: { users: true }
    });
  }
}


export const chatModel = new ChatModel()