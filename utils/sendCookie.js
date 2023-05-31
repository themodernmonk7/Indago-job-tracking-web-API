const sendCookie = ({ res, token }) => {
  const oneDay = 1000 * 60 * 60 * 24
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    Domain: "indago-job.netlify.app",
    signed: true,
  })
}

export default sendCookie
