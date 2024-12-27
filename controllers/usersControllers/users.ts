import { Request, Response } from "express";
import { userModel } from "../../models/usersModel/userModel";
import { Errors } from "../../utils/Errors";
import { ConfirmarEmail, UserValidator } from "./user-validate";
import { PasswordReset } from "../controller/Token_Controler";
import { controler_app } from "../controller/permissao-app";
import { excluirImagemNoDiretorio } from "../../utils/DeleteMedia";
import Validations from "../../utils/validate";
import { connectionModel } from "../../models/ConexaoModel/conexaoModel";
import { Ip } from "../..";

class UserController extends Validations {


  async SearchAll(req: Request, res: Response) {
    const { query } = req.body
    try {
      const data = await userModel.SearchAll(query)
      res.status(200).json(data)
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }

  }

  async getAllUsers(_: any, res: Response) {

    try {
      const data = await userModel.findAll();
      res.status(200).json({ data });
    } catch (error) {
      return res.status(500).json({ message: "erro no servidor" });

    }
  }

  async getUserById(req: Request, res: Response) {

    try {
      const data = await userModel.findById(Number(req.params.id));
      const friends = await connectionModel.getAcceptedConnections(Number(req.params.id))

      if (!data) return Errors.NotFoundError({ message: 'Usuario não encontrado', name: "" }, res)

    if(data.status ==="inativo")  return Errors.UnathourizedError({ message: 'Usuario bloqueado pelo sistema', name: "" }, res)


      return res.json({ data, friends });

    } catch (error: any) {
      return Errors.BadRequestError(error, res)
    }
  }

  async UploadPhotosGaleria(req: Request, res: Response) {

    try {
      const { userId } = req.body
      //
      let photos: string[] = [];
      let videos: string[] = [];

      if (req.files && Array.isArray(req.files)) {

        for (const file of req.files) {
          if (file.mimetype.startsWith('image/')) {

            photos.push('media/' + file.filename)
          } else if (file.mimetype.startsWith('video/')) {
            videos.push('media/' + file.filename)
          }
        }
      } else if (req.file) {

        if (req.file.mimetype.startsWith('image/')) {
          photos.push('media/' + req.file.filename);
        } else if (req.file.mimetype.startsWith('video/')) {
          videos.push('media/' + req.file.filename);
        }

      }
      const data = await userModel.UploadPhotosGaleria(Number(userId), photos, videos)
      if (data) {
        return res.json({ message: "", data });
      } else {

        return Errors.NotFoundError({ message: 'Usuario não encontrado', name: "" }, res)
      }
    } catch (error) {
      return Errors.BadRequestError({ message: 'Usuario não encontradoO', name: "" }, res)
    }
  }


  async getUserByEmail(req: Request, res: Response) {

    try {
      const { email } = req.body
      const data = await userModel.findByEmailResetPassword(email);

      if (data) {

        await ConfirmarEmail(email, "recuperar")
        return res.json({ data });
      } else {

        return Errors.NotFoundError({ message: 'Usuario não encontrado', name: "" }, res)
      }
    } catch (error) {
      return Errors.BadRequestError({ message: 'Usuario não encontradoO', name: "" }, res)
    }
  }

  async UpdatePassword(req: Request, res: Response) {

    try {
      const { newPassword, email } = req.body
      console.log(newPassword, email)

      const isPassword: any = Validations.validatePassword(newPassword)


      if (isPassword.message) {
        return Errors.BadRequestError({ message: isPassword.message, name: "" }, res);
      }

      const data = await userModel.UpdatePassword(newPassword, email);

      if (data) {
        return res.json({ data });
      }
      else {

        return Errors.NotFoundError({ message: 'Usuario não encontrado', name: "" }, res)
      }
    } catch (error: any) {
      return Errors.BadRequestError(error, res)
    }
  }

  async Create_User(req: Request, res: Response) {
    const { name, password, email, telefone, profissao, profileName, companyName, companyLocation, companyNIF, businessAreaId, nacionality, genero } = req.body;

    console.log(name, password, email, telefone, profissao, genero);

    const isphoneNumber: any = Validations.isValidPhoneNumber(telefone)

    const isvalidName: any = Validations.isValidName(name)
    const isJob: any = Validations.isValidName(profissao)
    const isPassword: any = Validations.validatePassword(password)


    if (isPassword.message) {
      return Errors.BadRequestError({ message: isPassword.message, name: "" }, res);
    }
    if (isphoneNumber.message) {
      return Errors.BadRequestError({ message: isphoneNumber.message, name: "" }, res);
    }
    if (isvalidName.message) {
      return Errors.BadRequestError({ message: isvalidName.message, name: "" }, res);
    }
    if (isJob.message) {
      return Errors.BadRequestError({ message: "profissao " + isJob.message, name: "" }, res);
    }


    try {

      // Verifica se o email já está em uso
      const existingUser = await userModel.findByEmail(email)
      const existingUserTelefone = await userModel.findByEmail(telefone)
     
      if (existingUser || existingUserTelefone) {

        return Errors.handleError({ message: "Email ou Telefone Já existe", name: "" }, res)
      }
      // Verifica se o perfil existe
      if (profileName == "Singular") {

        const user = await userModel.Store(email, password, name, telefone, profissao, genero, nacionality);

        await ConfirmarEmail(email, "cadastrar")
        
        return res.status(201).json({ message: "Usuario criado", user });
      }

      else {

        const iscompanylocation: any = Validations.isValidName(companyLocation);
        const isCompanyName: any = Validations.isValidName(companyName);
        const isCompanyNif: any = Validations.ValidateNif(companyNIF);

        if (isCompanyName.message) {
          return Errors.BadRequestError({ message: isCompanyName.message, name: "" }, res);
        }
        if (iscompanylocation.message) {
          return Errors.BadRequestError({ message: iscompanylocation.message, name: "" }, res);
        }
        if (isCompanyNif.message) {
          return Errors.BadRequestError({ message: isCompanyNif.message, name: "" }, res);
        }

        let companyPhotos: string[] = [];

        if (req.files && Array.isArray(req.files)) {
          // Process multiple files
          for (const file of req.files) {
            //   const uploadResult = await provider.upload(file, "company/");
            if (file.mimetype.startsWith('image/')) {
              companyPhotos.push(file.filename)
            }
          }
        } else if (req.file) {
          // Process a single file
          //   const uploadResult = await provider.upload(req.file, "company/")
          if (req.file.mimetype.startsWith('image/')) {
            companyPhotos.push(req.file.filename);
          }
        }
        const user = await userModel.Store_Company(name, email, password, telefone, companyName, companyLocation, companyPhotos, companyNIF, Number(businessAreaId), nacionality)

        await ConfirmarEmail(email, "cadastrar")
        return res.status(201).json({ message: "Usuario criado", user });

      }
    } catch (error: any) {
      return Errors.BadRequestError(error, res)
    }
  }
  async Count_user(_: any, res: Response) {
    const data = await userModel.Count_user()
    res.json({ data })
  }

  async Status_User(req: Request, res: Response) {
    const { userId, status } = req.body;

    try {
      const data = await userModel.StatusUser(Number(userId), status)
      res.status(200).json({ message: "usuario actualizado", data })
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }

  async find_token(req: Request, res: Response) {

    try {
      const { token, segure } = req.params;


      const result = await PasswordReset.find_Token(token)

      if(!result) return Errors.NotFoundError({message: "token não encontrado", name: ""}, res)
     
        await userModel.Confirm_Email(result.email)
     
      const resultStatus: string = result.email;

      await PasswordReset.DeleteToken(result.id)

      if (segure == "cadastro") {
        return res.status(200).json({ message: "Email Confirmado", email: result?.email })
      }
      res.redirect(`http://${Ip}:3000/redefinirSenha/${resultStatus}`);
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }

  }

  async find_tokenCadastro(req: Request, res: Response) {

    try {
      const { token, segure } = req.params;

      const result = await PasswordReset.find_Token(token)
      console.log(token, result)

      if(!result) return Errors.NotFoundError({message: "token não encontrado", name: ""}, res)
     
        await userModel.Confirm_Email(result.email)

        await PasswordReset.DeleteToken(result.id)
      
      if (segure == "cadastro") {
        return res.status(200).json({ message: "Email Confirmado" })
      }
      res.redirect(`http://${Ip}:3000/login`);
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }

  }


  async UpdatePhoto(req: Request, res: Response) {
    const { id } = req.body
    let photo: string = ""
    try {

      const idPhoto = await userModel.findById(Number(id))
      if (req.files && Array.isArray(req.files)) {

        for (const file of req.files) {

          if (file.mimetype.startsWith('image/')) {

            photo = 'media/' + file.filename
          }
        }
      } else if (req.file) {
        // Process a single file
        if (req.file.mimetype.startsWith('image/')) {
          photo = 'media/' + req.file.filename
        }
      }

      const data = await userModel.UpdatePhoto(Number(id), photo)

      if (idPhoto?.photo) {
        await excluirImagemNoDiretorio(idPhoto?.photo)
      }

      res.status(200).json({ message: "Foto Adicionanda", data })
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }
  async Delete_user(req: Request, res: Response) {
    const { id } = req.params

    try {
      const data = await userModel.Delete_User(Number(id))

      res.status(200).json({ message: "Usuario Deletado", data })
    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao Deletar usuario", name: "" }, res)
    }
  }

  async Update_User(req: Request, res: Response) {
    const { id, name, email, telefone, profissao } = req.body

    const isphoneNumber: any = Validations.isValidPhoneNumber(telefone)

    const isvalidName: any = Validations.isValidName(name)
    const isJob: any = Validations.isValidName(profissao)


    if (isphoneNumber.message) {
      return Errors.BadRequestError({ message: isphoneNumber.message, name: "" }, res);
    }
    if (isvalidName.message) {
      return Errors.BadRequestError({ message: isvalidName.message, name: "" }, res);
    }
    if (isJob.message) {
      return Errors.BadRequestError({ message: "profissao " + isJob.message, name: "" }, res);
    }

    try {
      const data = await userModel.UpdateUser(Number(id), name, email, telefone, profissao)

      res.status(200).json({ message: "Usuario Actualizado", data })

    } catch (error) {
      Errors.BadRequestError({ message: "Erro ao Actualizar usuario", name: "" }, res)
    }
  }

  async SearchUser(req: Request, res: Response) {
    const { query } = req.body;

    try {
      const data = await userModel.SearchUser(query);

      res.status(200).json({ data })

    } catch (error) {
      Errors.BadRequestError({ name: "", message: "Erro ao pesquisar usuario" }, res)
    }
  }

  async CalculatePercente(req: Request, res: Response) {

    try {
      const data = await userModel.calculateNationalityPercentage()

      res.status(200).json({ data })

    } catch (error: any) {
      Errors.BadRequestError({ message: "erro a obter percentagem", name: error.name }, res)
    }
  }

  async UserActivity(_: any, res: Response) {
    try {
      const data = await userModel.Activity()

      res.status(200).json({ data })

    } catch (error: any) {
      Errors.BadRequestError({ message: "erro a obter percentagem", name: error.name }, res)
    }
  }

  async BlockUserId(req: Request, res: Response) {
    const { UserId, permissionId, duration } = req.body
    try {


      const blockedUntil = new Date();
      blockedUntil.setHours(blockedUntil.getHours() + duration);

      const data = await controler_app.BloquearUser(Number(UserId), Number(permissionId), blockedUntil)
      res.status(200).json({ data, message: "Usuario bloqueado nesta permissão" })
    } catch (error: any) {
      Errors.BadRequestError(error, res)
    }
  }
  async DesblockUserId(req: Request, res: Response) {
    const { UserId, permissionId } = req.body
    try {
      const data = await controler_app.DesbloquearUser(Number(UserId), Number(permissionId))

      res.status(200).json({ data, message: "Usuario desbloqueado nesta permissão" })
    } catch (error: any) {
      Errors.BadRequestError({ message: "erro ao bloquear usuario", name: error.name }, res)
    }
  }

}

export const userController = new UserController();


