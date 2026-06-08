import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { postAPI } from "@/lib/api"
import { Heart, MessageCircle, Trash2, Send, ChevronDown, ChevronUp } from "lucide-react"

const categories = ["all","seeking support","sharing my story","legal question","safety tip","mental health","celebrating wins","general"]

const catColors = {
  "seeking support":   { bg:"#fef2f2", text:"#991b1b" },
  "sharing my story":  { bg:"#f5f3ff", text:"#5b21b6" },
  "legal question":    { bg:"#eff6ff", text:"#1e40af" },
  "safety tip":        { bg:"#fefce8", text:"#713f12" },
  "mental health":     { bg:"#fdf4ff", text:"#6b21a8" },
  "celebrating wins":  { bg:"#f0fdf4", text:"#14532d" },
  "general":           { bg:"#f9fafb", text:"#374151" },
}

function timeAgo(iso) {
  const d=Date.now()-new Date(iso).getTime(), m=Math.floor(d/60000), h=Math.floor(m/60), day=Math.floor(h/24)
  if(m<1) return "just now"
  if(m<60) return `${m}m ago`
  if(h<24) return `${h}h ago`
  return `${day}d ago`
}

function CommentSection({ postId, comments, userId }) {
  const [list, setList]   = useState(comments)
  const [text, setText]   = useState("")
  const [posting, setP]   = useState(false)

  async function submit(e) {
    e.preventDefault(); if(!text.trim()) return; setP(true)
    try { const r=await postAPI.comment(postId,{userId,content:text.trim()}); setList(p=>[...p,r.data]); setText("") } catch {}
    setP(false)
  }

  return (
    <div style={{ marginTop:16, paddingTop:16, borderTop:"1px solid var(--border)" }}>
      {list.map(c=>(
        <div key={c._id} style={{ display:"flex", gap:10, marginBottom:12 }}>
          <div style={{ width:28, height:28, borderRadius:"50%", background:"var(--bg-muted)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:700, color:"var(--text-2)", flexShrink:0 }}>
            {c.anonName?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex:1, background:"var(--bg-muted)", borderRadius:12, padding:"10px 14px" }}>
            <p style={{ fontSize:11, fontWeight:700, color:"var(--text-2)", marginBottom:4 }}>{c.anonName}</p>
            <p style={{ fontSize:13, color:"var(--text-1)", lineHeight:1.6 }}>{c.content}</p>
          </div>
        </div>
      ))}
      <form onSubmit={submit} style={{ display:"flex", gap:8 }}>
        <input type="text" value={text} onChange={e=>setText(e.target.value)} placeholder="Add a supportive comment..." className="input" style={{ fontSize:13 }}/>
        <button type="submit" disabled={posting||!text.trim()} className="btn btn-purple btn-sm" style={{ flexShrink:0 }}>
          <Send size={14}/>
        </button>
      </form>
    </div>
  )
}

function PostCard({ post, userId, onDelete }) {
  const c = catColors[post.category] || catColors["general"]
  const [likes, setLikes]     = useState(post.likes?.length||0)
  const [liked, setLiked]     = useState(post.likes?.includes(userId))
  const [showC, setShowC]     = useState(false)
  const isOwner = post.userId===userId

  async function like() {
    try { const r=await postAPI.like(post._id,userId); setLikes(r.likes); setLiked(r.liked) } catch {}
  }

  return (
    <div className="card" style={{ padding:24 }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12, marginBottom:14 }}>
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:"50%", background:"var(--bg-muted)", border:"1px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:800, color:"var(--text-2)", flexShrink:0 }}>
            {post.anonName?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize:13, fontWeight:700, color:"var(--text-1)" }}>{post.anonName}</p>
            <p style={{ fontSize:11, color:"var(--text-3)" }}>{timeAgo(post.createdAt)}</p>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ padding:"3px 10px", borderRadius:100, fontSize:11, fontWeight:600, background:c.bg, color:c.text }}>{post.category}</span>
          {isOwner && (
            <button onClick={()=>onDelete(post._id)} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", padding:4 }}
              onMouseEnter={e=>e.currentTarget.style.color="var(--red)"}
              onMouseLeave={e=>e.currentTarget.style.color="var(--text-3)"}>
              <Trash2 size={14}/>
            </button>
          )}
        </div>
      </div>

      <p style={{ fontSize:14, color:"var(--text-1)", lineHeight:1.7, marginBottom:16 }}>{post.content}</p>

      <div style={{ display:"flex", gap:16 }}>
        <button onClick={like} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color: liked ? "#dc2626" : "var(--text-3)", transition:"all 0.15s", padding:0 }}>
          <Heart size={16} fill={liked ? "#dc2626" : "none"} color={liked ? "#dc2626" : "currentColor"}/> {likes}
        </button>
        <button onClick={()=>setShowC(!showC)} style={{ display:"flex", alignItems:"center", gap:6, background:"none", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, color:"var(--text-3)", transition:"all 0.15s", padding:0 }}>
          <MessageCircle size={16}/> {post.comments?.length||0}
          {showC ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
        </button>
      </div>

      {showC && <CommentSection postId={post._id} comments={post.comments||[]} userId={userId}/>}
    </div>
  )
}

function NewPostForm({ userId, onPosted }) {
  const [content, setContent]   = useState("")
  const [category, setCategory] = useState("seeking support")
  const [posting, setPosting]   = useState(false)
  const [error, setError]       = useState("")
  const left = 1000-content.length

  async function submit(e) {
    e.preventDefault(); setPosting(true); setError("")
    try { await postAPI.create({userId,content:content.trim(),category}); setContent(""); onPosted() }
    catch(err) { setError(err.message) }
    setPosting(false)
  }

  return (
    <div className="card" style={{ padding:28, marginBottom:24 }}>
      <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", marginBottom:4 }}>Share with the Community</h2>
      <p style={{ fontSize:13, color:"var(--text-3)", marginBottom:20 }}>You are completely anonymous — no one can see who you are.</p>

      <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="input" style={{ fontSize:13 }}>
          {categories.filter(c=>c!=="all").map(c=><option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
        </select>
        <div>
          <textarea value={content} onChange={e=>setContent(e.target.value)} required rows={4} maxLength={1000} placeholder="Share what's on your mind — this is a safe, judgment-free space." className="input" style={{ resize:"none" }}/>
          <p style={{ fontSize:11, color: left<50 ? "var(--red)" : "var(--text-3)", marginTop:4, textAlign:"right" }}>{left} characters remaining</p>
        </div>
        {error && <p style={{ fontSize:13, color:"var(--red)", padding:"10px 14px", background:"#fef2f2", borderRadius:8 }}>{error}</p>}
        <button type="submit" disabled={posting||!content.trim()} className="btn btn-purple" style={{ alignSelf:"flex-start", opacity: posting||!content.trim() ? 0.5 : 1 }}>
          {posting ? "Posting..." : "Post Anonymously"}
        </button>
      </form>
    </div>
  )
}

export default function Community() {
  const { currentUser } = useAuth()
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState("all")
  const [error, setError]     = useState("")

  useEffect(()=>{ fetch() },[category])

  async function fetch() {
    setLoading(true); setError("")
    try { const p={}; if(category!=="all") p.category=category; const r=await postAPI.getAll(p); setPosts(r.data) }
    catch { setError("Could not load posts. Please try again.") }
    setLoading(false)
  }

  async function handleDelete(id) {
    if(!confirm("Delete this post?")) return
    try { await postAPI.deletePost(id,currentUser.uid); setPosts(p=>p.filter(p=>p._id!==id)) }
    catch { setError("Could not delete post.") }
  }

  return (
    <AppLayout>
      <div style={{ padding:"40px 48px", maxWidth:760, margin:"0 auto" }}>

        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-1px", marginBottom:6 }}>Community</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}>A safe, anonymous space to share, support and connect.</p>
        </div>

        <NewPostForm userId={currentUser?.uid} onPosted={fetch}/>

        <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:24 }}>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCategory(c)} style={{
              padding:"7px 16px", borderRadius:100, fontSize:12, fontWeight:600,
              border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
              background: category===c ? "var(--black)" : "var(--white)",
              color: category===c ? "white" : "var(--text-2)",
              borderColor: category===c ? "var(--black)" : "var(--border)",
            }}>
              {c.charAt(0).toUpperCase()+c.slice(1)}
            </button>
          ))}
        </div>

        {error && <div style={{ background:"#fef2f2", color:"#991b1b", padding:"12px 16px", borderRadius:12, marginBottom:20, fontSize:14 }}>{error}</div>}

        {loading ? (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ height:180, borderRadius:16, background:"var(--border)", opacity:0.4 }}/>)}
          </div>
        ) : posts.length===0 ? (
          <div style={{ textAlign:"center", padding:"64px 0", background:"var(--white)", borderRadius:20, border:"1px solid var(--border)" }}>
            <MessageCircle size={32} color="var(--text-3)" style={{ margin:"0 auto 12px" }}/>
            <p style={{ fontSize:15, fontWeight:600, color:"var(--text-1)", marginBottom:4 }}>No posts yet</p>
            <p style={{ fontSize:13, color:"var(--text-3)" }}>Be the first to share something with the community</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {posts.map(p=><PostCard key={p._id} post={p} userId={currentUser?.uid} onDelete={handleDelete}/>)}
          </div>
        )}

      </div>
    </AppLayout>
  )
}