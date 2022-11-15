import Job from "../models/jobModel.js"
import { StatusCodes } from "http-status-codes"

// * === === === === ===    CREATE JOB      === === === === === *
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

// * === === === === ===    GET ALL JOBS    === === === === === *
const getAllJobs = async (req, res) => {
  res.send("Create job")
}

// * === === === === ===    GET SINGLE JOB  === === === === === *
const getSingleJob = async (req, res) => {
  res.send(" single Job")
}

// * === === === === ===    UPDATE JOB      === === === === === *
const updateJob = async (req, res) => {
  res.send("Update job")
}

// * === === === === ===    DELETE JOB      === === === === === *
const deleteJob = async (req, res) => {
  res.send("Delete job")
}

// * === === === === ===    SHOW STATS      === === === === === *
const showStats = async (req, res) => {
  res.send("Show stats")
}

export { getAllJobs, getSingleJob, createJob, updateJob, deleteJob, showStats }
