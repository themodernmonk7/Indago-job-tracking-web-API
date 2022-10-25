import User from "../models/userModel.js"

// * === === === === === REGISTER USER === === === === === *
const register = async (req, res) => {
  res.send("Register user")
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
