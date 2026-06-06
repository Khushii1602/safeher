// ngoRoutes.js - Maps URLs to controller functions for NGOs
import express from "express"
import { getNGOs, getNGOById, createNGO } from "../controllers/ngoController.js"

// express.Router() creates a mini-app that handles routes
const router = express.Router()

// GET /api/ngos        → getNGOs (list all / search)
// POST /api/ngos       → createNGO (add new NGO)
router.route("/").get(getNGOs).post(createNGO)

// GET /api/ngos/:id    → getNGOById (single NGO)
router.route("/:id").get(getNGOById)

export default router