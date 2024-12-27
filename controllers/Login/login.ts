import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { userModel } from "../../models/usersModel/userModel";
import bcrypt from 'bcrypt';
import { Errors } from "../../utils/Errors";
import { ConfirmarEmail } from "../usersControllers/user-validate";

export class Login {

  // Método estático para realizar o login
  static async login(req: Request, res: Response) {
    // Chave secreta para assinar o JWT
    const JWT_SECRET: string = process.env.JWT_SECRET || " ";
    // Extraindo email e senha do corpo da requisição
    const { email, password } = req.body;

    try {
      // Busca o usuário pelo email
      const user = await userModel.findByEmail(email);

      // Se o usuário não existir ou a senha estiver incorreta
      if (!user || !(await bcrypt.compare(password, user.password))) {
       
        // Retorna um erro de não autorizado
        return Errors.UnathourizedError({ message: "Dados incorrectos", name: " "}, res);
      }
      // Verifica o status do usuário
      if (user.status == "confirmar") {
        // Se o status for "confirmar", envia um email de confirmação
           await ConfirmarEmail(email, "cadastrar");
        // Retorna uma resposta indicando que o email precisa ser confirmado
        return res.status(200).json({ message: "confirmar o email, foi lhe enviado envio 6 digitos para validar o token" });

      } else if (user.status == "inativo") {
       
        // Se o status for "inativo", retorna um erro de não autorizado
        return Errors.UnathourizedError({ message: "usuario bloqueado pelo Sistema", name: "" }, res);
      }

      // Cria um token JWT com o ID do usuário
      const token = jwt.sign(
        {
          userId: user.id
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
          
        //  expiresIn: "7d", // Token expira em 7 dias
        }
      );

      // Cria um objeto com os dados do usuário e o token
      const userlogin = {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        telefone: user.telefone,
        job: user.job,
        token
      };

    
      // Retorna uma resposta com os dados do usuário e o token
      res.status(200).json({ userlogin });
    } catch (error: any) {
      // Em caso de erro, loga o erro no console e retorna um erro de requisição inválida
      console.error("Erro ao fazer login:", error);
      Errors.BadRequestError(error, res);
    }
  }
}
