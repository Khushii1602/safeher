import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { policeAPI } from "@/lib/api"
import { Search, Phone, Globe, Mail, Shield, ExternalLink } from "lucide-react"

export default function PoliceDirectory() {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState("")
  const [error, setError]       = useState("")

  useEffect(() => { fetchData() }, [])

  async function fetchData(s = search) {
    setLoading(true); setError("")
    try {
      const p = {}; if (s) p.search = s
      const res = await policeAPI.getAll(p)
      setData(res.data)
    } catch { setError("Could not load directory.") }
    setLoading(false)
  }

  const filtered = search
    ? data.filter(d => d.state.toLowerCase().includes(search.toLowerCase()))
    : data

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Government Directory
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
            Police & Emergency Resources
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 560 }}>
            Official police departments, women helplines, and cyber crime contacts for every Indian state and union territory.
          </p>
        </div>

        {/* Emergency quick cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 36 }}>
          {[
            { label: "Police Emergency", number: "100",  color: "#1e40af", bg: "#eff6ff" },
            { label: "Women Helpline",   number: "1091", color: "#991b1b", bg: "#fef2f2" },
            { label: "Ambulance",        number: "108",  color: "#14532d", bg: "#f0fdf4" },
            { label: "Cyber Crime",      number: "1930", color: "#5b21b6", bg: "#f5f3ff" },
          ].map(e => (
            <a key={e.number} href={`tel:${e.number}`} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px 16px", borderRadius: 16, background: e.bg, textDecoration: "none", transition: "all 0.15s", border: "1.5px solid transparent" }}
            onMouseEnter={e2 => { e2.currentTarget.style.transform = "translateY(-2px)"; e2.currentTarget.style.boxShadow = "var(--shadow-sm)" }}
            onMouseLeave={e2 => { e2.currentTarget.style.transform = ""; e2.currentTarget.style.boxShadow = "" }}>
              <p style={{ fontSize: 32, fontWeight: 900, color: e.color, letterSpacing: "-1px" }}>{e.number}</p>
              <p style={{ fontSize: 12, color: e.color, opacity: 0.8, marginTop: 4 }}>{e.label}</p>
            </a>
          ))}
        </div>

        {/* Cyber Crime Portal Banner */}
        <div style={{ background: "var(--black)", borderRadius: 16, padding: "20px 28px", marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9b9b9b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>National Portal</p>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: "white", marginBottom: 4 }}>Cyber Crime Reporting Portal</h3>
            <p style={{ fontSize: 13, color: "#9b9b9b" }}>Report cyber crimes online — available 24/7 for all states</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <a href="tel:1930" style={{ padding: "10px 18px", borderRadius: 10, background: "#dc2626", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
              <Phone size={13} /> 1930
            </a>
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 18px", borderRadius: 10, background: "#111", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
              <ExternalLink size={13} /> cybercrime.gov.in
            </a>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by state name..."
            style={{ width: "100%", padding: "14px 18px 14px 50px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, fontFamily: "inherit", background: "var(--white)", color: "var(--text-1)", outline: "none", transition: "border-color 0.2s" }}
            onFocus={e => e.target.style.borderColor = "var(--purple)"}
            onBlur={e => e.target.style.borderColor = "var(--border)"} />
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {[...Array(9)].map((_, i) => <div key={i} style={{ height: 180, borderRadius: 16, background: "var(--border)", opacity: 0.3 }} />)}
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>
              Showing <strong style={{ color: "var(--text-1)" }}>{filtered.length}</strong> states and union territories
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
              {filtered.map(entry => (
                <div key={entry._id} style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 18, padding: "22px", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)" }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "" }}>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                      <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", marginBottom: 3, letterSpacing: "-0.3px" }}>{entry.state}</h3>
                      <p style={{ fontSize: 12, color: "var(--text-3)" }}>{entry.department}</p>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Shield size={16} color="var(--purple)" />
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                    {[
                      { label: "Emergency", value: entry.emergencyNumber, href: `tel:${entry.emergencyNumber}`, color: "#991b1b", bg: "#fef2f2" },
                      { label: "Women Helpline", value: entry.womenHelpline, href: `tel:${entry.womenHelpline}`, color: "#5b21b6", bg: "#f5f3ff" },
                      { label: "Cyber Crime", value: entry.cyberCrimePhone, href: `tel:${entry.cyberCrimePhone}`, color: "#1e40af", bg: "#eff6ff" },
                    ].map(n => (
                      <a key={n.label} href={n.href} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", borderRadius: 8, background: n.bg, textDecoration: "none" }}>
                        <span style={{ fontSize: 11, color: n.color, fontWeight: 600 }}>{n.label}</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: n.color, letterSpacing: "-0.5px" }}>{n.value}</span>
                      </a>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 8 }}>
                    {entry.officialWebsite && (
                      <a href={entry.officialWebsite} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, background: "var(--bg-muted)", border: "1.5px solid var(--border)", color: "var(--text-2)", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--purple)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
                        <Globe size={13} /> Website
                      </a>
                    )}
                    {entry.cyberCrimePortal && (
                      <a href={entry.cyberCrimePortal} target="_blank" rel="noopener noreferrer" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, background: "var(--bg-muted)", border: "1.5px solid var(--border)", color: "var(--text-2)", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.color = "var(--purple)"}
                      onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
                        <ExternalLink size={13} /> Cyber Portal
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}