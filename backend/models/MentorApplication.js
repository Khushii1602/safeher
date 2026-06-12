import mongoose from "mongoose"

const mentorApplicationSchema = new mongoose.Schema(
  {
    // Personal info
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, required: true, trim: true, lowercase: true },
    phone:          { type: String, required: true, trim: true },
    city:           { type: String, required: true },
    state:          { type: String, required: true },
    gender:         { type: String, enum: ["female","male","non-binary","prefer not to say"] },

    // Professional info
    title:          { type: String, required: true },
    organization:   { type: String },
    specialization: {
      type: String, required: true,
      enum: ["legal aid","mental health","career guidance","financial independence","domestic violence support","digital safety","entrepreneurship","education"],
    },
    experience:     { type: Number, required: true },
    languages:      { type: [String], default: [] },
    bio:            { type: String, required: true },
    qualifications: { type: String },

    // Availability
    availability:   { type: String, enum: ["available","busy","unavailable"], default: "available" },
    hoursPerWeek:   { type: Number },

    // Verification
    linkedinUrl:    { type: String },
    websiteUrl:     { type: String },

    // Application status
    status: {
      type: String,
      enum: ["pending","under review","approved","rejected"],
      default: "pending"
    },
    adminNotes:     { type: String },
    reviewedAt:     { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model("MentorApplication", mentorApplicationSchema)