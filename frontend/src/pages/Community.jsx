import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { postAPI } from "@/lib/api"
import {
  Heart, MessageCircle, Trash2, Send,
  ChevronDown, ChevronUp, TrendingUp,
  Shield, BookOpen, Briefcase, Brain, Star, Plus, X
} from "lucide-react"

const categories = ["all","seeking support","sharing my story","legal question","safety tip","mental health","celebrating wins","general"]

const catConfig = {
  "seeking support":   { icon: Heart,      color: "#fef2f2", text: "#991b1b" },
  "sharing my story":  { icon: BookOpen,   color: "#f5f3ff", text: "#5b21b6" },
  "legal question":    { icon: Briefcase,  color: "#eff6ff", text: "#1e40af" },
  "safety tip":        { icon: Shield,     color: "#fefce8", text: "#713f12" },
  "mental health":     { icon: Brain,      color: "#fdf4ff", text: "#6b21a8" },
  "celebrating wins":  { icon: Star,       color: "#f0fdf4", text: "#14532d" },
  "general":           { icon: MessageCircle, color: "#f9fafb", text: "#374151" },
}

const resources = [
  { title: "iCall Helpline",        desc: "Free mental health support", number: "9152987821" },
  { title: "Women Helpline",        desc: "24/7 emergency assistance",  number: "1091" },
  { title: "Legal Aid Services",    desc: "Free legal consultation",    number: "15100" },
  { title: "Vandrevala Foundation", desc: "Mental health crisis line",  number: "1860-2662-345" },
]

function timeAgo(iso) {
  const d = Date.now() - new Date(iso).getTime()
  const m = Math.floor(d / 60000), h = Math.floor(m / 60), day = Math.floor(h / 24)
  if (m < 1) return "just now"
  if (m < 60) return `${m}m ago`
  if (h < 24) return `${h}h ago`
  return `${day}d ago`
}

function CommentSection({ postId, comments, userId }) {
  const [list, setList]  = useState(comments)
  const [text, setText]  = useState("")
  const [posting, setP]  = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!text.trim()) return
    setP(true)
    try {
      const r = await postAPI.comment(postId, { userId, content: text.trim() })
      setList(p => [...p, r.data]); setText("")
    } catch {}
    setP(false)
  }

  return (
    <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
      {list.map(c => (
        <div key={c._id} style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "var(--bg-muted)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "var(--text-2)", flexShrink: 0 }}>
            {c.anonName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ background: "var(--bg-muted)", borderRadius: "0 12px 12px 12px", padding: "10px 14px" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", marginBottom: 4 }}>{c.anonName}</p>
              <p style={{ fontSize: 13, color: "var(--text-1)", lineHeight: 1.6 }}>{c.content}</p>
            </div>
          </div>
        </div>
      ))}
      <form onSubmit={submit} style={{ display: "flex", gap: 10, marginTop: 12 }}>
        <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder="Write a supportive reply..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, fontFamily: "inherit", outline: "none", color: "var(--text-1)", transition: "border-color 0.2s" }}
          onFocus={e => e.target.style.borderColor = "var(--purple)"}
          onBlur={e => e.target.style.borderColor = "var(--border)"} />
        <button type="submit" disabled={posting || !text.trim()} style={{
          width: 38, height: 38, borderRadius: 10, border: "none",
          background: "var(--purple)", color: "white", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: posting || !text.trim() ? 0.5 : 1, flexShrink: 0
        }}>
          <Send size={15} />
        </button>
      </form>
    </div>
  )
}

function PostCard({ post, userId, onDelete }) {
  const cfg = catConfig[post.category] || catConfig["general"]
  const Icon = cfg.icon
  const [likes, setLikes]   = useState(post.likes?.length || 0)
  const [liked, setLiked]   = useState(post.likes?.includes(userId))
  const [showC, setShowC]   = useState(false)
  const isOwner = post.userId === userId

  async function like() {
    try { const r = await postAPI.like(post._id, userId); setLikes(r.likes); setLiked(r.liked) } catch {}
  }

  return (
    <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px 28px", transition: "all 0.2s" }}
    onMouseEnter={e => e.currentTarget.style.borderColor = "#d4d0c8"}
    onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--bg-muted)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "var(--text-2)", flexShrink: 0 }}>
            {post.anonName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{post.anonName}</p>
            <p style={{ fontSize: 11, color: "var(--text-3)" }}>{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: cfg.color, color: cfg.text }}>
            <Icon size={10} /> {post.category}
          </span>
          {isOwner && (
            <button onClick={() => onDelete(post._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4, borderRadius: 6, transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize: 14, color: "var(--text-1)", lineHeight: 1.8, marginBottom: 20 }}>{post.content}</p>

      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={like} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
          borderRadius: 8, border: "1.5px solid var(--border)",
          background: liked ? "#fef2f2" : "var(--white)",
          color: liked ? "#dc2626" : "var(--text-3)",
          fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
        }}>
          <Heart size={14} fill={liked ? "#dc2626" : "none"} color={liked ? "#dc2626" : "currentColor"} />
          {likes}
        </button>
        <button onClick={() => setShowC(!showC)} style={{
          display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
          borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--white)",
          color: "var(--text-3)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s"
        }}>
          <MessageCircle size={14} />
          {post.comments?.length || 0} {showC ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {showC && <CommentSection postId={post._id} comments={post.comments || []} userId={userId} />}
    </div>
  )
}

function NewPostModal({ userId, onPosted, onClose }) {
  const [content, setContent]   = useState("")
  const [category, setCategory] = useState("seeking support")
  const [posting, setPosting]   = useState(false)
  const left = 1000 - content.length

  async function submit(e) {
    e.preventDefault(); setPosting(true)
    try { await postAPI.create({ userId, content: content.trim(), category }); onPosted(); onClose() } catch {}
    setPosting(false)
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "var(--white)", borderRadius: 24, padding: 36, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.5px" }}>Create a Post</h3>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 4 }}>You are completely anonymous. No one can see who you are.</p>
          </div>
          <button onClick={onClose} style={{ background: "var(--bg-muted)", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "var(--text-2)" }}>
            <X size={18} />
          </button>
        </div>
        <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              Category
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {categories.filter(c => c !== "all").map(c => (
                <button key={c} type="button" onClick={() => setCategory(c)} style={{
                  padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                  background: category === c ? "var(--purple)" : "var(--white)",
                  color: category === c ? "white" : "var(--text-2)",
                  borderColor: category === c ? "var(--purple)" : "var(--border)",
                }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
              Your Message
            </label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows={5} maxLength={1000}
              placeholder="Share what's on your mind. This is a safe, judgment-free space."
              style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", color: "var(--text-1)", lineHeight: 1.7, transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "var(--purple)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"} />
            <p style={{ fontSize: 11, color: left < 50 ? "var(--red)" : "var(--text-3)", marginTop: 6, textAlign: "right" }}>
              {left} characters remaining
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" disabled={posting || !content.trim()} className="btn btn-purple" style={{ flex: 2, opacity: posting || !content.trim() ? 0.5 : 1 }}>
              {posting ? "Posting..." : "Post Anonymously"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function Community() {
  const { currentUser } = useAuth()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [error, setError]     = useState("")
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { fetchPosts() }, [category])

  async function fetchPosts() {
    setLoading(true); setError("")
    try {
      const p = {}; if (category !== "all") p.category = category
      const r = await postAPI.getAll(p); setPosts(r.data)
    } catch { setError("Could not load posts. Please try again.") }
    setLoading(false)
  }

  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return
    try { await postAPI.deletePost(id, currentUser.uid); setPosts(p => p.filter(p => p._id !== id)) } catch {}
  }

  return (
    <AppLayout>
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 260px", gap: 0, minHeight: "100vh" }}>

        {/* Left sidebar */}
        <div style={{ borderRight: "1px solid var(--border)", padding: "32px 20px", background: "var(--white)" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
            Categories
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {categories.map(c => {
              const cfg = catConfig[c]
              const Icon = cfg?.icon || MessageCircle
              return (
                <button key={c} onClick={() => setCategory(c)} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, border: "none",
                  background: category === c ? "var(--purple-light)" : "transparent",
                  color: category === c ? "var(--purple)" : "var(--text-2)",
                  fontSize: 13, fontWeight: category === c ? 700 : 500,
                  cursor: "pointer", transition: "all 0.15s", textAlign: "left"
                }}
                onMouseEnter={e => { if (category !== c) e.currentTarget.style.background = "var(--bg-muted)" }}
                onMouseLeave={e => { if (category !== c) e.currentTarget.style.background = "transparent" }}>
                  <Icon size={15} />
                  {c === "all" ? "All Posts" : c.charAt(0).toUpperCase() + c.slice(1)}
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)" }}>
            <button onClick={() => setShowModal(true)} style={{
              width: "100%", padding: "12px", borderRadius: 12,
              background: "var(--purple)", color: "white",
              fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.background = "#5b21b6"}
            onMouseLeave={e => e.currentTarget.style.background = "var(--purple)"}>
              <Plus size={15} /> New Post
            </button>
          </div>
        </div>

        {/* Center feed */}
        <div style={{ padding: "32px 32px", background: "var(--bg)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.5px", marginBottom: 2 }}>
                {category === "all" ? "Community Feed" : category.charAt(0).toUpperCase() + category.slice(1)}
              </h1>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>
                {posts.length} post{posts.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "12px 16px", borderRadius: 12, marginBottom: 20, fontSize: 14 }}>{error}</div>}

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[...Array(4)].map((_, i) => <div key={i} style={{ height: 160, borderRadius: 20, background: "var(--border)", opacity: 0.3 }} />)}
            </div>
          ) : posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "64px 0", background: "var(--white)", borderRadius: 20, border: "1.5px solid var(--border)" }}>
              <MessageCircle size={36} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
              <p style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>No posts yet</p>
              <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>Be the first to share something</p>
              <button className="btn btn-purple btn-sm" onClick={() => setShowModal(true)}>Create First Post</button>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {posts.map(p => <PostCard key={p._id} post={p} userId={currentUser?.uid} onDelete={handleDelete} />)}
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div style={{ borderLeft: "1px solid var(--border)", padding: "32px 20px", background: "var(--white)" }}>

          {/* Trending */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <TrendingUp size={15} color="var(--purple)" />
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Trending Topics
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Workplace safety", "Legal rights", "Mental health", "Digital safety", "Financial freedom"].map((t, i) => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--text-3)", width: 16 }}>#{i + 1}</span>
                  <span style={{ fontSize: 13, color: "var(--text-1)", fontWeight: 500 }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>
              Support Resources
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {resources.map(r => (
                <a key={r.number} href={`tel:${r.number}`} style={{ padding: "12px 14px", borderRadius: 12, background: "var(--bg-muted)", border: "1px solid var(--border)", textDecoration: "none", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.background = "var(--purple-light)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-muted)" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>{r.title}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)", marginBottom: 4 }}>{r.desc}</p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--purple)" }}>{r.number}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showModal && <NewPostModal userId={currentUser?.uid} onPosted={fetchPosts} onClose={() => setShowModal(false)} />}
    </AppLayout>
  )
}