import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
import sendCookie from "../utils/sendCookie.js"

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
  sendCookie({ res, token })
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
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
  sendCookie({ res, token })
  user.password = undefined
  res.status(StatusCodes.OK).json({
    user,
  })
}

// * === === === === === LOGOUT USER === === === === === *
const logout = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  })
  res.status(StatusCodes.OK).json({ msg: "Logout successful!" })
}

// * === === === === === UPDATE USER === === === === === *
const updateUser = async (req, res) => {
  const { email, name, lastName, location, bio, image } = req.body
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values")
  }
  const user = await User.findOne({ _id: req.user.userId })

  user.email = email
  user.name = name
  user.lastName = lastName
  user.location = location
  user.bio = bio
  user.image = image

  await user.save()
  const token = user.createJWT()
  sendCookie({ res, token })
  res.status(StatusCodes.OK).json({
    user,
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
  const maxSize = 1024 * 2048
  if (userAvatar.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 2MB")
  }
  const result = await cloudinary.uploader.upload(userAvatar.tempFilePath, {
    use_filename: true,
    folder: "indago/users_avatar",
  })
  // remove temporary image files from the server
  fs.unlinkSync(userAvatar.tempFilePath)
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}

export { register, login, logout, updateUser, uploadProfileImage }
