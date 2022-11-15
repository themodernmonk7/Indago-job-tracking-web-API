import { UnauthenticatedError } from "../errors/index.js"
import jwt from "jsonwebtoken"
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization
  // console.log(authHeader)
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication Invalid")
  }

  // Get the token
  const token = authHeader.split(" ")[1]
  // console.log(token)

  try {
    // verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    console.log(payload)
    req.user = { userId: payload.userId, name: payload.name }
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}

export default auth
