import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import express from "express"
const app = express()
import connectDB from "./database/connectDB.js"

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
