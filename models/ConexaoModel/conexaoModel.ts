import { Controler } from '../../controllers/controller/controler';
import { prisma } from '../../database/prisma';

export type ConnectionStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';

class ConnectionModel extends Controler {
  async createConnection(userId: number, connectedUserId: number) {
    return prisma.connection.create({
      data: {
        userId,
        connectedUserId,
      },
    });
  }
  async VerifyConnection(userId: number, connectedUserId: number) {
    // Verifica se já existe um pedido de amizade entre os usuários
    return await prisma.connection.findFirst({

      where: {
        userId: userId,
        connectedUserId: connectedUserId,
        user: {
          status: {
            in: ['ativo', 'confirmar']
          }
        },
        connectedUser: {
          status: {
            in: ['ativo', 'confirmar']
          }
        }
      },
    });
  }
  //ver conexaoes pendentes
  async getPendingConnections(userId: number) {
    const pendingConnections = await prisma.connection.findMany({
      where: {
        connectedUserId: userId,
        status: 'PENDING',
        user: {
          status: {
            in: ['ativo', 'confirmar']
          }
        },
        connectedUser: {
          status: {
            in: ['ativo', 'confirmar']
          }
        }
      },
      include: {
        user: true,
      },
    });


    // Obter IDs dos usuários conectados
    const connectedUserIds = pendingConnections.map(conn => conn.userId);
    const connectionsSet = new Set(connectedUserIds);

    // Encontrar amigos em comum
    const connectionsWithCommonFriends = await Promise.all(pendingConnections.map(async (conn) => {
      // Buscar amigos do usuário atual
      const userFriends = await prisma.connection.findMany({
        where: {
          userId: userId,
          status: 'ACCEPTED',
        },
        select: {
          connectedUserId: true,
        },
      });

      // Obter IDs dos amigos do usuário atual
      const userFriendIds = userFriends.map(friend => friend.connectedUserId);

      // Encontrar amigos em comum com o usuário conectado
      const commonFriends = await prisma.connection.count({
        where: {
          userId: conn.userId,
          connectedUserId: {
            in: userFriendIds,
          },
          status: 'ACCEPTED',
        },
      });
      const { user, ...rest } = conn;

      return {
        ...rest,
        user: {
          ...user,
          commonFriends: commonFriends,
        },
      };
    }));

    return connectionsWithCommonFriends

  }
  async getPendingConnectionsId(userId: number) {
    const pendingConnections = await prisma.connection.findMany({
      where: {
        userId: userId,
        status: 'PENDING',
        user: {
          status: {
            in: ['ativo', 'confirmar']
          }
        },
        connectedUser: {
          status: {
            in: ['ativo', 'confirmar']
          }
        }
      },
      include: {
        connectedUser: true,
      },
    });

    // Encontrar amigos em comum
    const connectionsWithCommonFriends = await Promise.all(pendingConnections.map(async (conn) => {
      // Buscar amigos do usuário atual
      const userFriends = await prisma.connection.findMany({
        where: {
          userId: userId,
          status: 'ACCEPTED',
        },
        select: {
          connectedUserId: true,
        },
      });

      // Obter IDs dos amigos do usuário atual
      const userFriendIds = userFriends.map(friend => friend.connectedUserId);

      // Encontrar amigos em comum com o usuário conectado
      const commonFriends = await prisma.connection.count({
        where: {
          userId: conn.userId,
          connectedUserId: {
            in: userFriendIds,
          },
          status: 'ACCEPTED',
        },
      });

      // Retornar o objeto sem a propriedade `connectedUser`
      const { connectedUser, ...rest } = conn;

      return {
        ...rest,
        user: {
          ...connectedUser,
          commonFriends: commonFriends,
        },
      };
    }));

    return connectionsWithCommonFriends;
  }


  // Ver conexões aceitas
  async getAcceptedConnections(userId: number) {
    // Obter conexões aceitas
    const connections = await prisma.connection.findMany({
      where: {
        OR: [
          {
            userId: userId,
            status: 'ACCEPTED',
            user: {
              status: {
                in: ['ativo', 'confirmar']
              }
            }
          },
          {
            connectedUserId: userId,
            connectedUser: {
              status: {
                in: ['ativo', 'confirmar']
                
              }
            },
            status: 'ACCEPTED',
          },

        ],
      },
      include: {
        user: true,
        connectedUser: true,
      },
    });

    // Extrair amigos aceitos
    const friends = connections.flatMap(conn => [
      conn.user.id !== userId ? { ...conn.user, connectionId: conn.id } : null,
      conn.connectedUser.id !== userId ? { ...conn.connectedUser, connectionId: conn.id } : null,
    ]).filter(friend => friend !== null);
    // Obter amigos em comum para cada amigo
    const friendsWithCommonFriends = await Promise.all(
      friends.map(async friend => {
        const commonConnections = await prisma.connection.findMany({
          where: {
            status: 'ACCEPTED',
            OR: [
              {
                userId: friend?.id,
                connectedUserId: {
                  in: friends.map(f => f?.id || 0),
                },
              },
              {
                connectedUserId: friend?.id,
                userId: {
                  in: friends.map(f => f?.id || 0),
                },
              },
            ],
          },
          include: {
            user: true,
            connectedUser: true,
          },
        });

        const commonFriends = commonConnections.flatMap(conn => [
          conn.user.id !== friend?.id ? conn.user : null,
          conn.connectedUser.id !== friend?.id ? conn.connectedUser : null
        ]).filter(commonFriend => commonFriend !== null && commonFriend.id !== userId);

        return {
          ...friend,
          commonFriends,
        };
      })
    );

    return friendsWithCommonFriends;

  }



  // Ver pedidos de conexão enviados
  async getSentConnections(userId: number) {
    const connections = await prisma.connection.findMany({
      where: {
        userId: userId,
        user: {
          status: {
            in: ['ativo', 'confirmar']
          }
        },
        connectedUser: {
          status: {
            in: ['ativo', 'confirmar']
          }
        }
      },
      include: {
        connectedUser: true,
      },
    });

    return connections;
  }

  async updateConnectionStatus(id: number, status: ConnectionStatus) {
    return prisma.connection.update({
      where: { id },


      data: { status },
    });
  }

  async deleteConnection(id: number) {
    return prisma.connection.delete({
      where: { id },
    });
  }

  async rejectConnection(connectionId: number, userId: number) {
    const connection = await prisma.connection.updateMany({
      where: {
        id: connectionId,
        connectedUserId: userId,
        status: 'PENDING',
      },
      data: {
        status: 'REJECTED',
      },
    });

    if (connection.count === 0) {
      throw new Error('Pedido de amizade não encontrado ou já respondido.');
    }

    return connection;
  }


  async PossibleConnection(userId: number) {
    const userConnections = await prisma.connection.findMany({
      where: {
        OR: [
          {
            userId: userId,
            user: {
              status: {
                in: ['ativo', 'confirmar']
              }
            },
            connectedUser: {
              status: {
                in: ['ativo', 'confirmar']
              }
            }

          },
          {
            connectedUserId: userId,
            user: {
              status: {
                in: ['ativo', 'confirmar']
              }
            },
            connectedUser: {
              status: {
                in: ['ativo', 'confirmar']
              }
            }
          },

        ],

      },
    });

    // Extrair os IDs dos usuários conectados
    const connectedUserIds = userConnections.flatMap(connection => [
      connection.userId,
      connection.connectedUserId,
    ]);

    // Filtrar conexões para excluir os já conectados ou pendentes
    const filteredUserIds = connectedUserIds.filter(id => id !== userId);
    // Adicionar o ID do administrador (24) à lista de exclusão
    filteredUserIds.push(24);
    // Buscar todos os usuários que não estão conectados ou com pedidos pendentes
    const possibleConnections = await prisma.user.findMany({
      where: {
        id: {
          notIn: filteredUserIds,
          not: userId,
        },
      },
    });

    // Calcular amigos em comum
    const possibleConnectionsWithCommonFriends = await Promise.all(
      possibleConnections.map(async user => {
        const commonFriends = await prisma.connection.count({
          where: {
            status: 'ACCEPTED',
            AND: [
              { userId: userId },
              { connectedUserId: user.id },
            ],
            OR: [
              {
                userId: user.id,
                connectedUserId: userId,
              },
              {
                userId: userId,
                connectedUserId: user.id,
              },
            ],
          },

        });

        return {
          ...user,
          commonFriends,
        };
      })
    );

    // Ordenar aleatoriamente
    possibleConnectionsWithCommonFriends.sort(() => Math.random() - 0.5);


    return possibleConnectionsWithCommonFriends;
  }

  async IgnoretedUserId(userId: number, ignoredUserId: number) {
    await prisma.connection.updateMany({
      where: {
        OR: [
          { userId: userId, connectedUserId: ignoredUserId },
          { userId: ignoredUserId, connectedUserId: userId },
        ],
        status: { in: ['PENDING', 'ACCEPTED'] } // Considerar apenas status PENDING e ACCEPTED para ignorar
      },
      data: {
        status: 'IGNORED'
      },
    });

  }
}

export const connectionModel = new ConnectionModel();
