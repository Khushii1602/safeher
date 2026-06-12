import MentorApplication from "../models/MentorApplication.js"
import Mentor from "../models/Mentor.js"

// POST /api/mentor-applications
export const applyAsMentor = async (req, res) => {
  try {
    // Check if already applied
    const existing = await MentorApplication.findOne({ email: req.body.email })
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "An application with this email already exists",
        status: existing.status
      })
    }

    const application = await MentorApplication.create(req.body)
    res.status(201).json({ success: true, data: application })
  } catch (e) {
    res.status(400).json({ success: false, message: e.message })
  }
}

// GET /api/mentor-applications
// Admin: get all applications
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query
    const filter = {}
    if (status && status !== "all") filter.status = status
    const applications = await MentorApplication.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: applications.length, data: applications })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// PATCH /api/mentor-applications/:id/review
// Admin: approve or reject
export const reviewApplication = async (req, res) => {
  try {
    const { status, adminNotes } = req.body
    const application = await MentorApplication.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, reviewedAt: new Date() },
      { new: true }
    )

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" })
    }

    // If approved, automatically add to Mentor collection
    if (status === "approved") {
      const existing = await Mentor.findOne({ email: application.email })
      if (!existing) {
        await Mentor.create({
          name:           application.fullName,
          avatar:         application.fullName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase(),
          title:          application.title,
          specialization: application.specialization,
          bio:            application.bio,
          experience:     application.experience,
          languages:      application.languages,
          city:           application.city,
          state:          application.state,
          phone:          application.phone,
          email:          application.email,
          availability:   application.availability,
          isVerified:     true,
          rating:         0,
          totalSessions:  0,
        })
      }
    }

    res.json({ success: true, data: application })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// GET /api/mentor-applications/check/:email
export const checkApplication = async (req, res) => {
  try {
    const application = await MentorApplication.findOne(
      { email: req.params.email },
      { status: 1, createdAt: 1, fullName: 1 }
    )
    res.json({ success: true, data: application || null })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}