import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
import { artigo } from "../../models/Artigo-analise-anuncio-model/Artigo-Model";
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";


class Artigo_Controllers {


  async CreateArtigo(req: Request, res: Response) {
    const { nome_artigo, preco, userId, familia, estado } = req.body

    try {
      let photos: string = "";
      let videos: string = "";
      if (req.files && Array.isArray(req.files)) {

        for (const file of req.files) {

          //      const uploadResult = await provider.upload(file, "post/uploads");

          if (file.mimetype.startsWith('image/')) {

            photos = ('media/' + file.filename)
          } else if (file.mimetype.startsWith('video/')) {
            videos = ('media/' + file.filename)
          }
        }
      } else if (req.file) {
        // Process a single file
        //   const uploadResult = await provider.upload(req.file, "post/uploads");

        if (req.file.mimetype.startsWith('image/')) {
          photos = ('media/' + req.file.filename);
        } else if (req.file.mimetype.startsWith('video/')) {
          videos = ('media/' + req.file.filename);
        }
      }
      const data = await artigo.CreateArtigo(nome_artigo, photos, Number(preco), Number(userId), familia, estado)

      res.status(201).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao criar Artigo", name: "" }, res)
    }
  }
  async GetArtigo(req: Request, res: Response) {
    const { userId } = req.params

    try {
      const data = await artigo.get_Artigo(Number(userId))

      res.status(201).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao obter Artigo", name: "" }, res)
    }
  }
  async GetArtigo_All(req: Request, res: Response) {


    try {
      const data = await artigo.get_Artigo_all()

      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao obter Artigo", name: "" }, res)
    }
  }
  async UpdateArtigo(req: Request, res: Response) {
    const { id, nome_artigo, preco, userId, familia, estado, imagem } = req.body


    try {
      const result = await artigo.Get_Artigo_Unique(Number(id))

      if (!result) {
        return Errors.NotFoundError({ message: "Erro Produto não encotrado", name: "" }, res)
      }

      let photos: string = result.imagem ? result?.imagem : "";
      let videos: string = "";
      if (req.files && Array.isArray(req.files)) {

        for (const file of req.files) {

          if (file.mimetype.startsWith('image/')) {

            photos = ('media/' + file.filename)
            console.log(photos)
          } else if (file.mimetype.startsWith('video/')) {
            videos = ('media/' + file.filename)
          }
        }
      } else if (req.file) {
        // Process a single file
        //   const uploadResult = await provider.upload(req.file, "post/uploads");

        if (req.file.mimetype.startsWith('image/')) {
          photos = ('media/' + req.file.filename);
        } else if (req.file.mimetype.startsWith('video/')) {
          videos = ('media/' + req.file.filename);
        }
      }
      const data = await artigo.Update_Artigo(Number(id), nome_artigo, photos, Number(preco), Number(userId), familia, estado)

      res.status(201).json({ data })
    } catch (error: any) {
      Errors.BadRequestError({ message: error.message, name: "" }, res)
    }
  }

  async DeleteArtigo(req: Request, res: Response) {
    const { id } = req.params

    try {

      const result = await artigo.Get_Artigo_Unique(Number(id))

      if (!result) {
        return Errors.NotFoundError({ message: "Erro Produto não encotrado", name: "" }, res)
      }
      if (result.imagem) {

        await excluirImagemNoDiretorio(result.imagem)
      }

      const data = await artigo.Delete_Artigo_Unique(Number(id));

      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao deletar Artigo", name: "" }, res)
    }
  }


}

export const artigo_Control = new Artigo_Controllers()