import { UnauthenticatedError } from "../errors/index.js"
import jwt from "jsonwebtoken"
const auth = async (req, res, next) => {
  const token = req.signedCookies.token
  if (!token) {
    throw new UnauthenticatedError("Authentication Invalid")
  }

  try {
    // verify the token
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const testUser = payload.userId === "63738c715a5d304cb805c6ed"
    req.user = { userId: payload.userId, testUser }
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication Invalid")
  }
}

export default auth
