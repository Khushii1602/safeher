// emergencyContactRoutes.js
import express from "express"
import {
  getContacts,
  addContact,
  deleteContact,
} from "../controllers/emergencyContactController.js"

const router = express.Router()

// GET  /api/emergency-contacts/:userId  → get all contacts for user
// POST /api/emergency-contacts          → add new contact
router.get("/:userId", getContacts)
router.post("/", addContact)

// DELETE /api/emergency-contacts/:id   → remove a contact
router.delete("/:id", deleteContact)

export default router