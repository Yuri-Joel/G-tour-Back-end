import { createTransport } from 'nodemailer';
import axios from 'axios'
import { PasswordReset } from '../controller/Token_Controler';
import { userModel } from '../../models/usersModel/userModel';
import { IP_Recuperar } from '../..';


export class UserValidator {

  private readonly nameRegex = /^[a-zA-ZÀ-Á-Â-Ã-Ä-È-É-Ê-Ë-Ì-Í-Î-Ï-Ò-Ó-Ô-Õ-Ö-Ù-Ú-Û-Ü-çÇ-ñÑ]{3,}$/;

  // private readonly passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&*\(\)_+\-=\[\]\{\};':"\\|,.<>\/?])[a-zA-Z0-9!@#\$%\^&*\(\)_+\-=\[\]\{\};':"\\|,.<>\/?]{8,}$/;

  async validateName(name: string): Promise<Boolean> {

    return this.nameRegex.test(name);
  }

  async validateEmail(email: string): Promise<boolean> {
    const data: any = await ConfirmarEmail(email)
    console.log(data);


    async function verificarSMTP(email: string) {
      const dominio = email.split('@')[1];
      const transporter = createTransport({
        host: `smtp.${dominio}`,
        port: 25,
        secure: false,
        tls: {
          rejectUnauthorized: false
        }
      });

      try {
        const response = await transporter.verify();

        console.log(response);

        return response;
      } catch (err) {
        return false;
      }
    }

    const email1: string = "exemplo@dominio.com";
    verificarSMTP(email1).then(isValid => {
      console.log(isValid); // true ou false
    });

    if (data.message == "Sucess") {

      return false;
    } else {
      return false
    }

  }
  validatePassword(password: string) {
    // Verifica se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      return false;
    }

    // Verifica se a senha contém dois espaços consecutivos
    if (/ {2}/.test(password)) {
      return false;
    }

    // Verifica se a senha contém pelo menos um caractere alfabético e um número
    if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
      return false;
    }

    // Se passar pelas verificações, a senha é válida
    return true;
  }


  async validateNumber(telefone: string): Promise<boolean> {

    const isNumber: any = await ValidateNumber(telefone)
    console.log(isNumber);

    return isNumber

  }

}

export const ValidateNumber = async (telefone: string) => {

  if (telefone.length < 7) {

    return false
  }

  if (telefone) {
    // Exemplo de uso:

    const formattedPhoneNumber = await formatPhoneNumber(telefone);
    console.log(formattedPhoneNumber); // Saída: +244935699190

    const result = await validatePhoneNumber(formattedPhoneNumber)
      .then(data => {
        if (data) {
          console.log('Mensagem:', data.message);
          if (data.message == "This is an Angola valid phone number") {
            return true;
          }

        } else {
          console.log('Não foi possível obter os dados.')
          return false;
        }
      })
      .catch(error => {
        console.error('Ocorreu um erro:', error);
        return false
      });
    console.log(result);


    return result
  };
}
async function validatePhoneNumber(phoneNumber: string) {
  try {
    const response = await axios.get(`https://angolaapi.onrender.com/api/v1/validate/phone/${phoneNumber}`);

    console.log(response.data);

    return response.data;
  } catch (error: any) {
    console.error('Ocorreu um erro ao fazer a requisição:', error.data);
    return null;
  }
}
async function formatPhoneNumber(number: string) {
  // Remover todos os caracteres que não sejam dígitos
  const cleanedNumber = number.replace(/\D/g, '');

  // Verificar se o número começa com "244" ou "+244"
  const startsWith244 = /^244/.test(cleanedNumber);
  const startsWithPlus244 = /^\+244/.test(cleanedNumber);

  // Se o número não começar com "244" ou "+244", adicionar "+244" na frente
  let formattedNumber = cleanedNumber;
  if (!startsWith244 && !startsWithPlus244) {
    formattedNumber = '+244' + cleanedNumber;
  }

  return formattedNumber;
}


export const ConfirmarEmail = async (email: string, type?: string) => {

  const tokenAleatorioCrypto = () => {

    return new Promise((resolve, reject) => {
      const seisDigitos = Math.floor(100000 + Math.random() * 900000);

      if (seisDigitos) {
        resolve(seisDigitos.toString());
      } else {
        reject('erro ao gerar Token')
      }
    })
  }

  const token = await tokenAleatorioCrypto();

  const expiraEm: Date = new Date();
  expiraEm.setHours(expiraEm.getHours() + 1)

  const AddEmail = await PasswordReset.CreateToken({ email, token: `${token}`, expiresAt: expiraEm })


  const user = await userModel.findByEmail(email);
  const longdata = expiraEm.toLocaleTimeString();
  if (AddEmail) {

    const transporter = createTransport({
    
      service: 'gmail',
      auth: {
        user: 'ceoyuri23@gmail.com',
        pass: 'cume iuee ojjg qjls',
      },
    });


    const text_criar_conta = `Você criou uma conta dentro do nosso sistema, abaixo segue-se o link para ativação da conta.`
    const text_recuperar_conta = `Você deseja recuperar a sua conta no nosso sistema, abaixo segue-se o link para recuperação da conta.`

    const text = type === "recuperar" ? text_recuperar_conta : text_criar_conta;
    const route = type === "recuperar" ? `verify-pin` : `verify-pin-cadastro`;

    const mailOptions = {
      to: email,
      subject: 'Confirmação de email G_tour ',
      text: `${token}`,
      
      html: `<html>
       <head>
    <meta charset="UTF-8">
    <title>Confirmação de email - G Tour Angola</title>
    <style>
        body {
            font-family: Arial, sans-serif;
        }

        .container {
            max-width: 600px;
            margin: 40px auto;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .btn-verify {
            background-color: #337ab7;
            color: #ddd;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
          
        }

        .btn-verify:hover {
            background-color: #235a8a;
        }
        .control{
          
            justify-content: center;
            text-align: center;
        }
        strong{
            color: #235a8a;
        }
    </style>
</head>

<body>
    <div class="container">
        <h2>Benvindo(a) ao G Tour</h2>
        <p>Olá sr(a). ${user?.name},</p>
        <p>Seja Bem-vindo(a) à nossa Plataforma.</p>
        <p>${text}</p>
        <p>Seu codigo expira a<strong >${longdata}</strong>, Código de Verificação é <strong>${token}</strong></p>

        <div class="control">
            <a href="http://${IP_Recuperar}:8800/${route}/${token}/" " class="btn-verify">
                CLIQUE AQUI
            </a>
        </div>
        <p>Se você tiver alguma dúvida, entre em contato conosco! Estaremos sempre prontos para ajudá-lo.</p>
        <p>Benvindo(a) ao G tour</p>
    </div>
</body>

</html>
        `,
    };


    return new Promise((resolve) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {

          resolve({ message: 'Erro ao enviar o Pacote', status: error.message });
        } else {

          resolve({ message: "Sucess", status: `E-mail enviado com sucesso: ${info.response}` });
        }
      });
    });


  } else {
    return { message: "Erro no servidor!" }
  }
}

/*
  <html>
<head>
<meta charset="UTF-8">
<title>Confirmação de email - Mukandu</title>
<style>
body {
font-family: Arial, sans-serif;
}
.container {
max-width: 600px;
margin: 40px auto;
padding: 20px;
background-color: #f9f9f9;
border: 1px solid #ddd;
border-radius: 10px;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
</head>
<body>
<div class="container">
<h2>Benvindo(a) ao G_tour</h2>
<p>Olá sr(a). Luis,</p>
<p>Seja Bem-vindo(a) à nossa Plataforma.</p>
<p>Você criou uma conta dentro do nosso sistema, abaixo segue-se o link para ativação da conta.</p>
<p>Seu Código de Verificação é <strong>1234</strong></p>
<p><a href="#" style="text-decoration: none; color: #337ab7;">CLIQUE AQUI</a></p>
<p>Se você tiver alguma dúvida, entre em contato conosco! Estaremos sempre prontos para ajudá-lo.</p>
<p>Benvindo(a) ao G_tour</p>
</div>
</body>
</html>
 
*/