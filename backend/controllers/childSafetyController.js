import ChildSafety from "../models/ChildSafety.js"

export const getChildSafety = async (req, res) => {
  try {
    const { type, state } = req.query
    const filter = {}
    if (type && type !== "all") filter.type = type
    if (state && state !== "all") filter.state = { $regex: state, $options: "i" }
    const data = await ChildSafety.find(filter).sort({ isNational: -1, isVerified: -1 })
    res.json({ success: true, count: data.length, data })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

export const createChildSafety = async (req, res) => {
  try {
    const doc = await ChildSafety.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (e) { res.status(400).json({ success: false, message: e.message }) }
}