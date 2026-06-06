import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { postAPI } from "@/lib/api"

const categories = [
  "all",
  "seeking support",
  "sharing my story",
  "legal question",
  "safety tip",
  "mental health",
  "celebrating wins",
  "general",
]

const categoryColors = {
  "seeking support":   { bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  "sharing my story":  { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  "legal question":    { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "safety tip":        { bg: "#fef9c3", text: "#854d0e", border: "#fef08a" },
  "mental health":     { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  "celebrating wins":  { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "general":           { bg: "#f9fafb", text: "#374151", border: "#e5e7eb" },
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days  = Math.floor(hours / 24)
  if (mins < 1)   return "just now"
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

// Comment section
function CommentSection({ postId, comments, currentUserId }) {
  const [list, setList]     = useState(comments)
  const [text, setText]     = useState("")
  const [posting, setPost]  = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setPost(true)
    try {
      const res = await postAPI.comment(postId, {
        userId: currentUserId,
        content: text.trim(),
      })
      setList((prev) => [...prev, res.data])
      setText("")
    } catch { /* silent */ }
    setPost(false)
  }

  return (
    <div className="mt-4 pt-4 border-t border-purple-50">
      {/* Comments list */}
      {list.length > 0 && (
        <div className="space-y-3 mb-4">
          {list.map((c) => (
            <div key={c._id} className="flex gap-2">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 mt-0.5"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                {c.anonName?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 bg-purple-50 rounded-xl px-3 py-2">
                <p className="text-xs font-medium text-purple-600 mb-0.5">
                  {c.anonName}
                </p>
                <p className="text-xs text-purple-700 leading-relaxed">
                  {c.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="add a supportive comment... 💜"
          className="flex-1 px-3 py-2 rounded-xl text-xs border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200 text-purple-800"
        />
        <button type="submit" disabled={posting || !text.trim()}
          className="px-3 py-2 rounded-xl text-xs font-medium text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          {posting ? "..." : "send"}
        </button>
      </form>
    </div>
  )
}

// Single post card
function PostCard({ post, currentUserId, onDelete }) {
  const colors   = categoryColors[post.category] || categoryColors["general"]
  const [likes, setLikes]       = useState(post.likes?.length || 0)
  const [liked, setLiked]       = useState(post.likes?.includes(currentUserId))
  const [showComments, setShowC] = useState(false)
  const isOwner = post.userId === currentUserId

  async function handleLike() {
    try {
      const res = await postAPI.like(post._id, currentUserId)
      setLikes(res.likes)
      setLiked(res.liked)
    } catch { /* silent */ }
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 hover:shadow-md transition-all">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            {post.anonName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-medium text-purple-700">{post.anonName}</p>
            <p className="text-xs text-purple-300">{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-full border"
            style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
            {post.category}
          </span>
          {isOwner && (
            <button onClick={() => onDelete(post._id)}
              className="text-xs text-pink-400 hover:text-pink-600 transition-colors">
              delete
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-sm text-purple-800 leading-relaxed mb-4">
        {post.content}
      </p>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button onClick={handleLike}
          className={`flex items-center gap-1.5 text-xs transition-all ${
            liked ? "text-pink-500" : "text-purple-400 hover:text-pink-400"
          }`}>
          <span>{liked ? "💜" : "🤍"}</span>
          <span>{likes} {likes === 1 ? "heart" : "hearts"}</span>
        </button>

        <button onClick={() => setShowC(!showComments)}
          className="flex items-center gap-1.5 text-xs text-purple-400 hover:text-purple-600 transition-all">
          <span>💬</span>
          <span>
            {post.comments?.length || 0}{" "}
            {(post.comments?.length || 0) === 1 ? "comment" : "comments"}
          </span>
        </button>
      </div>

      {/* Comments */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          currentUserId={currentUserId}
        />
      )}
    </div>
  )
}

// New post form
function NewPostForm({ currentUserId, onPosted }) {
  const [content, setContent]   = useState("")
  const [category, setCategory] = useState("seeking support")
  const [posting, setPosting]   = useState(false)
  const [error, setError]       = useState("")

  const remaining = 1000 - content.length

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setPosting(true)
    setError("")
    try {
      await postAPI.create({ userId: currentUserId, content: content.trim(), category })
      setContent("")
      setCategory("seeking support")
      onPosted()
    } catch (err) {
      setError(err.message)
    }
    setPosting(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-6">
      <h2 className="text-sm font-semibold text-purple-700 mb-1">
        share with the community 💜
      </h2>
      <p className="text-xs text-purple-400 mb-4">
        you are completely anonymous — no one can see who you are
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-purple-600 mb-1.5">
            category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 text-purple-800">
            {categories.filter((c) => c !== "all").map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-purple-600 mb-1.5">
            your message
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
            maxLength={1000}
            placeholder="share what's on your mind — this is a safe, judgment-free space 💜"
            className="w-full px-4 py-3 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none placeholder:text-purple-200 text-purple-800"
          />
          <p className={`text-xs mt-1 text-right ${remaining < 50 ? "text-pink-500" : "text-purple-300"}`}>
            {remaining} characters remaining
          </p>
        </div>

        {error && (
          <p className="text-xs text-pink-500 bg-pink-50 p-3 rounded-xl border border-pink-100">
            {error}
          </p>
        )}

        <button type="submit" disabled={posting || !content.trim()}
          className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          {posting ? "posting anonymously... 💜" : "post anonymously 💜"}
        </button>
      </form>
    </div>
  )
}

function Community() {
  const { currentUser } = useAuth()

  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [category, setCategory] = useState("all")
  const [error, setError]       = useState("")

  useEffect(() => { fetchPosts() }, [category])

  async function fetchPosts() {
    setLoading(true)
    setError("")
    try {
      const params = {}
      if (category !== "all") params.category = category
      const res = await postAPI.getAll(params)
      setPosts(res.data)
    } catch {
      setError("couldn't load posts 💜 please try again")
    }
    setLoading(false)
  }

  async function handleDelete(postId) {
    if (!confirm("delete this post?")) return
    try {
      await postAPI.deletePost(postId, currentUser.uid)
      setPosts((prev) => prev.filter((p) => p._id !== postId))
    } catch {
      setError("couldn't delete post 💜")
    }
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            community 💬
          </h1>
          <p className="text-purple-400 text-sm">
            a safe, anonymous space to share, support and connect 💜
          </p>
        </div>

        {/* New post form */}
        <NewPostForm
          currentUserId={currentUser?.uid}
          onPosted={fetchPosts}
        />

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === cat
                  ? "text-white border-transparent"
                  : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
              }`}
              style={category === cat
                ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                : {}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-pink-50 text-pink-600 text-sm p-4 rounded-xl mb-6 border border-pink-100">
            {error}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100 p-5 animate-pulse">
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-purple-100" />
                  <div className="flex-1">
                    <div className="h-3 bg-purple-100 rounded w-1/4 mb-2" />
                    <div className="h-3 bg-purple-50 rounded w-1/6" />
                  </div>
                </div>
                <div className="h-16 bg-purple-50 rounded mb-3" />
                <div className="h-6 bg-purple-50 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-purple-100">
            <p className="text-4xl mb-3">💜</p>
            <p className="text-sm font-medium text-purple-600 mb-1">
              no posts yet
            </p>
            <p className="text-xs text-purple-400">
              be the first to share something with the community
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                currentUserId={currentUser?.uid}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

      </div>
    </AppLayout>
  )
}

export default Community