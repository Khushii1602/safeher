import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Shield, Menu, X, ArrowRight } from "lucide-react"

export default function Navbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: "rgba(255,255,255,0.92)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        padding: "0 48px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        {/* Logo */}
        <button onClick={() => navigate("/")} style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "none", border: "none", cursor: "pointer"
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--purple)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <Shield size={16} color="white" strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.5px", color: "var(--black)" }}>
            Safe<span style={{ color: "var(--purple)" }}>Her</span>
          </span>
        </button>

        {/* Desktop links */}
        <nav style={{ display: "flex", gap: 36 }} className="nav-desktop">
          {["Features", "Our Impact", "Community", "About"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(" ", "")}`} style={{
              fontSize: 14, fontWeight: 500,
              color: "var(--text-2)", textDecoration: "none",
              transition: "color 0.2s"
            }}
            onMouseEnter={e => e.target.style.color = "var(--black)"}
            onMouseLeave={e => e.target.style.color = "var(--text-2)"}>
              {l}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {currentUser ? (
            <button className="btn btn-dark" onClick={() => navigate("/dashboard")}>
              Dashboard <ArrowRight size={14} />
            </button>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => navigate("/login")}>
                Sign In
              </button>
              <button className="btn btn-dark btn-sm" onClick={() => navigate("/login")}>
                Get Started
              </button>
            </>
          )}
        <button
            onClick={() => setOpen(!open)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, borderRadius: 8, display: "flex", alignItems: "center" }}
             className="nav-mobile-btn"
             aria-label="Menu">
               {open ? <X size={20} /> : <Menu size={20} />}
        </button>
          
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          borderTop: "1px solid var(--border)",
          background: "var(--white)",
          padding: "20px 24px",
        }} className="anim-fade-in">
          {["Features", "Our Impact", "Community", "About"].map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{
              display: "block", padding: "10px 0",
              fontSize: 15, color: "var(--text-2)",
              textDecoration: "none", borderBottom: "1px solid var(--border)"
            }}>{l}</a>
          ))}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>Sign In</button>
            <button className="btn btn-dark" onClick={() => navigate("/login")}>Get Started</button>
          </div>
        </div>
      )}
      <style>{`
  @media (max-width: 768px) {
    .nav-desktop { display: none !important; }
    .nav-mobile-btn { display: flex !important; }
  }
  @media (min-width: 769px) {
    .nav-mobile-btn { display: none !important; }
  }
`}</style>
    </header>
  )
}