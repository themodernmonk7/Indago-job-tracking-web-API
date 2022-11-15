import express from "express"
const router = express.Router()

import {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
  showStats,
} from "../controllers/jobController.js"

router.route("/").post(createJob).get(getAllJobs)
router.route("/stats").get(showStats)
router.route("/:id").get(getSingleJob).patch(updateJob).delete(deleteJob)

export default router
