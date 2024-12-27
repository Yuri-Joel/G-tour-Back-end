import { Request, Response } from "express";
import { Errors } from "../../utils/Errors";
//import { provider } from "../PostControllers/post_image";
import { localModel } from "../../models/LocalTuristico/LocalModel";
import { prisma } from "../../database/prisma";
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";
import Validations from "../../utils/validate";


class Local_TurismoControllers {


  async Create(req: Request, res: Response) {

    try {
      const { name, provinceId, latitude, longitude, address, about, localType } = req.body;


      const Isname: any = Validations.isValidName(name)
      const isdescription: any = Validations.isValidDescription(about)
      const islatitude: any = Validations.isValidLatitude(latitude)
      const islongitude: any = Validations.isValidLongitude(longitude)

      if (Isname.message) {
        return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
      }
      if (islatitude.message) {
        return Errors.BadRequestError({ message: islatitude.message, name: "" }, res);
      }
      if (islongitude.message) {
        return Errors.BadRequestError({ message: islongitude.message, name: "" }, res);
      }
      if (isdescription.message) {
        return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
      }

      let photos: string[] = [];
      let videos: string[] = [];

      const data = await localModel.Create(name, about, Number(provinceId), Number(latitude), Number(longitude), address, localType, photos, videos)
      res.status(201).json({ message: "Local Adicionado",  data  })

    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao inserir local tusistico", name: "" }, res)
    }
  }

  async add_photos_Videos(req: Request, res: Response) {

    const { id } = req.body
    let photos: string[] = [];
    let videos: string[] = [];
    try {
      if (req.files && Array.isArray(req.files)) {
        // Process multiple files
        for (const file of req.files) {

          //    const uploadResult = await provider.upload(file, "turismo/");
          if (file.mimetype.startsWith('image/')) {
            photos.push("media/" + file.filename);
          } else if (file.mimetype.startsWith('video/')) {
            videos.push("media/" + file.filename);
          }
        }
      } else if (req.file) {
        // Process a single file
      //  const uploadResult = await provider.upload(req.file, "turismo/");

        if (req.file.mimetype.startsWith('image/')) {
          photos.push("media/" + req.file.filename);
        } else if (req.file.mimetype.startsWith('video/')) {
          videos.push("media/" + req.file.filename);
        }
      }


      const data = await localModel.Add_photos_videos(Number(id), photos, videos)

      res.status(200).json({ message: "fotos e videos Adicionado", data })

    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao adicionar fotos e videos no local turistico", name: "" }, res)
    }
  }
  async Get_local(_: any, res: Response) {

    try {
      const data = await localModel.Get_Local()
      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao obter local tusistico", name: "" }, res)
    }
  }

  async Update_local(req: Request, res: Response) {
    const { id, name, provinceId, latitude, longitude, address, localType, about } = req.body

    const Isname: any = Validations.isValidName(name)
    const isdescription: any = Validations.isValidDescription(about)
    const islatitude: any = Validations.isValidLatitude(latitude)
    const islongitude: any = Validations.isValidLongitude(longitude)

    if (Isname.message) {
      return Errors.BadRequestError({ message: Isname.message, name: "" }, res);
    }
    if (islatitude.message) {
      return Errors.BadRequestError({ message: islatitude.message, name: "" }, res);
    }
    if (islongitude.message) {
      return Errors.BadRequestError({ message: islongitude.message, name: "" }, res);
    }
    if (isdescription.message) {
      return Errors.BadRequestError({ message: isdescription.message, name: "" }, res);
    }

    try {
      const data = await localModel.Update(Number(id), { name, about, provinceId: Number(provinceId), latitude: Number(latitude), longitude: Number(longitude), address, localType })
      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao editar local tusistico", name: "" }, res)
    }
  }

  async SearchGlobal(req: Request, res: Response) {
    const { query } = req.body
    try {
      const data = await localModel.searchGlobal(query)
      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao pesquisar", name: "" }, res)

    }
  }
  async SearchBytype(req: Request, res: Response) {
    const { query } = req.params


    try {
      const data = await localModel.searchGlobal(query)

      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao pesquisar", name: "" }, res)

    }
  }
  async SearchByProvince(req: Request, res: Response) {
    const { query } = req.body
    try {
      const data = await localModel.searchByProvince(query)

      res.status(200).json({ data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao pesquisar", name: "" }, res)

    }
  }
  async Delete_local(req: Request, res: Response) {
    const { id } = req.params

    const result: any = await localModel.GetLocalId(Number(id))
    try {


      if (result?.Photo_TouristSpot.length > 0 || result?.Video_TouristSpot.length > 0) {

        const media = [...result?.Photo_TouristSpot]

        for (const mediaurl of media) {
          if (mediaurl.photo) {
            //     await provider.delete(mediaurl.photo)
            await excluirImagemNoDiretorio(mediaurl.photo)
          }

        }
        const mediaVideo = [...result?.Video_TouristSpot]
        for (const mediaurl of mediaVideo) {
          if (mediaurl.Video) {
            //  await provider.delete(mediaurl.Video)
            await excluirImagemNoDiretorio(mediaurl.Video)
          }
        }

        const data = await localModel.Delete(Number(id))
        return res.status(200).json({ data })


      }

      else {
        const data = await localModel.Delete(Number(id))
        return res.status(200).json({ data })

      }

    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao Eliminar local tusistico", name: "" }, res)
    }
  }


  async DeleteMedia(req: Request, res: Response) {
    const { id, media } = req.body
    try {
      if (media == "image") {

        const photo = await prisma.photo_TouristSpot.findUnique({
          where: { id: parseInt(id) },
        });
        if (photo) {
          // Delete from Cloudinary
          //    await provider.delete(photo.photo);

          await excluirImagemNoDiretorio(photo.photo)
          // Delete from database

          const data = await localModel.DeleteMediaPhoto(Number(id))
          return res.status(200).json({ message: "Imagem Eliminada", data })
        }

      } else if (media === 'video') {

        const video = await prisma.video_TouristSpot.findUnique({
          where: { id: parseInt(id) },
        });

        if (video) {
          // Delete from Cloudinary
          //   await provider.delete(video.Video);
          await excluirImagemNoDiretorio(video.Video)
          const data = await localModel.DeleteMediaVideo(Number(id))

          return res.status(200).json({ message: 'Video deletado', data });
        }
      }
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao Eliminar Media", name: "" }, res)
    }
  }
}

export const localControllers = new Local_TurismoControllers()