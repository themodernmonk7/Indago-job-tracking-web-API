import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import express from "express"
const app = express()
import connectDB from "./database/connectDB.js"

// Routers
import authRouter from "./routes/authRoutes.js"

app.use(express.json())

app.use("/api/v1/auth", authRouter)

app.get("/", (req, res) => {
  res.send("<h1> Indago-job-tracking-website API </h2>")
})

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
