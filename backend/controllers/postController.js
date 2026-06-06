import Post from "../models/Post.js"

// Random anonymous names for posting
const anonAdjectives = [
  "brave", "resilient", "gentle", "strong", "hopeful",
  "radiant", "quiet", "fierce", "tender", "bold",
]
const anonNouns = [
  "lotus", "moon", "star", "rose", "river",
  "flame", "dawn", "cloud", "bird", "pearl",
]

function generateAnonName() {
  const adj  = anonAdjectives[Math.floor(Math.random() * anonAdjectives.length)]
  const noun = anonNouns[Math.floor(Math.random() * anonNouns.length)]
  const num  = Math.floor(Math.random() * 999)
  return `${adj}-${noun}-${num}`
}

// GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isModerated: false }
    if (category && category !== "all") filter.category = category

    const posts = await Post.find(filter)
      .select("-userId -comments.userId") // never expose userIds
      .sort({ createdAt: -1 })
      .limit(50)

    res.json({ success: true, count: posts.length, data: posts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { userId, content, category } = req.body

    const post = await Post.create({
      userId,
      anonName: generateAnonName(),
      content,
      category,
    })

    // Return without userId
    const { userId: _, ...safePost } = post.toObject()
    res.status(201).json({ success: true, data: safePost })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// POST /api/posts/:id/like
export const toggleLike = async (req, res) => {
  try {
    const { userId } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ success: false, message: "post not found" })
    }

    const alreadyLiked = post.likes.includes(userId)

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id !== userId)
    } else {
      post.likes.push(userId)
    }

    await post.save()
    res.json({ success: true, likes: post.likes.length, liked: !alreadyLiked })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/posts/:id/comments
export const addComment = async (req, res) => {
  try {
    const { userId, content } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ success: false, message: "post not found" })
    }

    const comment = {
      anonName: generateAnonName(),
      content,
      userId,
    }

    post.comments.push(comment)
    await post.save()

    // Return comment without userId
    const saved = post.comments[post.comments.length - 1]
    res.status(201).json({
      success: true,
      data: {
        _id:       saved._id,
        anonName:  saved.anonName,
        content:   saved.content,
        createdAt: saved.createdAt,
      },
    })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
}

// DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const { userId } = req.body
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({ success: false, message: "post not found" })
    }

    // Only the author can delete their post
    if (post.userId !== userId) {
      return res.status(403).json({ success: false, message: "not authorised" })
    }

    await post.deleteOne()
    res.json({ success: true, message: "post deleted" })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
}