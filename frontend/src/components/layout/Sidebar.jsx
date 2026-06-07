import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Shield, LayoutDashboard, Building2, Users,
  AlertTriangle, Timer, MapPin, Lock,
  MessageSquare, Bot, LogOut
} from "lucide-react"

const nav = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard" },
  { icon: Building2,       label: "NGO Directory",   path: "/ngos"      },
  { icon: Users,           label: "Mentors",          path: "/mentors"   },
  { icon: AlertTriangle,   label: "SOS Emergency",   path: "/sos",  accent: true },
  { icon: Timer,           label: "Safety Check-in", path: "/checkin"   },
  { icon: MapPin,          label: "Nearby Help",     path: "/nearby"    },
  { icon: Lock,            label: "Evidence Vault",  path: "/vault"     },
  { icon: MessageSquare,   label: "Community",       path: "/community" },
  { icon: Bot,             label: "AI Assistant",    path: "/assistant" },
]

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const initials = (currentUser?.displayName || currentUser?.email || "U")
    .slice(0, 2).toUpperCase()

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <aside style={{
      width: 240, minHeight: "100vh",
      background: "var(--white)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{
        height: 64, padding: "0 20px",
        display: "flex", alignItems: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--purple)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Shield size={15} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Safe<span style={{ color: "var(--purple)" }}>Her</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {nav.map(({ icon: Icon, label, path, accent }) => (
          <NavLink key={path} to={path} style={{ textDecoration: "none" }}>
            {({ isActive }) => (
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 12px", borderRadius: 10, marginBottom: 2,
                background: isActive
                  ? (accent ? "#fef2f2" : "var(--purple-light)")
                  : "transparent",
                color: isActive
                  ? (accent ? "var(--red)" : "var(--purple)")
                  : "var(--text-2)",
                fontWeight: isActive ? 600 : 500,
                fontSize: 13.5,
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-muted)" }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
                <Icon size={17} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 12px", marginBottom: 4
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: "var(--purple)", color: "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, flexShrink: 0
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.displayName || "My Account"}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.email}
            </p>
          </div>
        </div>
        <button onClick={handleLogout} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8,
          padding: "9px 12px", borderRadius: 10, border: "none",
          background: "none", fontSize: 13, fontWeight: 500,
          color: "var(--text-3)", cursor: "pointer", transition: "all 0.15s"
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
          <LogOut size={15} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}