const nodemailer = require('nodemailer')
const fs = require('fs');
const path = require('path');
//const temp = require('../public/template.html')

const filePath = path.join(__dirname, '../public/template.html');
const template= fs.readFileSync(filePath, 'utf-8').toString();
//tutorial:  https://www.youtube.com/watch?v=8I-3_6vV-OA&ab_channel=LeiferMendez

  const createTrans = () => {
    //var transport = nodemailer.createTransport(config)
    var transport = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS
        }
      });

    return transport;
  }
  
  
const sendMail=async(usuario,token)=>{
    const transporter = createTrans()
    const info = await transporter.sendMail({
        from: 'pepei@hotmail.com',
        to: 'pepi@hotmail.com',
        subject: `Hola ${usuario.nombre}!!! 3TECH - Verificación de correo electrónico`,
        html: `${template} Verifique su cuenta accediendo a <a href="${process.env.BASE_URL}/passwordchange/${token}">este</a> enlace.`,
    })

    console.log("A verification email has been sent to ", usuario.nombre)
    return
}

exports.sendMail = (usuario,token) =>sendMail(usuario,token);