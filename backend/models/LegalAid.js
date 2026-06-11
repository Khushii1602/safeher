import mongoose from "mongoose"

const legalAidSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    category: {
      type: String, required: true,
      enum: ["domestic violence","sexual harassment","child protection","cyber crime","property rights","family law","workplace harassment","general"],
    },
    services: { type: [String], default: [] },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
    operatingHours: { type: String, default: "Mon-Sat 9AM-6PM" },
    eligibility: { type: String, default: "Open to all women and children" },
    isVerified: { type: Boolean, default: false },
    isFree: { type: Boolean, default: true },
  },
  { timestamps: true }
)

legalAidSchema.index({ name: "text", city: "text", state: "text" })
export default mongoose.model("LegalAid", legalAidSchema)