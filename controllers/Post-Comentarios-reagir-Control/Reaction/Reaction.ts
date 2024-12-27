import { Request, Response } from "express"
import { reactionModel } from "../../../models/PostModel/ReactionModel/ReactionModel"
import { Errors } from "../../../utils/Errors"

class ReactionControllers{

async CreateReaction(req: Request, res: Response){

const {postId, userId, reactionType} = req.body


try {
    
const data = await reactionModel.addReaction(postId,userId,reactionType)
res.status(201).json({message: "Reacção feita",  data})
    
} catch (error) {
    Errors.BadRequestError({message: "Erro na reacção", name: ""}, res)
}
}


async RemoveReaction (req: Request, res: Response){
    const {postId, userId, reactionType} = req.body;
    try {
        const data = await reactionModel.removeReaction(postId, userId, reactionType)

        res.status(200).json({message: "Reacção removida", data})
    } catch (error) {
        Errors.BadRequestError({message: "Erro na reacção", name: ""}, res)
    }
}



}

export const Reaction = new ReactionControllers()