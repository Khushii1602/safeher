import express from "express"
import { getLegalAid, createLegalAid } from "../controllers/legalAidController.js"
const router = express.Router()
router.get("/", getLegalAid)
router.post("/", createLegalAid)
export default router