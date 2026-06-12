import express from "express"
import {
  applyAsMentor,
  getAllApplications,
  reviewApplication,
  checkApplication
} from "../controllers/mentorApplicationController.js"

const router = express.Router()

router.post("/",              applyAsMentor)
router.get("/",               getAllApplications)
router.get("/check/:email",   checkApplication)
router.patch("/:id/review",   reviewApplication)

export default router