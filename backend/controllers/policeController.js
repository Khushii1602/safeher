import PoliceDirectory from "../models/PoliceDirectory.js"

export const getPolice = async (req, res) => {
  try {
    const { search } = req.query
    const filter = {}
    if (search) filter.state = { $regex: search, $options: "i" }
    const data = await PoliceDirectory.find(filter).sort({ state: 1 })
    res.json({ success: true, count: data.length, data })
  } catch (e) { res.status(500).json({ success: false, message: e.message }) }
}

export const createPolice = async (req, res) => {
  try {
    const doc = await PoliceDirectory.create(req.body)
    res.status(201).json({ success: true, data: doc })
  } catch (e) { res.status(400).json({ success: false, message: e.message }) }
}