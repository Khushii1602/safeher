// seed.js - Fills MongoDB with sample NGO data
// Run with: node seed.js
// Only run this once (or it will duplicate data)

import dotenv from "dotenv"
import mongoose from "mongoose"
import NGO from "./models/NGO.js"

dotenv.config()

const sampleNGOs = [
  {
    name: "Sakhi Women's Aid Centre",
    description: "Providing comprehensive support to women facing domestic violence, including shelter, counselling, and legal assistance.",
    category: "domestic violence",
    city: "Delhi",
    state: "Delhi",
    phone: "011-26853846",
    email: "contact@sakhi.org",
    website: "https://sakhi.org",
    services: ["shelter", "counselling", "legal aid", "helpline"],
    isVerified: true,
    rating: 4.8,
  },
  {
    name: "iCall Mental Health",
    description: "Free and confidential mental health support, counselling and therapy for women and girls.",
    category: "mental health",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "9152987821",
    email: "icall@tiss.edu",
    website: "https://icallhelpline.org",
    services: ["therapy", "counselling", "online support", "crisis helpline"],
    isVerified: true,
    rating: 4.9,
  },
  {
    name: "Majlis Legal Centre",
    description: "Legal advocacy and representation for women and children in matters of domestic violence and human rights.",
    category: "legal aid",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "022-23771213",
    email: "majlis@vsnl.net",
    website: "https://majlislaw.com",
    services: ["legal aid", "court representation", "legal advice", "documentation"],
    isVerified: true,
    rating: 4.7,
  },
  {
    name: "Swayam Women's Organisation",
    description: "Empowering women through education, skill development, and advocacy against gender-based violence.",
    category: "education",
    city: "Kolkata",
    state: "West Bengal",
    phone: "033-24556073",
    email: "info@swayam.info",
    website: "https://swayam.info",
    services: ["education", "skill training", "legal aid", "counselling"],
    isVerified: true,
    rating: 4.6,
  },
  {
    name: "Snehi Emotional Support",
    description: "24/7 emotional support and crisis intervention helpline staffed by trained volunteers.",
    category: "mental health",
    city: "Delhi",
    state: "Delhi",
    phone: "044-24640050",
    email: "help@snehi.org",
    website: "https://snehi.org",
    services: ["crisis helpline", "emotional support", "suicide prevention"],
    isVerified: true,
    rating: 4.5,
  },
  {
    name: "Apne Aap Women Worldwide",
    description: "Grassroots organisation supporting self-empowerment of women and girls vulnerable to trafficking and prostitution.",
    category: "general support",
    city: "Delhi",
    state: "Delhi",
    phone: "011-46004470",
    email: "info@apneaap.org",
    website: "https://apneaap.org",
    services: ["empowerment", "education", "legal aid", "community support"],
    isVerified: true,
    rating: 4.7,
  },
  {
    name: "Prerana Anti Trafficking",
    description: "Working against commercial sexual exploitation and trafficking of women and children.",
    category: "child welfare",
    city: "Mumbai",
    state: "Maharashtra",
    phone: "022-22081026",
    email: "info@preranaantitrafficking.org",
    website: "https://preranaantitrafficking.org",
    services: ["rescue", "rehabilitation", "legal aid", "counselling"],
    isVerified: true,
    rating: 4.8,
  },
  {
    name: "Jagori Women's Resource Centre",
    description: "Feminist resource centre focused on safe cities, violence prevention and women's rights education.",
    category: "general support",
    city: "Delhi",
    state: "Delhi",
    phone: "011-26692700",
    email: "jagoridelhi@gmail.com",
    website: "https://jagori.org",
    services: ["education", "safe city campaigns", "counselling", "resources"],
    isVerified: false,
    rating: 4.4,
  },
]

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")

    // Delete all existing NGOs first to avoid duplicates
    await NGO.deleteMany({})
    console.log("🗑️  Cleared existing NGOs")

    // Insert all sample NGOs
    const created = await NGO.insertMany(sampleNGOs)
    console.log(`🌱 Seeded ${created.length} NGOs successfully!`)

    // Disconnect cleanly
    await mongoose.disconnect()
    console.log("✅ Done! You can now start the server.")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding failed:", error.message)
    process.exit(1)
  }
}

seedDatabase()