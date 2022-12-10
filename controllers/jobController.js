import Job from "../models/jobModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, NotFoundError } from "../errors/index.js"
import moment from "moment"
import mongoose from "mongoose"
import fs from "fs"
import { v2 as cloudinary } from "cloudinary"

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
  let stats = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } }, // getting userId as string, thats why ObjectId
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ])

  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr
    acc[title] = count
    return acc
  }, {})

  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  }

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ])

  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y")
      return { date, count }
    })
    .reverse()

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications })
}

// * === === === === ===    UPLOAD IMAGE      === === === === === *
const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded")
  }
  const companyImage = req.files.image
  if (!companyImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image")
  }
  const maxSize = 1024 * 1024
  if (companyImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller than 1MB")
  }
  const result = await cloudinary.uploader.upload(companyImage.tempFilePath, {
    use_filename: true,
    folder: "indago/company_logo_images",
  })
  fs.unlinkSync(companyImage.tempFilePath) // remove temp image files from server
  res.status(StatusCodes.OK).json({ image: { src: result.secure_url } })
}
export {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
  uploadImage,
}