import mongoose from "mongoose"

const mentorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true, // e.g. "Senior Advocate, Delhi High Court"
    },
    specialization: {
      type: String,
      required: true,
      enum: [
        "legal aid",
        "mental health",
        "career guidance",
        "financial independence",
        "domestic violence support",
        "digital safety",
        "entrepreneurship",
        "education",
      ],
    },
    bio: {
      type: String,
      required: true,
    },
    experience: {
      type: Number, // years of experience
      required: true,
    },
    languages: {
      type: [String], // e.g. ["Hindi", "English"]
      default: [],
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    totalSessions: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String, // initials like "PS" for Priya Sharma
      required: true,
    },
  },
  { timestamps: true }
)

mentorSchema.index({ name: "text", bio: "text", city: "text" })

const Mentor = mongoose.model("Mentor", mentorSchema)
export default Mentor