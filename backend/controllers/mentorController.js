import Mentor from "../models/Mentor.js"

// GET /api/mentors
export const getMentors = async (req, res) => {
  try {
    const { search, specialization, availability } = req.query
    let filter = {}

    if (search) filter.$text = { $search: search }
    if (specialization && specialization !== "all") {
      filter.specialization = specialization
    }
    if (availability && availability !== "all") {
      filter.availability = availability
    }

    const mentors = await Mentor.find(filter).sort({
      isVerified: -1,
      rating: -1,
    })

    res.json({ success: true, count: mentors.length, data: mentors })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/mentors/:id
export const getMentorById = async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id)
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" })
    }
    res.json({ success: true, data: mentor })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}