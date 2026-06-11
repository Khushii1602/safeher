import express from "express"
import { getPolice, createPolice } from "../controllers/policeController.js"
const router = express.Router()
router.get("/", getPolice)
router.post("/", createPolice)
export default router