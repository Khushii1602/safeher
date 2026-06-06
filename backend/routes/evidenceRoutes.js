import express from "express"
import {
  getEvidence,
  getEvidenceFile,
  uploadEvidence,
  deleteEvidence,
} from "../controllers/evidenceController.js"

const router = express.Router()

router.get("/:userId",     getEvidence)
router.get("/file/:id",    getEvidenceFile)
router.post("/",           uploadEvidence)
router.delete("/:id",      deleteEvidence)

export default router