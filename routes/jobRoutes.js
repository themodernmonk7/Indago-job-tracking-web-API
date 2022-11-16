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
import testUser from "../middleware/testUser.js"

router.route("/").post(testUser, createJob).get(getAllJobs)
router.route("/stats").get(showStats)
router
  .route("/:id")
  .get(getSingleJob)
  .patch(testUser, updateJob)
  .delete(testUser, deleteJob)

export default router
