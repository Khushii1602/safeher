import express from "express"
import { getProfile, upsertProfile } from "../controllers/userProfileController.js"
const router = express.Router()
router.get("/:uid", getProfile)
router.post("/", upsertProfile)
export default router