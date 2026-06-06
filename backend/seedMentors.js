import dotenv from "dotenv"
import mongoose from "mongoose"
import Mentor from "./models/Mentor.js"
dotenv.config()

const mentors = [
  {
    name: "Priya Sharma",
    avatar: "PS",
    title: "Senior Advocate, Delhi High Court",
    specialization: "legal aid",
    bio: "15 years of experience helping women navigate legal challenges including domestic violence cases, divorce proceedings, and workplace harassment. I believe every woman deserves access to justice regardless of her financial situation.",
    experience: 15,
    languages: ["Hindi", "English", "Punjabi"],
    city: "Delhi",
    state: "Delhi",
    availability: "available",
    isVerified: true,
    rating: 4.9,
    totalSessions: 312,
  },
  {
    name: "Dr. Ananya Krishnan",
    avatar: "AK",
    title: "Clinical Psychologist & Trauma Specialist",
    specialization: "mental health",
    bio: "Specialising in trauma recovery, anxiety, and depression in women. I provide a safe, non-judgmental space to heal and grow. Trained in EMDR and CBT therapies with a focus on culturally sensitive care.",
    experience: 10,
    languages: ["Tamil", "English", "Telugu"],
    city: "Chennai",
    state: "Tamil Nadu",
    availability: "available",
    isVerified: true,
    rating: 4.8,
    totalSessions: 245,
  },
  {
    name: "Meera Iyer",
    avatar: "MI",
    title: "Founder & CEO, TechHer Startup",
    specialization: "entrepreneurship",
    bio: "Built a tech startup from scratch with zero funding. I mentor women in business ideation, fundraising, pitching, and building teams. Let me help you turn your idea into reality.",
    experience: 8,
    languages: ["Kannada", "English", "Hindi"],
    city: "Bangalore",
    state: "Karnataka",
    availability: "available",
    isVerified: true,
    rating: 4.7,
    totalSessions: 189,
  },
  {
    name: "Fatima Sheikh",
    avatar: "FS",
    title: "Cybersecurity Expert & Digital Safety Advocate",
    specialization: "digital safety",
    bio: "Helping women protect themselves online from stalking, harassment, doxxing, and cybercrime. I also work with survivors of revenge porn and digital abuse to take legal action.",
    experience: 7,
    languages: ["Urdu", "Hindi", "English"],
    city: "Hyderabad",
    state: "Telangana",
    availability: "available",
    isVerified: true,
    rating: 4.8,
    totalSessions: 156,
  },
  {
    name: "Sunita Rawat",
    avatar: "SR",
    title: "Career Coach & HR Professional",
    specialization: "career guidance",
    bio: "Former HR Director helping women re-enter the workforce, negotiate salaries, handle workplace discrimination, and build careers they love. Specialise in women returning after career breaks.",
    experience: 12,
    languages: ["Hindi", "English"],
    city: "Mumbai",
    state: "Maharashtra",
    availability: "available",
    isVerified: true,
    rating: 4.6,
    totalSessions: 278,
  },
  {
    name: "Rekha Nair",
    avatar: "RN",
    title: "Financial Planner & Independence Coach",
    specialization: "financial independence",
    bio: "Teaching women to take control of their finances — budgeting, investing, insurance, and building emergency funds. Financial independence is the foundation of all other freedoms.",
    experience: 9,
    languages: ["Malayalam", "English", "Hindi"],
    city: "Kochi",
    state: "Kerala",
    availability: "busy",
    isVerified: true,
    rating: 4.7,
    totalSessions: 203,
  },
  {
    name: "Dr. Kavita Menon",
    avatar: "KM",
    title: "Education Counsellor & Scholarship Expert",
    specialization: "education",
    bio: "Helping girls and women access higher education through scholarships, government schemes, and study planning. Specialise in first-generation college students from rural backgrounds.",
    experience: 11,
    languages: ["Hindi", "English", "Marathi"],
    city: "Pune",
    state: "Maharashtra",
    availability: "available",
    isVerified: false,
    rating: 4.5,
    totalSessions: 167,
  },
  {
    name: "Aruna Devi",
    avatar: "AD",
    title: "DV Survivor & Support Group Facilitator",
    specialization: "domestic violence support",
    bio: "A survivor who now helps others through their journey. I facilitate support groups, provide emotional support, and connect women with resources. You are not alone — I have been where you are.",
    experience: 6,
    languages: ["Hindi", "Bhojpuri", "English"],
    city: "Lucknow",
    state: "Uttar Pradesh",
    availability: "available",
    isVerified: true,
    rating: 4.9,
    totalSessions: 134,
  },
]

async function seedMentors() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("✅ Connected to MongoDB")
    await Mentor.deleteMany({})
    console.log("🗑️  Cleared existing mentors")
    const created = await Mentor.insertMany(mentors)
    console.log(`🌱 Seeded ${created.length} mentors!`)
    await mongoose.disconnect()
    console.log("✅ Done!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

seedMentors()