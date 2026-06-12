import MentorRequest from "../models/MentorRequest.js"

// POST /api/mentor-requests
// User sends a request to a mentor
export const createRequest = async (req, res) => {
  try {
    const request = await MentorRequest.create(req.body)
    res.status(201).json({ success: true, data: request })
  } catch (e) {
    res.status(400).json({ success: false, message: e.message })
  }
}

// GET /api/mentor-requests/user/:userId
// Get all requests sent by a user
export const getUserRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
    res.json({ success: true, data: requests })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// GET /api/mentor-requests/mentor/:mentorId
// Get all requests for a mentor (future admin use)
export const getMentorRequests = async (req, res) => {
  try {
    const requests = await MentorRequest.find({ mentorId: req.params.mentorId })
      .sort({ createdAt: -1 })
    res.json({ success: true, data: requests })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}

// PATCH /api/mentor-requests/:id/status
// Update request status (mark as read/responded)
export const updateStatus = async (req, res) => {
  try {
    const { status, response } = req.body
    const update = { status }
    if (response) { update.response = response; update.respondedAt = new Date() }

    const request = await MentorRequest.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    )
    if (!request) return res.status(404).json({ success: false, message: "Request not found" })
    res.json({ success: true, data: request })
  } catch (e) {
    res.status(500).json({ success: false, message: e.message })
  }
}