import { Request, Response } from "express";
import { postModel } from "../../models/PostModel/postModel";
import { userModel } from "../../models/usersModel/userModel";
import { Errors } from "../../utils/Errors";
import { share } from "../../models/share/share";


class Share_Controllers {


    async CreateShare (req: Request, res: Response){
        try {
            // Verificar se o post e o usuário ex
            const { postId, userId, shareText } = req.body;
            const post = await postModel.getPostById(Number(postId));
            if (!post) return Errors.NotFoundError({ message: 'Post não encontrado' , name: ""}, res);
        
            const user = await userModel.findById(Number(userId));
            if (!user) return Errors.NotFoundError({ message: 'Usuário não encontrado',name: "" }, res);
        
            // Criar um registro de compartilhamento com o texto
           const data = await share.createShare(Number(postId), Number(userId),shareText)
        
            res.status(200).json({ message: 'Post compartilhado com sucesso', data });
          } catch (error: any) {
           
            Errors.BadRequestError(error ,res)
          }
    }
}

export const Share = new Share_Controllers()