// ngoController.js - Logic for all NGO-related API endpoints
import NGO from "../models/NGO.js"

// ── GET /api/ngos ──
// Returns all NGOs with optional search and filter
export const getNGOs = async (req, res) => {
  try {
    // req.query contains URL parameters e.g. ?search=legal&category=shelter
    const { search, category, city } = req.query

    // Start with an empty filter object
    // We'll add conditions to it based on what the user sends
    let filter = {}

    // If search term provided, use MongoDB text search
    if (search) {
      filter.$text = { $search: search }
    }

    // If category filter provided, add it to filter
    if (category && category !== "all") {
      filter.category = category
    }

    // If city filter provided, use case-insensitive regex
    if (city) {
      filter.city = { $regex: city, $options: "i" }
    }

    // Query the database with our filter
    // .sort({ isVerified: -1 }) puts verified NGOs first
    const ngos = await NGO.find(filter).sort({ isVerified: -1, rating: -1 })

    res.json({
      success: true,
      count: ngos.length,
      data: ngos,
    })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── GET /api/ngos/:id ──
// Returns a single NGO by its MongoDB ID
export const getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id)

    if (!ngo) {
      return res.status(404).json({
        success: false,
        message: "NGO not found",
      })
    }

    res.json({ success: true, data: ngo })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// ── POST /api/ngos ──
// Creates a new NGO (admin use)
export const createNGO = async (req, res) => {
  try {
    const ngo = await NGO.create(req.body)
    res.status(201).json({ success: true, data: ngo })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}