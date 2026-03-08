import nodemailer from 'nodemailer'
import { mailer } from '../config.js'
import logger from './logger.js'

const { SENDER, PASS } = mailer

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER,
    pass: PASS
  }
})

export const sendEmail = async (msg, receiver = null) => {
  const mailOptions = {
    from: SENDER,
    to: receiver || SENDER,
    subject: msg.subject,
    text: msg.text
  }

  try {
    await transporter.sendMail(mailOptions)
    logger.info({ subject: msg.subject }, 'Email sent successfully')
  } catch (e) {
    logger.error(e, 'Error sending email with subject "%s"', msg.subject)
  }
}
