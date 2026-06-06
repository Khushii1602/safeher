import mongoose from "mongoose"

const evidenceSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    fileType: {
      type: String,
      required: true, // e.g. "image/jpeg"
    },
    fileSize: {
      type: Number,
      required: true,
    },
    fileData: {
      type: String,
      required: true, // Base64 encoded file
    },
  },
  { timestamps: true }
)

const Evidence = mongoose.model("Evidence", evidenceSchema)
export default Evidence