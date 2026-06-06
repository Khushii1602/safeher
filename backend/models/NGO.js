// NGO.js - Defines what an NGO document looks like in MongoDB
// Every NGO stored in our database will follow this structure

import mongoose from "mongoose"

const ngoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "NGO name is required"],
      trim: true, // removes extra whitespace
    },

    description: {
      type: String,
      required: [true, "Description is required"],
    },

    category: {
      type: String,
      required: true,
      // enum means only these exact values are allowed
      enum: [
        "legal aid",
        "mental health",
        "shelter",
        "education",
        "employment",
        "child welfare",
        "domestic violence",
        "general support",
      ],
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      trim: true,
    },

    services: {
      // Array of strings e.g. ["counselling", "legal advice", "shelter"]
      type: [String],
      default: [],
    },

    isVerified: {
      // Whether our team has verified this NGO is legitimate
      type: Boolean,
      default: false,
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    // timestamps: true automatically adds createdAt and updatedAt fields
    timestamps: true,
  }
)

// Create a text index for search functionality
// This allows MongoDB to search across name, description, city fields
ngoSchema.index({ name: "text", description: "text", city: "text" })

const NGO = mongoose.model("NGO", ngoSchema)

export default NGO