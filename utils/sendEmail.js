import nodemailer from "nodemailer"
import nodemailerConfig from "./nodemailerConfig.js"

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount()

  const transporter = nodemailer.createTransport(nodemailerConfig)

  // send mail with defined transport object
  return transporter.sendMail({
    from: '"Indago" <indago@example.com>', // sender address // you can also use env for this
    to,
    subject,
    html,
  })
}

export default sendEmail
