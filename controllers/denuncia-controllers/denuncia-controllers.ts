import { Request, Response } from 'express';
import { denuncia } from '../../models/denuncia-model/denuncia-model';
import { Errors } from '../../utils/Errors';
import { notificationControl } from '../notification/notificationControllers';

class DenunciaController {
  async criarDenuncia(req: Request, res: Response) {
    try {
      const { denuncianteId, tipoDenuncia, descricao, denunciadoUserId, denunciadoPostId, denunciadoLocalId } = req.body;

      // Validar o tipo de denúncia, campos obrigatórios, etc.
      if (!denuncianteId || !tipoDenuncia) {
        return Errors.handleError({ message: 'Campos obrigatórios não preenchidos.', name: "" }, res);
      }

      const data = await denuncia.criarDenuncia(
        denuncianteId,
        tipoDenuncia,
        descricao,
        Number(denunciadoUserId),
        denunciadoPostId,
        Number(denunciadoLocalId),
      );


      if (denunciadoPostId) {
        const post = await denuncia.UpdatepostDenunciados(Number(denunciadoPostId))

        // Verificar se a contagem excede 20 para enviar notificação
        if (post.denunciasCount >= 0) {
          await notificationControl.CreateNotification({
            type: 'Rever Post',
            message: `O post do usuario ${post.author.name} atingiu 20 denúncias e precisa ser revisado.`,
            adminType: true,
            postId: denunciadoPostId,

          })
        }

      }

      //usuarios
      if (denunciadoUserId) {
        const User = await denuncia.UpdateusersDenunciados(Number(denunciadoUserId))
        
        // Verificar se a contagem excede 20 para enviar notificação
        if (User.warningsCount !== null && User.warningsCount >= 0) {
          await notificationControl.CreateNotification({
            type: 'Rever Usuario',
            message: `O Usuario ${User.name} atingiu 20 denúncias e precisa ser revisado.`,
            adminType: true,
           userId: denunciadoUserId,

          })
        }

      }
      if (denunciadoLocalId) {
        const Local = await denuncia.UpdateLocalDenunciado(Number(denunciadoLocalId))

        // Verificar se a contagem excede 20 para enviar notificação
        if (Local.denunciasCount >= 0) {
          await notificationControl.CreateNotification({
            type: 'Rever Local Turistico',
            message: `O Local turistico ${Local.name} atingiu 20 denúncias e precisa ser revisado.`,
            adminType: true,
            localId: denunciadoPostId,

          })
        }

      }
      return res.status(201).json(data);
    } catch (error: any) {
      return Errors.BadRequestError({ message: ` ${error.message}`, name: "" }, res);
    }
  }

  async GetMaisDenunciados(_: any, res: Response) {
    try {

      const data = await denuncia.Denuncias()


      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar usuários mais denunciados.' });
    }
  }

  // Outros métodos para listar denúncias, buscar por ID, etc.
}

export const denunciaControl = new DenunciaController();
