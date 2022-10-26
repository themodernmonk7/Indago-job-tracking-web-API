import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"

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
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({ email }).select("+password")
  if (!user) {
    throw new UnauthenticatedError(`User doesn't exist`)
  }
  // compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(`Invalid credentials`)
  }
  const token = user.createJWT()
  user.password = undefined
  res.status(StatusCodes.OK).json({
    user: { name: user.name, email: user.email, location: user.location },
    token,
  })
}
// * === === === === === UPDATE USER === === === === === *
const updateUser = async (req, res) => {
  res.send("Update user")
}

export { register, login, updateUser }
