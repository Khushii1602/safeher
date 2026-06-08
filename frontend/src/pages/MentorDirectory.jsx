import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { mentorAPI } from "@/lib/api"
import { Search, MapPin, CheckCircle, Star, X } from "lucide-react"

const specializations = ["all","legal aid","mental health","career guidance","financial independence","domestic violence support","digital safety","entrepreneurship","education"]

const specColors = {
  "legal aid":                { bg: "#eff6ff", text: "#1d4ed8" },
  "mental health":            { bg: "#f5f3ff", text: "#6d28d9" },
  "career guidance":          { bg: "#f0fdf4", text: "#15803d" },
  "financial independence":   { bg: "#fffbeb", text: "#92400e" },
  "domestic violence support":{ bg: "#fef2f2", text: "#991b1b" },
  "digital safety":           { bg: "#fdf4ff", text: "#7e22ce" },
  "entrepreneurship":         { bg: "#fefce8", text: "#713f12" },
  "education":                { bg: "#f0f9ff", text: "#075985" },
}

const availColors = {
  available:   { bg: "#f0fdf4", text: "#15803d" },
  busy:        { bg: "#fffbeb", text: "#92400e" },
  unavailable: { bg: "#f9fafb", text: "#6b7280" },
}

function RequestModal({ mentor, onClose }) {
  const [msg, setMsg]   = useState("")
  const [sent, setSent] = useState(false)

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)"
    }}>
      <div className="card" style={{ width: "100%", maxWidth: 460, padding: 32 }}>
        {sent ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={28} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>Request Sent!</h3>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}>
              {mentor.name} will get back to you soon.
            </p>
            <button className="btn btn-purple" onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)" }}>
                Request help from {mentor.name}
              </h3>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4 }}>
                <X size={20} />
              </button>
            </div>
            <textarea
              value={msg} onChange={e => setMsg(e.target.value)} rows={5}
              placeholder="Share what you're going through. This is a safe space..."
              className="input" style={{ resize: "none", marginBottom: 16 }}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
              <button className="btn btn-purple" style={{ flex: 2 }} onClick={() => msg.trim() && setSent(true)}>
                Send Request
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function MentorCard({ mentor, onRequest }) {
  const sc = specColors[mentor.specialization] || specColors["legal aid"]
  const ac = availColors[mentor.availability]

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: "50%",
          background: "var(--purple)", color: "white",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 800, flexShrink: 0
        }}>
          {mentor.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", marginBottom: 2 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{mentor.name}</h3>
            {mentor.isVerified && <CheckCircle size={13} color="var(--green)" />}
          </div>
          <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 4 }}>{mentor.title}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)" }}>
            <MapPin size={10} /> {mentor.city}, {mentor.state}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: sc.bg, color: sc.text }}>
          {mentor.specialization}
        </span>
        <span style={{ padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: ac.bg, color: ac.text }}>
          {mentor.availability}
        </span>
      </div>

      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {mentor.bio}
      </p>

      <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--text-3)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Star size={12} fill="#f59e0b" color="#f59e0b" /> {mentor.rating}
        </span>
        <span>{mentor.experience} yrs exp</span>
        <span>{mentor.totalSessions} sessions</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {mentor.languages.map(l => (
          <span key={l} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "var(--bg-muted)", color: "var(--text-2)" }}>
            {l}
          </span>
        ))}
      </div>

      <button
        onClick={() => onRequest(mentor)}
        disabled={mentor.availability === "unavailable"}
        className="btn btn-purple"
        style={{ width: "100%", opacity: mentor.availability === "unavailable" ? 0.4 : 1 }}>
        {mentor.availability === "unavailable" ? "Currently Unavailable" : "Request Help"}
      </button>
    </div>
  )
}

export default function MentorDirectory() {
  const [mentors, setMentors]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [search, setSearch]     = useState("")
  const [spec, setSpec]         = useState("all")
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchMentors() }, [spec])

  async function fetchMentors(s = search) {
    setLoading(true); setError("")
    try {
      const p = {}
      if (s) p.search = s
      if (spec !== "all") p.specialization = spec
      const res = await mentorAPI.getAll(p)
      setMentors(res.data)
    } catch { setError("Could not load mentors. Please try again.") }
    setLoading(false)
  }

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 6 }}>
            Mentor Directory
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Connect with verified mentors who genuinely want to help you
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchMentors(search)} placeholder="Search by name, city or expertise..." className="input" style={{ paddingLeft: 42 }} />
          </div>
          <button className="btn btn-purple" onClick={() => fetchMentors(search)}>
            <Search size={15} /> Search
          </button>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {specializations.map(s => (
            <button key={s} onClick={() => setSpec(s)} style={{
              padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600,
              border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
              background: spec === s ? "var(--purple)" : "var(--white)",
              color: spec === s ? "white" : "var(--text-2)",
              borderColor: spec === s ? "var(--purple)" : "var(--border)",
            }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "12px 16px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 320, borderRadius: 16, background: "var(--border)", opacity: 0.4 }} />)}
          </div>
        ) : mentors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 6 }}>No mentors found</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(""); setSpec("all"); fetchMentors("") }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>Showing {mentors.length} mentor{mentors.length !== 1 ? "s" : ""}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {mentors.map(m => <MentorCard key={m._id} mentor={m} onRequest={setSelected} />)}
            </div>
          </>
        )}
      </div>
      {selected && <RequestModal mentor={selected} onClose={() => setSelected(null)} />}
    </AppLayout>
  )
}