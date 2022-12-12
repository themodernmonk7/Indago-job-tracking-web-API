import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },

  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: "last name",
  },

  email: {
    type: String,
    required: [true, "Please provide email address"],
    validate: {
      validator: validator.isEmail,
      message: "Please provide valid email address",
    },
    unique: true,
  },

  password: {
    type: String,
    required: [true, "Please provide password "],
    minlength: 6,
    select: false,
  },

  location: {
    type: String,
    trim: true,
    maxlength: 20,
    default: "My City",
  },

  bio: {
    type: String,
    trim: true,
    maxlength: 50,
  },

  image: {
    type: String,
    default: "uploads/userImage.jpeg",
  },
})

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.name },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_LIFETIME }
  )
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model("User", UserSchema)
