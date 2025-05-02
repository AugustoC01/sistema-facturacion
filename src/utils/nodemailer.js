import nodemailer from 'nodemailer'
import mailer from '../config.js'

const { DESTINY, PASS, SENDER } = mailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER,
    pass: PASS
  }
})

export const sendEmail = async (msg) => {
  const mailOptons = {
    from: SENDER,
    to: DESTINY,
    subject: msg.subject,
    text: msg.text
  }

  try {
    await transporter.sendMail(mailOptons)
    console.log(`Correo enviado por ${msg.subject}`)
  } catch (error) {
    console.log(`Error al enviar el correo: ${error}`)
  }
}
