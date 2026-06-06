import Evidence from "../models/Evidence.js"

// GET /api/evidence/:userId
export const getEvidence = async (req, res) => {
  try {
    // Return files WITHOUT the base64 data for the list view
    // We only send fileData when downloading a specific file
    const files = await Evidence.find(
      { userId: req.params.userId },
      { fileData: 0 } // exclude fileData from list
    ).sort({ createdAt: -1 })

    res.json({ success: true, data: files })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// GET /api/evidence/file/:id
export const getEvidenceFile = async (req, res) => {
  try {
    const file = await Evidence.findById(req.params.id)
    if (!file) {
      return res.status(404).json({ success: false, message: "file not found" })
    }
    res.json({ success: true, data: file })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/evidence
export const uploadEvidence = async (req, res) => {
  try {
    const { userId, name, description, fileType, fileSize, fileData } = req.body

    // 5MB limit
    if (fileSize > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "file too large — maximum 5MB 💜",
      })
    }

    // Max 20 files per user
    const count = await Evidence.countDocuments({ userId })
    if (count >= 20) {
      return res.status(400).json({
        success: false,
        message: "maximum 20 files allowed 💜",
      })
    }

    const evidence = await Evidence.create({
      userId, name, description, fileType, fileSize, fileData,
    })

    // Return without fileData
    const { fileData: _, ...rest } = evidence.toObject()
    res.status(201).json({ success: true, data: rest })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/evidence/:id
export const deleteEvidence = async (req, res) => {
  try {
    const file = await Evidence.findByIdAndDelete(req.params.id)
    if (!file) {
      return res.status(404).json({ success: false, message: "file not found" })
    }
    res.json({ success: true, message: "file deleted 💜" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}