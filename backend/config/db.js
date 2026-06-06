// db.js - Connects our Express server to MongoDB Atlas
// This runs once when the server starts
import "./env.js"  // ensures env is loaded
import mongoose from "mongoose"
// rest stays the same...

const connectDB = async () => {
  try {
    // mongoose.connect() opens the connection to MongoDB
    // process.env.MONGODB_URI reads the value from our .env file
    const conn = await mongoose.connect(process.env.MONGODB_URI)

    console.log(`✅ MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`)
    // Exit the process with failure if DB can't connect
    // No point running the server without a database
    process.exit(1)
  }
}

export default connectDB