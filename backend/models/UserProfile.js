import mongoose from "mongoose"

const userProfileSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, trim: true },
    age: { type: Number, min: 0, max: 120 },
    gender: { type: String, enum: ["female","male","non-binary","prefer not to say",""] },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    occupation: { type: String, trim: true },
    phone: { type: String, trim: true },
    profileComplete: { type: Boolean, default: false },
    onboardingDone: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model("UserProfile", userProfileSchema)