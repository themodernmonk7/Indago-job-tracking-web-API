import express from "express"
const router = express.Router()
import auth from "../middleware/authentication.js"
import { register, login, updateUser } from "../controllers/authController.js"
import testUser from "../middleware/testUser.js"

router.route("/register").post(register)
router.route("/login").post(login)
router.route("/updateUser").patch(auth, testUser, updateUser)

export default router
