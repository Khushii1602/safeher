// EmergencyContact.js - Stores a user's trusted emergency contacts
import mongoose from "mongoose"

const emergencyContactSchema = new mongoose.Schema(
  {
    // Firebase UID links this contact to a specific user
    // We get this from the logged-in user on the frontend
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true, // speeds up lookups by userId
    },

    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
      enum: ["mother", "father", "sister", "brother", "friend", "partner", "other"],
    },
  },
  { timestamps: true }
)

const EmergencyContact = mongoose.model("EmergencyContact", emergencyContactSchema)
export default EmergencyContact