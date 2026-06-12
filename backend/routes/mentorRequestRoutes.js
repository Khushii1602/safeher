import express from "express"
import {
  createRequest,
  getUserRequests,
  getMentorRequests,
  updateStatus
} from "../controllers/mentorRequestController.js"

const router = express.Router()

router.post("/",                        createRequest)
router.get("/user/:userId",             getUserRequests)
router.get("/mentor/:mentorId",         getMentorRequests)
router.patch("/:id/status",             updateStatus)

export default router