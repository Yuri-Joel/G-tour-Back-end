import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { Errors } from "../../utils/Errors";
import { user_admin } from "../../models/usersModel/user_admin";
import { updateSessionInfo } from "../../middlewares/AuthControllersAdmin";

export class Login_Admin {

  // Método estático para realizar o login
  static async login(req: Request, res: Response) {
    // Chave secreta para assinar o JWT
    const JWT_SECRET: string = process.env.JWT_SECRET || " ";
    // Extraindo email e senha do corpo da requisição
    const { email, password } = req.body;
   
    try {
      // Busca o usuário pelo email
      const user = await user_admin.findByEmail(email);

      // Se o usuário não existir ou a senha estiver incorreta
      if (!user || !(await bcrypt.compare(password, user.password))) {
        // Retorna um erro de não autorizado
        return Errors.UnathourizedError({ message: "Dados incorrectos",name: "" }, res);
      }
  if(!user.active) return Errors.UnathourizedError({ message: "Não autorizado, Usuario Bloqueado",name: "" }, res);
    
      // Cria um token JWT com o ID do usuário
      const token = jwt.sign(
        {
          userId: user.id
        },
        JWT_SECRET,
      );

      // Cria um objeto com os dados do usuário e o token
      const userlogin = {
        id: user.id,
        name: user.name,
        status: true,
        token,
      };

 await updateSessionInfo(user.id) // actualização do tempo de sessão do usuario
     
      // Retorna uma resposta com os dados do usuário e o token
      res.status(200).json({ userlogin, last: user.lastActivity });
    } catch (error: any) {
      // Em caso de erro, loga o erro no console e retorna um erro de requisição inválida
      Errors.BadRequestError({message: "Erro ao fazer login", name: error.name}, res);
    }
  }
}
