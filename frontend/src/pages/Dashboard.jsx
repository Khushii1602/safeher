import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AppLayout from "@/components/layout/AppLayout"
import { AlertTriangle, Building2, Users, Timer, MapPin, Lock, MessageSquare, Bot, ArrowRight, Shield, TrendingUp } from "lucide-react"

const features = [
  { icon: Building2,     label: "NGO Directory",   path: "/ngos",      color: "#f5f3ff", ic: "#6d28d9" },
  { icon: Users,         label: "Find a Mentor",   path: "/mentors",   color: "#eff6ff", ic: "#2563eb" },
  { icon: Timer,         label: "Safety Check-in", path: "/checkin",   color: "#f0fdf4", ic: "#059669" },
  { icon: MapPin,        label: "Nearby Help",     path: "/nearby",    color: "#fffbeb", ic: "#d97706" },
  { icon: Lock,          label: "Evidence Vault",  path: "/vault",     color: "#fdf4ff", ic: "#9333ea" },
  { icon: MessageSquare, label: "Community",       path: "/community", color: "#fff0f6", ic: "#db2777" },
  { icon: Bot,           label: "AI Assistant",    path: "/assistant", color: "#f5f3ff", ic: "#6d28d9" },
]

export default function Dashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const firstName = currentUser?.displayName?.split(" ")[0]
    || currentUser?.email?.split("@")[0]
    || "there"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 4 }}>{greeting}</p>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 6 }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            You are safe here. What would you like to do today?
          </p>
        </div>

        {/* SOS Banner */}
        <div
          onClick={() => navigate("/sos")}
          style={{
            background: "var(--black)", borderRadius: 20,
            padding: "24px 28px", marginBottom: 32,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", transition: "all 0.2s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#222"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--black)"}
          role="button" aria-label="Open SOS Emergency">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "#dc2626",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <AlertTriangle size={24} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <p style={{ color: "white", fontSize: 16, fontWeight: 700, marginBottom: 2 }}>
                SOS Emergency
              </p>
              <p style={{ color: "#9b9b9b", fontSize: 13 }}>
                Tap to alert your emergency contacts instantly
              </p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#9b9b9b", fontSize: 13 }}>
            Open <ArrowRight size={16} />
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 40 }}>
          {[
            { label: "NGOs Available",  value: "1,200+", color: "var(--purple)" },
            { label: "Trusted Mentors", value: "800+",   color: "#2563eb" },
            { label: "Community Posts", value: "Active", color: "var(--green)" },
            { label: "Response Time",   value: "< 1 min",color: "#d97706" },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.5px", color: s.color, marginBottom: 4 }}>
                {s.value}
              </p>
              <p style={{ fontSize: 12, color: "var(--text-3)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>
            Quick Access
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {features.map(f => {
              const Icon = f.icon
              return (
                <button
                  key={f.path}
                  onClick={() => navigate(f.path)}
                  className="card"
                  style={{
                    padding: "20px", textAlign: "left", border: "1px solid var(--border)",
                    borderRadius: 14, background: "var(--white)",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; e.currentTarget.style.borderColor = "var(--purple)" }}
                  onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--border)" }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: f.color, marginBottom: 14,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <Icon size={18} color={f.ic} strokeWidth={2} />
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>
                    {f.label}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--text-3)" }}>
                    Open <ArrowRight size={10} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Quote */}
        <div style={{
          background: "var(--purple-light)", borderRadius: 16,
          padding: "24px 28px",
          display: "flex", alignItems: "center", gap: 16
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: "var(--purple)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0
          }}>
            <Shield size={18} color="white" />
          </div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--purple)", marginBottom: 3 }}>
              Daily Reminder
            </p>
            <p style={{ fontSize: 14, color: "#5b21b6", fontStyle: "italic", lineHeight: 1.6 }}>
              "You are braver than you believe, stronger than you seem, and more loved than you know."
            </p>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}