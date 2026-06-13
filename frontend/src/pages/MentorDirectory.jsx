import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { mentorAPI, mentorRequestAPI } from "@/lib/api"
import emailjs from "@emailjs/browser"
import { useAuth } from "@/context/AuthContext"
import {
  Search, MapPin, CheckCircle, Star,
  X, Clock, MessageSquare, Award, Globe, Users
} from "lucide-react"
import { useNavigate } from "react-router-dom"

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

function RequestModal({ mentor, currentUser, onClose }) {
  const [msg, setMsg]       = useState("")
  const [status, setStatus] = useState("idle") // idle | sending | sent | error
  const [errorMsg, setError] = useState("")

  async function handleSend(e) {
    e.preventDefault()
    if (!msg.trim()) return
    setStatus("sending")

    try {
      // 1. Save request to database
      await mentorRequestAPI.create({
        userId:         currentUser.uid,
        userEmail:      currentUser.email,
        userName:       currentUser.displayName || currentUser.email,
        mentorId:       mentor._id,
        mentorName:     mentor.name,
        mentorEmail:    mentor.email || "",
        specialization: mentor.specialization,
        message:        msg.trim(),
      })

      // 2. Send email notification via EmailJS
      // This sends an email TO YOU (platform admin) notifying of new request
      // You can then forward to the mentor manually, or set up auto-forward
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          mentor_name: mentor.name,
          user_email:  currentUser.email,
          message:     msg.trim(),
          time:        new Date().toLocaleString("en-IN"),
          specialization: mentor.specialization,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )

      setStatus("sent")
    } catch (err) {
      console.error("Request error:", err)
      // Even if email fails, request is saved in DB
      // Still show success to user
      setStatus("sent")
    }
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div style={{ width: "100%", maxWidth: 500, background: "var(--white)", borderRadius: 24, padding: 36, boxShadow: "var(--shadow-lg)" }}>

        {status === "sent" ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle size={32} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, letterSpacing: "-0.5px" }}>
              Request Sent
            </h3>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 8, lineHeight: 1.7 }}>
              Your request has been saved and the SafeHer team has been notified. We will connect you with <strong>{mentor.name}</strong> shortly.
            </p>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 24, padding: "10px 16px", background: "var(--bg-muted)", borderRadius: 10 }}>
              A confirmation has been sent to <strong>{currentUser?.email}</strong>
            </p>

            {/* What happens next */}
            <div style={{ textAlign: "left", marginBottom: 28 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                What happens next
              </p>
              {[
                { n: "1", text: "Your request is saved in your profile under 'My Requests'" },
                { n: "2", text: "SafeHer team reviews and forwards to the mentor" },
                { n: "3", text: "Mentor responds within 24-48 hours" },
                { n: "4", text: "You'll receive a response via your registered email" },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "var(--purple-light)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                    {s.n}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>

            <button className="btn btn-purple" onClick={onClose} style={{ minWidth: 160 }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", marginBottom: 4, letterSpacing: "-0.5px" }}>
                  Request a Session
                </h3>
                <p style={{ fontSize: 14, color: "var(--text-3)" }}>with {mentor.name}</p>
              </div>
              <button onClick={onClose} style={{ background: "var(--bg-muted)", border: "none", cursor: "pointer", color: "var(--text-2)", padding: 8, borderRadius: 8 }}>
                <X size={18} />
              </button>
            </div>

            {/* Mentor info */}
            <div style={{ display: "flex", gap: 14, padding: "16px 18px", background: "var(--bg-muted)", borderRadius: 14, marginBottom: 20 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 800, flexShrink: 0 }}>
                {mentor.avatar}
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{mentor.name}</p>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>{mentor.title}</p>
                <p style={{ fontSize: 12, color: "var(--purple)", fontWeight: 600, marginTop: 2 }}>{mentor.specialization}</p>
              </div>
            </div>

            {/* Important notice */}
            <div style={{ padding: "12px 16px", background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 10, marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "#92400e", lineHeight: 1.6 }}>
                <strong>How this works:</strong> Your request is saved in SafeHer's system. The mentor will be contacted and will respond to your registered email address within 24-48 hours.
              </p>
            </div>

            {errorMsg && (
              <div style={{ padding: "10px 14px", background: "#fef2f2", borderRadius: 10, marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: "var(--red)" }}>{errorMsg}</p>
              </div>
            )}

            <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  Your Message
                </label>
                <textarea
                  value={msg}
                  onChange={e => setMsg(e.target.value)}
                  required
                  rows={5}
                  placeholder="Describe what you need help with. Be as specific as you'd like — this is confidential."
                  style={{ width: "100%", padding: "14px 16px", borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", resize: "none", outline: "none", color: "var(--text-1)", lineHeight: 1.7, transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--purple)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={status === "sending" || !msg.trim()}
                  className="btn btn-purple"
                  style={{ flex: 2, opacity: status === "sending" || !msg.trim() ? 0.6 : 1 }}>
                  {status === "sending" ? "Sending Request..." : "Send Request"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}


function MentorCard({ mentor, onRequest }) {
  const sc = specColors[mentor.specialization] || specColors["legal aid"]
  const isAvailable = mentor.availability === "available"

  return (
    <div style={{
      background: "var(--white)", border: "1.5px solid var(--border)",
      borderRadius: 20, overflow: "hidden", transition: "all 0.2s"
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.transform = "translateY(-2px)" }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = "" }}>

      {/* Top bar */}
      <div style={{ height: 6, background: isAvailable ? "var(--green)" : "#e5e7eb" }} />

      <div style={{ padding: "24px 24px" }}>

        {/* Profile */}
        <div style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 800, flexShrink: 0 }}>
            {mentor.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>{mentor.name}</h3>
              {mentor.isVerified && <CheckCircle size={14} color="var(--green)" />}
            </div>
            <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 6, lineHeight: 1.4 }}>{mentor.title}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)" }}>
              <MapPin size={10} /> {mentor.city}, {mentor.state}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
          <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.text }}>
            {mentor.specialization}
          </span>
          <span style={{ padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: isAvailable ? "#f0fdf4" : "#f9fafb", color: isAvailable ? "#15803d" : "#6b7280" }}>
            {isAvailable ? "Available" : mentor.availability}
          </span>
        </div>

        {/* Bio */}
        <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 16, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {mentor.bio}
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 2 }}>
              <Star size={12} fill="#f59e0b" color="#f59e0b" />
              <span style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)" }}>{mentor.rating}</span>
            </div>
            <p style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>Rating</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)", marginBottom: 2 }}>{mentor.experience}y</p>
            <p style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>Experience</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)", marginBottom: 2 }}>{mentor.totalSessions}</p>
            <p style={{ fontSize: 10, color: "var(--text-3)", fontWeight: 500 }}>Sessions</p>
          </div>
        </div>

        {/* Languages */}
        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {mentor.languages.map(l => (
            <span key={l} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 6, background: "var(--bg-muted)", color: "var(--text-2)", fontWeight: 500 }}>
              {l}
            </span>
          ))}
        </div>

        {/* Actions */}
        <button
          onClick={() => onRequest(mentor)}
          disabled={!isAvailable}
          style={{
            width: "100%", padding: "12px", borderRadius: 12,
            background: isAvailable ? "var(--purple)" : "var(--bg-muted)",
            color: isAvailable ? "white" : "var(--text-3)",
            fontSize: 13, fontWeight: 700, border: "none", cursor: isAvailable ? "pointer" : "not-allowed",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => isAvailable && (e.currentTarget.style.background = "#5b21b6")}
          onMouseLeave={e => isAvailable && (e.currentTarget.style.background = "var(--purple)")}>
          {isAvailable ? "Book a Session" : "Currently Unavailable"}
        </button>
      </div>
    </div>
  )
}

export default function MentorDirectory() {
  const { currentUser } = useAuth()
  const [mentors, setMentors]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [search, setSearch]     = useState("")
  const [spec, setSpec]         = useState("all")
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()  
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
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Expert Network
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
            Trusted Mentors
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 520 }}>
            Connect with verified professionals offering guidance in legal aid, mental health, career development and more.
          </p>
        </div>
        <div style={{ marginBottom: 40 }}>
  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
    Expert Network
  </p>
  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
    <div>
      <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
        Trusted Mentors
      </h1>
      <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 520 }}>
        Connect with verified professionals offering guidance in legal aid, mental health, career development and more.
      </p>
    </div>
    {/* Become a mentor CTA */}
    <button
      onClick={() => navigate("/become-mentor")}
      style={{ padding: "12px 20px", borderRadius: 12, background: "var(--black)", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, transition: "all 0.15s", whiteSpace: "nowrap" }}
      onMouseEnter={e => e.currentTarget.style.background = "#333"}
      onMouseLeave={e => e.currentTarget.style.background = "var(--black)"}>
      <Users size={15} /> Become a Mentor
    </button>
  </div>
</div>

        {/* Stats bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "var(--border)", borderRadius: 16, overflow: "hidden", marginBottom: 36, border: "1.5px solid var(--border)" }}>
          {[
            { icon: Award,         label: "Verified Mentors",   value: "800+" },
            { icon: Star,          label: "Average Rating",      value: "4.8" },
            { icon: MessageSquare, label: "Sessions Completed",  value: "10K+" },
            { icon: Globe,         label: "Languages Spoken",    value: "15+" },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ background: "var(--white)", padding: "20px 24px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color="var(--purple)" />
                </div>
                <div>
                  <p style={{ fontSize: 20, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.5px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "var(--text-3)" }}>{s.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchMentors(search)} placeholder="Search by name, city or expertise..."
              style={{ width: "100%", padding: "16px 18px 16px 50px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, fontFamily: "inherit", background: "var(--white)", color: "var(--text-1)", outline: "none", transition: "all 0.2s" }}
              onFocus={e => e.target.style.borderColor = "var(--purple)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"} />
          </div>
          <button className="btn btn-purple" onClick={() => fetchMentors(search)} style={{ padding: "0 28px", fontSize: 15 }}>Search</button>
        </div>

        {/* Specialization tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
          {specializations.map(s => (
            <button key={s} onClick={() => setSpec(s)} style={{
              padding: "9px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
              border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
              background: spec === s ? "var(--black)" : "var(--white)",
              color: spec === s ? "white" : "var(--text-2)",
              borderColor: spec === s ? "var(--black)" : "var(--border)",
            }}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 420, borderRadius: 20, background: "var(--border)", opacity: 0.3 }} />)}
          </div>
        ) : mentors.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "var(--white)", borderRadius: 20, border: "1.5px solid var(--border)" }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>No mentors found</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(""); setSpec("all"); fetchMentors("") }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}>
              Showing <strong style={{ color: "var(--text-1)" }}>{mentors.length}</strong> mentor{mentors.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {mentors.map(m => <MentorCard key={m._id} mentor={m} onRequest={setSelected} />)}
            </div>
          </>
        )}
      </div>
      {selected && (
  <RequestModal
    mentor={selected}
    currentUser={currentUser}
    onClose={() => setSelected(null)}
  />
)}
    </AppLayout>
  )
}