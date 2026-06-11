import UserProfile from "../models/UserProfile.js"

export const getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ uid: req.params.uid })
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" })
    res.json({ success: true, data: profile })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

export const upsertProfile = async (req, res) => {
  try {
    const { uid } = req.body
    const fields = { ...req.body }
    const required = ["fullName", "city", "state", "gender"]
    const complete = required.every(f => fields[f] && fields[f] !== "")
    fields.profileComplete = complete
    const profile = await UserProfile.findOneAndUpdate(
      { uid },
      { ...fields, onboardingDone: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )
    res.json({ success: true, data: profile })
  } catch (e) { res.status(400).json({ success: false, message: e.message }) }
}