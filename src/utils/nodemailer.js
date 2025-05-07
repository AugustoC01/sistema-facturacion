import nodemailer from 'nodemailer'
import { mailer } from '../config.js'

const { SENDER, PASS } = mailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER,
    pass: PASS
  }
})

export const sendEmail = async (msg, receiver = null) => {
  const mailOptons = {
    from: SENDER,
    to: receiver || SENDER,
    subject: msg.subject,
    text: msg.text
  }

  try {
    await transporter.sendMail(mailOptons)
    // console.log(`Correo enviado por ${msg.subject}`)
  } catch (e) {
    // console.log(`Error al enviar el correo: ${error}`)
    console.log(e)
  }
}
