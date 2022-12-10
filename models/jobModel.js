import mongoose from "mongoose"

const JobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company name"],
      maxlength: 50,
    },

    position: {
      type: String,
      required: [true, "Please provide position"],
      maxlength: 100,
    },

    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },

    jobType: {
      type: String,
      enum: ["full-time", "part-time", "remote", "internship"],
      default: "full-time",
    },

    jobLocation: {
      type: String,
      default: "my city",
      required: true,
    },

    image: {
      type: String,
    },

    jobDescription: {
      type: String,
      maxlength: 100,
    },

    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
)

export default mongoose.model("Job", JobSchema)
