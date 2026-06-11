import mongoose from "mongoose"

const policeSchema = new mongoose.Schema(
  {
    state: { type: String, required: true, trim: true },
    unionTerritory: { type: Boolean, default: false },
    department: { type: String, required: true },
    emergencyNumber: { type: String, default: "100" },
    womenHelpline: { type: String, default: "1091" },
    cyberCrimePortal: { type: String },
    cyberCrimePhone: { type: String },
    officialWebsite: { type: String },
    officialEmail: { type: String },
    description: { type: String },
  },
  { timestamps: true }
)

export default mongoose.model("PoliceDirectory", policeSchema)