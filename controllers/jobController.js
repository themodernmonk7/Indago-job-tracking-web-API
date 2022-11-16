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
  const { search, status, jobType, sort } = req.query
  const queryObject = { createdBy: req.user.userId }

  if (search) {
    queryObject.position = { $regex: search, $options: "i" }
  }

  if (status && status !== "all") {
    queryObject.status = status
  }

  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType
  }
  let result = Job.find(queryObject)
  // chaining sort
  // const jobs = await Job.find({createdBy: req.user.userId}).sort('-createdAt').limit(10) //latest
  if (sort === "latest") result = result.sort("-createdAt")
  if (sort === "oldest") result = result.sort("createdAt")
  if (sort === "a-z") result = result.sort("position")
  if (sort === "z-a") result = result.sort("-position")

  // Setup pagination
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10
  const skip = (page - 1) * limit

  result = result.skip(skip).limit(limit)

  const jobs = await result

  const totalJobs = await Job.countDocuments(queryObject)
  const numOfPages = Math.ceil(totalJobs / limit)

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, jobs })
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

// const { search, status, jobType, sort } = req.query
// const queryObject = { createdBy: req.user.userId }

// if (search) {
//   queryObject.position = { $regex: search, $position: "i" }
// }

// if (status && status !== "all") {
//   queryObject.status = status
// }
// if (jobType && jobType !== "all") {
//   queryObject.jobType = jobType
// }

// let result = Job.find(queryObject)

// const jobs = await result