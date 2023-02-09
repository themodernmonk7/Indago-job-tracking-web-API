import express from "express"
const router = express.Router()
import auth from "../middleware/authentication.js"
import {
  register,
  login,
  updateUser,
  uploadProfileImage,
  emailVerification,
} from "../controllers/authController.js"
import testUser from "../middleware/testUser.js"
import rateLimiter from "express-rate-limit"

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    msg: "To many  requests from this IP address, Please try again after 15 minutes.",
  },
})

router.route("/register").post(apiLimiter, register)
router.route("/email-verification").post(emailVerification)
router.route("/login").post(apiLimiter, login)
router.route("/updateUser").patch(auth, testUser, updateUser)
router.route("/uploadProfile").post(auth, testUser, uploadProfileImage)

export default router
