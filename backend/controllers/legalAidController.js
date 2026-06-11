import LegalAid from "../models/LegalAid.js"

export const getLegalAid = async (req, res) => {
  try {
    const { search, state, category } = req.query
    const filter = {}
    if (search) filter.$text = { $search: search }
    if (state && state !== "all") filter.state = { $regex: state, $options: "i" }
    if (category && category !== "all") filter.category = category
    const data = await LegalAid.find(filter).sort({ isVerified: -1 })
    res.json({ success: true, count: data.length, data })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

export const createLegalAid = async (req, res) => {
  try {
    const doc = await LegalAid.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (e) { res.status(400).json({ success: false, message: e.message }) }
}