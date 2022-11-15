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
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token,
    },
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
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token,
    },
  })
}
// * === === === === === UPDATE USER === === === === === *
const updateUser = async (req, res) => {
  // console.log(req.user)
  // res.json(req.user)
  // console.log(req.body)
  const { name, lastName, email, location, bio, images } = req.body
  if (!name || !lastName || !email || !location) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location
  user.bio = bio

  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user,
    token,
    location: user.location,
  })
}

export { register, login, updateUser }
