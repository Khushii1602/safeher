// emergencyContactController.js
import EmergencyContact from "../models/EmergencyContact.js"

// GET /api/emergency-contacts/:userId
// Returns all contacts for a specific user
export const getContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      userId: req.params.userId
    }).sort({ createdAt: 1 })

    res.json({ success: true, data: contacts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/emergency-contacts
// Adds a new emergency contact
export const addContact = async (req, res) => {
  try {
    const { userId, name, phone, relationship } = req.body

    // Limit to 5 contacts per user
    const existing = await EmergencyContact.countDocuments({ userId })
    if (existing >= 5) {
      return res.status(400).json({
        success: false,
        message: "maximum 5 emergency contacts allowed 💜",
      })
    }

    const contact = await EmergencyContact.create({
      userId, name, phone, relationship
    })

    res.status(201).json({ success: true, data: contact })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/emergency-contacts/:id
// Removes an emergency contact
export const deleteContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(req.params.id)

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "contact not found",
      })
    }

    res.json({ success: true, message: "contact removed" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}