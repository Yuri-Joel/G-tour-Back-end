import { Request, Response } from 'express';
import { commentModel } from '../../../models/PostModel/commentModel/commentModel';
import { Errors } from '../../../utils/Errors';


class CommentControllers {
    
    async CreateComment(req: Request, res: Response) {
        const { content, postId, authorId,  parentId } = req.body
        try {
           
            if (parentId) {
                const data = await commentModel.ResponderComment(content, Number(postId), Number(authorId), Number(parentId))
                return res.status(201).json({ data })
            }
            const data = await commentModel.createComment({ content, postId, authorId })

            
            
            res.status(201).json({ data })


        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao fazer comentario", name: "" }, res)
        }
    }

    replyToComment = async (req: Request, res: Response) => {
        const { content, postId, authorId, parentId } = req.body;

        try {

            const data = await commentModel.ResponderComment(content, Number(postId), Number(authorId), Number(parentId))


            res.status(201).json({ data });
        } catch (error) {
            res.status(500).json({ error: 'Failed to reply to comment' });
        }
    };
    async DeleteComment(req: Request, res: Response) {
        try {
            const { id } = req.params
            const data = await commentModel.DeleteComment(Number(id));

            res.status(200).json({ message: "comentario deletado", data })

        } catch (error) {
            Errors.BadRequestError({ message: "Erro ao deletar", name: "" }, res)
        }
    }


    async UpdateComment(req: Request, res: Response) {
        const { content, id, userIdPostId } = req.body
        console.log(content, id, userIdPostId)
        try {

            const data = await commentModel.updateComment(Number(id), content)

           

            res.status(200).json({ data })

        } catch (error: any) {
            Errors.BadRequestError({ message: "erro ao editar comentario", name: "" }, res)
        }
    }

    async AddreactionComment(req: Request, res: Response){


        try {
            
        } catch (error) {
            Errors.BadRequestError({message: "Erro ao criar reacao", name: ""}, res)
        }
    }
}

export const commentControllers = new CommentControllers()