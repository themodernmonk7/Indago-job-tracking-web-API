import dotenv from "dotenv"
dotenv.config()

import mockData from "./mock-data.json" assert { type: "json" }
import Job from "./models/jobModel.js"
import connectDB from "./database/connectDB.js"

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Job.create(mockData)
    console.log("success")
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

start()
