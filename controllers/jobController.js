import Job from "../models/jobModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors/index.js"

// * === === === === ===    CREATE JOB      === === === === === *
const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

// * === === === === ===    GET ALL JOBS    === === === === === *
const getAllJobs = async (req, res) => {
  const job = await Job.find({ createdBy: req.user.userId })
  res.status(StatusCodes.OK).json({ job, total_jobs: job.length })
}

// * === === === === ===    GET SINGLE JOB  === === === === === *
const getSingleJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findOne({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

// * === === === === ===    UPDATE JOB      === === === === === *
const updateJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const { company, position } = req.body
  if (company === "" || position === "") {
    throw new BadRequestError("Company or Position fields cannot be empty.")
  }
  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

// * === === === === ===    DELETE JOB      === === === === === *
const deleteJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req
  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId })
  if (!job) {
    throw new NotFoundError(`No job found with this id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

// * === === === === ===    SHOW STATS      === === === === === *
const showStats = async (req, res) => {
  res.send("Show stats")
}

export { getAllJobs, getSingleJob, createJob, updateJob, deleteJob, showStats }
