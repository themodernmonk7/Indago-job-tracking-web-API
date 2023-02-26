import User from "../models/userModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../errors/index.js"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"
import crypto from "crypto"
import { sendVerificationEmail } from "../utils/index.js"
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
  const verificationToken = crypto.randomBytes(40).toString("hex")
  const user = await User.create({ ...req.body, verificationToken })
  // Send email
  // const origin = "http://localhost:5000/api/v1"
  const origin = "http://localhost:5173"
  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  })
  // Send verification token back only while testing in postman
  res.status(StatusCodes.CREATED).json({
    msg: "Please check your email to verify your account",
  })
}

// * === === === === === Verify User Account === === === === === *
const emailVerification = async (req, res) => {
  const { verificationToken, email } = req.body
  // Check if user exists or not in our database
  const user = await User.findOne({ email })
  if (!user) {
    throw new UnauthenticatedError(`Verification failed`)
  }
  // Check if verification token that is coming from frontend is match to our database verification token or not
  if (user.verificationToken !== verificationToken) {
    throw new UnauthenticatedError(`Verification failed. Token does not match`)
  }
  // If verification token is match then set
  user.isVerified = true
  user.verified = Date.now()
  user.verificationToken = ""
  await user.save()
  res.status(StatusCodes.OK).json({ msg: "Email verified successfully!" })
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

  // Check if user is verified or not
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your email")
  }

  const token = user.createJWT()
  user.password = undefined
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      bio: user.bio,
      image: user.image,
      token,
    },
  })
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
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      bio: user.bio,
      image: user.image,
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

export { register, login, updateUser, uploadProfileImage, emailVerification }
