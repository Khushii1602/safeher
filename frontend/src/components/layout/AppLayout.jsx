import { useState } from "react"
import Sidebar from "./Sidebar"
import { Menu, X } from "lucide-react"

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>

      {/* Desktop sidebar */}
      <div className="desktop-sidebar">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40, backdropFilter: "blur(2px)" }}
        />
      )}

      {/* Mobile sidebar */}
      <div style={{
        position: "fixed", top: 0, left: 0, height: "100vh",
        zIndex: 50, transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
      }} className="mobile-sidebar">
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>

        {/* Mobile top bar */}
        <div className="mobile-topbar" style={{
          display: "none", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", height: 56, background: "var(--white)",
          borderBottom: "1px solid var(--border)", position: "sticky",
          top: 0, zIndex: 30, flexShrink: 0
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, color: "var(--text-1)", display: "flex", alignItems: "center" }}>
            <Menu size={22} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 7, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 13, color: "white" }}>🛡️</span>
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--text-1)" }}>
              Safe<span style={{ color: "var(--purple)" }}>Her</span>
            </span>
          </div>
          <div style={{ width: 38 }} />
        </div>

        <main style={{ flex: 1, overflowY: "auto" }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-topbar { display: flex !important; }
        }
        @media (min-width: 769px) {
          .mobile-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  )
}
