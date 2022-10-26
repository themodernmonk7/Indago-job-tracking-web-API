import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError } from "../errors/index.js"

// * === === === === === REGISTER USER === === === === === *
const register = async (req, res) => {
  const { name, email, password } = req.body
  // Extra validation
  if (!name || !email || !password) {
    throw new BadRequestError("Please provide all values")
  }
  // If email is already in use or not
  const isUserAlreadyExist = await User.findOne({ email })
  if (isUserAlreadyExist) {
    throw new BadRequestError("Email already in use")
  }
  const user = await User.create({ ...req.body })
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
      location: user.location,
    },
    token,
  })
}
// * === === === === === LOGIN USER === === === === === *
const login = async (req, res) => {
  res.send("Login user")
}
// * === === === === === UPDATE USER === === === === === *
const updateUser = async (req, res) => {
  res.send("Update user")
}

export { register, login, updateUser }
