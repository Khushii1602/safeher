import express from "express"
import { getChildSafety, createChildSafety } from "../controllers/childSafetyController.js"
const router = express.Router()
router.get("/", getChildSafety)
router.post("/", createChildSafety)
export default router