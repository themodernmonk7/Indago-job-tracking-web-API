import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"

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
  console.log(req.user)
  const { email, name, lastName, location } = req.body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location

  await user.save()
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      token,
    },
  })
}

// * === === === === ===    UPLOAD PROFILE IMAGE      === === === === === *
const uploadProfileImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded")
  }
  const userAvatar = req.files.image
  if (!userAvatar.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image")
  }
  const maxSize = 1024 * 1024
  if (userAvatar.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB")
  }
  const result = await cloudinary.uploader.upload(userAvatar.tempFilePath, {
    use_filename: true,
    folder: "indago/users_avatar",
  })
  fs.unlinkSync(userAvatar.tempFilePath) // remove temp image files from server
  res.status(StatusCodes.OK).json({ src: result.secure_url })
}

export { register, login, updateUser, uploadProfileImage }
