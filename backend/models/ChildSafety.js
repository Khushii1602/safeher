import mongoose from "mongoose"

const childSafetySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String, required: true,
      enum: ["ngo","helpline","shelter","rehabilitation","rights organization","missing child","government"],
    },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    services: { type: [String], default: [] },
    phone: { type: String, trim: true },
    emergencyPhone: { type: String, trim: true },
    email: { type: String, trim: true },
    website: { type: String, trim: true },
    description: { type: String },
    isVerified: { type: Boolean, default: false },
    isNational: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.model("ChildSafety", childSafetySchema)