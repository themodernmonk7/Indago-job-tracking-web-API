import mongoose from "mongoose"
import validator from "validator"

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
    required: [true, "Please provide last name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
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

  Bio: {
    type: String,
    trim: true,
    maxlength: 50,
  },

  image: {
    type: String,
    default: "/uploads/example.jpg",
  },
})

export default mongoose.model("User", UserSchema)
