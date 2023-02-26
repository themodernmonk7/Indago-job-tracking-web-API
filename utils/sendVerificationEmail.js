import { sendEmail } from "../utils/index.js"

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  const verifyEmail = `${origin}/user/email-verification?token=${verificationToken}&email=${email}`

  return sendEmail({
    to: email,
    subject: "Activate your Indago Account",
    html: ` Hi ${name},
    Thank you for signing up for Indago. Click on the link below to verify your email:
    This link will expire in 24 hours. If you did not sign up for an Indago account, you can safely ignore this email.
    <a href="${verifyEmail}"> Activate account </a> 
    Best,
    The Indago Team
    `,
  })
}

export default sendVerificationEmail
