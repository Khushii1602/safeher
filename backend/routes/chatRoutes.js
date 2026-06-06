// chatRoutes.js
import express from "express"
import { chat } from "../controllers/chatController.js"

const router = express.Router()

// POST /api/chat → send a message to Sakhi (AI assistant)
router.post("/", chat)

export default router