import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AppLayout from "@/components/layout/AppLayout"
import { emergencyAPI } from "@/lib/api"
import {
  AlertTriangle, Building2, Users, MapPin, Lock,
  MessageSquare, Bot, Shield, Activity, Clock,
  CheckCircle, Phone, Scale, Baby, BookOpen,
  PhoneCall, ArrowRight, TrendingUp, ChevronRight
} from "lucide-react"

const quickActions = [
  { icon: Building2,  label: "NGO Directory",   desc: "Find verified organizations",   path: "/ngos",          color: "#f5f3ff", ic: "#6d28d9" },
  { icon: Users,      label: "Mentors",          desc: "Connect with experts",          path: "/mentors",       color: "#eff6ff", ic: "#2563eb" },
  { icon: Scale,      label: "Legal Aid",        desc: "Free legal support",            path: "/legal-aid",     color: "#fefce8", ic: "#854d0e" },
  { icon: Baby,       label: "Child Safety",     desc: "Child protection resources",    path: "/child-safety",  color: "#fdf4ff", ic: "#7e22ce" },
  { icon: PhoneCall,  label: "Police Directory", desc: "State police contacts",         path: "/police",        color: "#f0fdf4", ic: "#15803d" },
  { icon: MapPin,     label: "Nearby Help",      desc: "Police, hospitals, NGOs",       path: "/nearby",        color: "#fffbeb", ic: "#d97706" },
  { icon: Lock,       label: "Evidence Vault",   desc: "Secure file storage",           path: "/vault",         color: "#fdf4ff", ic: "#9333ea" },
  { icon: MessageSquare, label: "Community",     desc: "Anonymous support forum",       path: "/community",     color: "#fff0f6", ic: "#db2777" },
  { icon: Bot,        label: "AI Assistant",     desc: "Chat with Sakhi 24/7",          path: "/assistant",     color: "#f0fdf4", ic: "#059669" },
  { icon: BookOpen,   label: "Resource Hub",     desc: "Guides and legal resources",    path: "/resources",     color: "#eff6ff", ic: "#1d4ed8" },
]

const helplines = [
  { label: "Women Helpline", number: "1091", color: "#fef2f2", tc: "#991b1b" },
  { label: "Police",         number: "100",  color: "#eff6ff", tc: "#1e40af" },
  { label: "Childline",      number: "1098", color: "#fdf4ff", tc: "#6b21a8" },
  { label: "Cyber Crime",    number: "1930", color: "#f5f3ff", tc: "#5b21b6" },
]

export default function Dashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [sosActive, setSosActive] = useState(false)

  useEffect(() => {
    if (currentUser?.uid) {
      emergencyAPI.getContacts(currentUser.uid).then(r => setContacts(r.data)).catch(() => {})
    }
  }, [currentUser])

  const firstName = currentUser?.displayName?.split(" ")[0]
    || currentUser?.email?.split("@")[0]
    || "there"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  const now = new Date().toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long"
  })

  return (
    <AppLayout>
      <div style={{ padding: "clamp(20px, 4vw, 48px)", maxWidth: 1100, margin: "0 auto" }}>

        {/* Welcome Header */}
        <div style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-3)", marginBottom: 6 }}>
            {greeting} · {now}
          </p>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 6 }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Your safety dashboard is ready. Everything you need is one tap away.
          </p>
        </div>

        {/* SOS Command Card */}
        <div style={{
          background: "var(--black)", borderRadius: 20,
          padding: "clamp(20px, 4vw, 32px)",
          marginBottom: "clamp(20px, 4vw, 32px)",
          position: "relative", overflow: "hidden"
        }}>
          <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "24px 24px" }} />

          <div style={{ position: "relative" }}>
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 0 3px rgba(34,197,94,0.2)" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#9b9b9b", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Emergency System Active
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>

              {/* Left info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <h2 style={{ fontSize: "clamp(18px, 3vw, 22px)", fontWeight: 900, color: "white", letterSpacing: "-0.5px", marginBottom: 16 }}>
                  SOS Emergency Center
                </h2>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  <div>
                    <p style={{ fontSize: 11, color: "#9b9b9b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Contacts</p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-1px" }}>
                      {contacts.length}<span style={{ fontSize: 13, color: "#9b9b9b", fontWeight: 400 }}>/5</span>
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#9b9b9b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Status</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircle size={16} color="#22c55e" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Ready</span>
                    </div>
                  </div>
                  <div>
                    <p style={{ fontSize: 11, color: "#9b9b9b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>AI Sakhi</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Activity size={14} color="#a78bfa" />
                      <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>Online</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SOS button */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => navigate("/sos")}
                  style={{
                    width: "clamp(80px, 15vw, 120px)",
                    height: "clamp(80px, 15vw, 120px)",
                    borderRadius: "50%",
                    background: "#dc2626", border: "4px solid rgba(220,38,38,0.3)",
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    gap: 6, cursor: "pointer", transition: "all 0.2s",
                    boxShadow: "0 0 32px rgba(220,38,38,0.3)"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.06)"; e.currentTarget.style.boxShadow = "0 0 48px rgba(220,38,38,0.5)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 0 32px rgba(220,38,38,0.3)" }}>
                  <AlertTriangle size={28} color="white" strokeWidth={2.5} />
                  <span style={{ fontSize: 12, fontWeight: 900, color: "white", letterSpacing: "0.08em" }}>SOS</span>
                </button>
                <p style={{ fontSize: 10, color: "#9b9b9b", textAlign: "center", maxWidth: 100 }}>Tap to alert contacts</p>
              </div>
            </div>

            {/* Bottom actions */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #222", display: "flex", gap: 10, flexWrap: "wrap" }}>
              {[
                { label: "Open SOS",        path: "/sos",       bg: "#dc2626",   icon: AlertTriangle },
                { label: "Safety Check-in", path: "/checkin",   bg: "#111",      icon: Clock },
                { label: "Ask Sakhi",       path: "/assistant", bg: "#111",      icon: Bot },
                { label: "Nearby Help",     path: "/nearby",    bg: "#111",      icon: MapPin },
              ].map(a => {
                const Icon = a.icon
                return (
                  <button key={a.path} onClick={() => navigate(a.path)} style={{
                    padding: "9px 16px", borderRadius: 10,
                    background: a.bg, color: "white",
                    fontSize: 12, fontWeight: 700, border: a.bg === "#111" ? "1px solid #333" : "none",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                    <Icon size={13} /> {a.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Quick Helplines */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: "clamp(20px, 4vw, 32px)" }}>
          {helplines.map(h => (
            <a key={h.number} href={`tel:${h.number}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 16px", borderRadius: 14,
              background: h.color, textDecoration: "none",
              border: "1px solid transparent", transition: "all 0.15s"
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={e => e.currentTarget.style.transform = ""}>
              <Phone size={15} color={h.tc} />
              <div>
                <p style={{ fontSize: 16, fontWeight: 900, color: h.tc, letterSpacing: "-0.5px", lineHeight: 1 }}>{h.number}</p>
                <p style={{ fontSize: 10, color: h.tc, opacity: 0.7, marginTop: 2 }}>{h.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* All Features Grid */}
        <div style={{ marginBottom: "clamp(20px, 4vw, 32px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <h2 style={{ fontSize: "clamp(16px, 2.5vw, 20px)", fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)", marginBottom: 2 }}>
                All Features
              </h2>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>Everything SafeHer offers you</p>
            </div>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
            gap: 12
          }}>
            {quickActions.map(a => {
              const Icon = a.icon
              return (
                <button key={a.path} onClick={() => navigate(a.path)}
                  style={{
                    padding: 18, borderRadius: 16,
                    border: "1.5px solid var(--border)",
                    background: "var(--white)", cursor: "pointer",
                    textAlign: "left", transition: "all 0.2s",
                    display: "flex", flexDirection: "column", gap: 10
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: a.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={20} color={a.ic} strokeWidth={2} />
                  </div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 3 }}>{a.label}</p>
                    <p style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.4 }}>{a.desc}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)" }}>
                    Open <ChevronRight size={11} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: "clamp(20px, 4vw, 32px)" }}>
          {[
            { label: "Verified NGOs",    value: "1,200+", icon: Building2,  color: "var(--purple)" },
            { label: "Active Mentors",   value: "800+",   icon: Users,      color: "#2563eb" },
            { label: "Legal Aid Orgs",   value: "50+",    icon: Scale,      color: "#854d0e" },
            { label: "States Covered",   value: "29",     icon: MapPin,     color: "#15803d" },
          ].map(s => {
            const Icon = s.icon
            return (
              <div key={s.label} style={{ padding: "18px 20px", borderRadius: 16, border: "1.5px solid var(--border)", background: "var(--white)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={s.color} />
                  </div>
                  <TrendingUp size={13} color="var(--green)" />
                </div>
                <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 3 }}>{s.value}</p>
                <p style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 500 }}>{s.label}</p>
              </div>
            )
          })}
        </div>

        {/* Daily quote */}
        <div style={{ padding: "20px 24px", borderRadius: 16, background: "var(--purple-light)", border: "1.5px solid #ddd6fe", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={16} color="white" />
          </div>
          <p style={{ fontSize: 14, color: "#5b21b6", fontStyle: "italic", lineHeight: 1.6 }}>
            "You are braver than you believe, stronger than you seem, and more loved than you know."
          </p>
        </div>

      </div>
    </AppLayout>
  )
}