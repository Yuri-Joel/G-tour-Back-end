import { Request, Response } from "express";
import { postModel } from '../../models/PostModel/postModel'
import { Errors } from "../../utils/Errors";
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";
import { Controler } from "../controller/controler";
import { connectionModel } from "../../models/ConexaoModel/conexaoModel";
import { notificationModel } from "../../models/notificationModel/notification-model";
import { notificationControl } from "../notification/notificationControllers";



class PostController extends Controler {

  async createPost(req: Request, res: Response) {
    const { descricao, authorId, provinceId } = req.body;

    console.log(descricao, authorId, provinceId);

    let photos: string[] = [];
    let videos: string[] = [];
    try {
      if (req.files && Array.isArray(req.files)) {

        for (const file of req.files) {

          //      const uploadResult = await provider.upload(file, "post/uploads");

          if (file.mimetype.startsWith('image/')) {

            photos.push('media/' + file.filename)
          } else if (file.mimetype.startsWith('video/')) {
            videos.push('media/' + file.filename)
          }
        }
      } else if (req.file) {
        // Process a single file
        //   const uploadResult = await provider.upload(req.file, "post/uploads");

        if (req.file.mimetype.startsWith('image/')) {
          photos.push('media/' + req.file.filename);
        } else if (req.file.mimetype.startsWith('video/')) {
          videos.push('media/' + req.file.filename);
        }

      }

      let newPost
      if (provinceId == undefined) {
        newPost = await postModel.createPost(
          {
            descricao,
            photos,
            videos,
            authorId: Number(authorId),
          });

      } else {

        newPost = await postModel.createPostProvincia(
          {
            descricao,
            photos,
            videos,
            authorId: Number(authorId),
            provinceId: Number(provinceId)
          });
      }
     
      return res.status(201).json(newPost);
    } catch (error: any) {

      Errors.BadRequestError({ message: "Erro ao fazer publicação", name: "" }, res);
    }
  }
  async deletePost(req: Request, res: Response) {
    const postId = parseInt(req.body.postId);
    const userId = parseInt(req.body.userId);
    const {IsAdmin} = req.body

    try {

      const post = await postModel.getPostById(postId);
       
       if (!post) {
      return Errors.BadRequestError({ message: "Post não encontrado", name: "" }, res);
    }
       if (!IsAdmin && (post.authorId !== userId)) {
      return Errors.BadRequestError({ message: "Post não autorizado ou não encontrado", name: "" }, res);
    }

      const media = [...post.photos, ...post.videos];

      if (media.length > 0) {


        for (const mediaUrl of media) {
          if (mediaUrl) {
            /*   const parts = mediaUrl.split('/');
              const lastPart = parts.pop();
              const publicId = lastPart ? lastPart.split('.')[0] : null; */
            /*   if (publicId) {
                //  console.log(publicId);
                await provider.delete(publicId);
              } */
            /*  else {
               console.error("Erro ao extar:", mediaUrl);
               Errors.BadRequestError({ message: `Erro ao extar:, ${mediaUrl}`, name: "" }, res)
             } */
            await excluirImagemNoDiretorio(mediaUrl)
          }
        }
        const result = await postModel.deletePost(postId);
        return res.status(200).json(result);
      }
      const result = await postModel.deletePost(postId);
      res.status(200).json(result);
    }
    catch (error: any) {

      Errors.BadRequestError(error, res)
    }
  }

  async GetPost(req: Request, res: Response) {

    try {
      const {userId} = req.params
      const allPosts = await postModel.getRandomPosts(Number(userId));

      res.status(200).json(allPosts);
    } catch (error: any) {
      console.error('Error in GetPost controller:', error);
      res.status(500).json({ message: 'Error retrieving posts', details: error.message });
    }
  }
  async GetPostUserId(req: Request, res: Response) {

    try {
      const { id } = req.params

      const data = await postModel.getAllPostsUserId(Number(id));

      res.status(200).json({ data });
    } catch (error: any) {
      console.error('Error in GetPost controller:', error);
      res.status(500).json({ message: 'Error retrieving posts', details: error.message });
    }
  }
  async GetPostProvinceId(req: Request, res: Response) {

    try {
      const { provinceId } = req.params

      const data = await postModel.getAllPostsProvinceId(Number(provinceId));

      res.status(200).json({ data });
    } catch (error: any) {
      console.error('Error in GetPost controller:', error);
      res.status(500).json({ message: 'Error retrieving posts', details: error.message });
    }
  }
}

export const postController = new PostController();
