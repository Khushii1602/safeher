import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Shield, LayoutDashboard, Building2, Users,
  AlertTriangle, Timer, MapPin, Lock,
  MessageSquare, Bot, LogOut, Scale,
  Baby, PhoneCall, BookOpen, User, ChevronDown, ChevronRight
} from "lucide-react"
import { useState } from "react"

const mainNav = [
  { icon: LayoutDashboard, label: "Dashboard",       path: "/dashboard" },
  { icon: AlertTriangle,   label: "SOS Emergency",   path: "/sos", accent: true },
  { icon: Timer,           label: "Safety Check-in", path: "/checkin" },
  { icon: Bot,             label: "AI Assistant",    path: "/assistant" },
  { icon: MapPin,          label: "Nearby Help",     path: "/nearby" },
]

const resourcesNav = [
  { icon: Building2,     label: "NGO Directory",    path: "/ngos" },
  { icon: Users,         label: "Mentors",           path: "/mentors" },
  { icon: Scale,         label: "Legal Aid",         path: "/legal-aid" },
  { icon: Baby,          label: "Child Safety",      path: "/child-safety" },
  { icon: PhoneCall,     label: "Police Directory",  path: "/police" },
  { icon: BookOpen,      label: "Resource Hub",      path: "/resources" },
]

const accountNav = [
  { icon: MessageSquare, label: "Community",         path: "/community" },
  { icon: Lock,          label: "Evidence Vault",    path: "/vault" },
  { icon: User,          label: "My Profile",        path: "/profile" },
]

function NavSection({ title, items }) {
  return (
    <div style={{ marginBottom: 8 }}>
      {title && (
        <p style={{ fontSize: 10, fontWeight: 800, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", padding: "8px 12px 6px", marginTop: 8 }}>
          {title}
        </p>
      )}
      {items.map(({ icon: Icon, label, path, accent }) => (
        <NavLink key={path} to={path} style={{ textDecoration: "none" }}>
          {({ isActive }) => (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 10, marginBottom: 1,
              background: isActive ? (accent ? "#fef2f2" : "var(--purple-light)") : "transparent",
              color: isActive ? (accent ? "var(--red)" : "var(--purple)") : "var(--text-2)",
              fontWeight: isActive ? 700 : 500, fontSize: 13.5,
              cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--bg-muted)" }}
            onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent" }}>
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </div>
          )}
        </NavLink>
      ))}
    </div>
  )
}

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const initials = (currentUser?.displayName || currentUser?.email || "U").slice(0, 2).toUpperCase()

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  return (
    <aside style={{ width: 240, minHeight: "100vh", background: "var(--white)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column" }}>

      {/* Logo */}
      <div style={{ height: 64, padding: "0 20px", display: "flex", alignItems: "center", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={15} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)" }}>
            Safe<span style={{ color: "var(--purple)" }}>Her</span>
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <NavSection items={mainNav} />
        <NavSection title="Resources" items={resourcesNav} />
        <NavSection title="Account" items={accountNav} />
      </nav>

      {/* User */}
      <div style={{ padding: 10, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", marginBottom: 4 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
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
        <button onClick={handleLogout} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "9px 12px", borderRadius: 10, border: "none", background: "none", fontSize: 13, fontWeight: 500, color: "var(--text-3)", cursor: "pointer", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  )
}