import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import express from "express"
const app = express()
import { v2 as cloudinary } from "cloudinary"
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
})

// extra security packages
import helmet from "helmet"
import xss from "xss-clean"
import cors from "cors"
import fileUpload from "express-fileupload"

import connectDB from "./database/connectDB.js"
import authenticateUser from "./middleware/authentication.js"
// Routers
import authRouter from "./routes/authRoutes.js"
import jobRouter from "./routes/jobRoutes.js"
// Middleware
import errorHandlerMiddleware from "./middleware/error-handler.js"
import notFoundMiddleware from "./middleware/not-found.js"

app.use(express.json())
app.set("trust proxy", 1)
app.use(helmet())
app.use(cors())
app.use(xss())
app.use(fileUpload({ useTempFiles: true }))
app.use(express.static("./public"))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobRouter)

app.get("/", (req, res) => {
  res.send("<h1> Indago-job-tracking-website API </h2>")
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

// Create a server
const port = 5000 || process.env.PORT
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () =>
      console.log(`🚀 Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
