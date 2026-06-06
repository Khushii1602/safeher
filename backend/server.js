import "./config/env.js"

import postRoutes from "./routes/postRoutes.js"
import evidenceRoutes from "./routes/evidenceRoutes.js"
import express from "express"
import cors from "cors"
import helmet from "helmet"
import morgan from "morgan"
import connectDB from "./config/db.js"
import ngoRoutes from "./routes/ngoRoutes.js"
import emergencyContactRoutes from "./routes/emergencyContactRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import mentorRoutes from "./routes/mentorRoutes.js"


connectDB()
const app = express()

app.use(helmet())
app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    "https://safeher-flax.vercel.app",
    "https://safeher-r6kswa8bs-jkhushi16.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
}))
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(morgan("dev"))

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "SafeHer API is running 💜",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  })
})
app.use("/api/ngos", ngoRoutes)
app.use("/api/emergency-contacts", emergencyContactRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/mentors", mentorRoutes)
app.use("/api/evidence", evidenceRoutes)
app.use("/api/posts", postRoutes)


app.use((req, res) => {
  res.status(404).json({ success: false, message: `route ${req.originalUrl} not found` })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "something went wrong on our end 💜",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 SafeHer server running on port ${PORT}`)
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`)
})