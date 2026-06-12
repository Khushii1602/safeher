import mongoose from "mongoose"

const mentorRequestSchema = new mongoose.Schema(
  {
    // Who sent the request
    userId:       { type: String, required: true },
    userEmail:    { type: String, required: true },
    userName:     { type: String, default: "Anonymous" },

    // Who they're requesting
    mentorId:     { type: String, required: true },
    mentorName:   { type: String, required: true },
    mentorEmail:  { type: String },
    specialization: { type: String },

    // The message
    message:      { type: String, required: true },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "read", "responded", "declined"],
      default: "pending"
    },

    // Mentor's response
    response:     { type: String },
    respondedAt:  { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model("MentorRequest", mentorRequestSchema)