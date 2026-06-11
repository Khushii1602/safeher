import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { legalAidAPI } from "@/lib/api"
import { Search, Phone, Mail, Globe, Clock, CheckCircle, Scale, Filter, X } from "lucide-react"

const categories = ["all","domestic violence","sexual harassment","child protection","cyber crime","property rights","family law","workplace harassment","general"]
const states = ["all","Delhi","Maharashtra","Karnataka","Tamil Nadu","West Bengal","Telangana","Kerala","Uttar Pradesh","Gujarat","Rajasthan","Punjab","Madhya Pradesh","Bihar"]

const catColors = {
  "domestic violence":   { bg: "#fef2f2", text: "#991b1b" },
  "sexual harassment":   { bg: "#fff0f6", text: "#9d174d" },
  "child protection":    { bg: "#fdf4ff", text: "#6b21a8" },
  "cyber crime":         { bg: "#eff6ff", text: "#1e40af" },
  "property rights":     { bg: "#fffbeb", text: "#92400e" },
  "family law":          { bg: "#f0fdf4", text: "#14532d" },
  "workplace harassment":{ bg: "#f5f3ff", text: "#4c1d95" },
  "general":             { bg: "#f9fafb", text: "#374151" },
}

function LegalAidCard({ org }) {
  const cc = catColors[org.category] || catColors["general"]

  return (
    <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px 32px", display: "grid", gridTemplateColumns: "2fr 2fr 1fr", gap: 32, alignItems: "flex-start", transition: "all 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.boxShadow = "var(--shadow-md)" }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "" }}>

      {/* Left */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>{org.name}</h3>
          {org.isVerified && (
            <span style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
              <CheckCircle size={10} /> Verified
            </span>
          )}
          {org.isFree && (
            <span style={{ background: "#eff6ff", color: "#1e40af", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 700 }}>
              Free
            </span>
          )}
        </div>
        <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 12 }}>
          {org.city ? `${org.city}, ` : ""}{org.state}
        </p>
        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: cc.bg, color: cc.text, marginBottom: 14 }}>
          {org.category}
        </span>
        {org.eligibility && (
          <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6 }}>
            <strong style={{ color: "var(--text-2)" }}>Eligibility:</strong> {org.eligibility}
          </p>
        )}
        {org.operatingHours && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
            <Clock size={12} color="var(--text-3)" />
            <span style={{ fontSize: 12, color: "var(--text-3)" }}>{org.operatingHours}</span>
          </div>
        )}
      </div>

      {/* Center */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Services Offered
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {org.services.map(s => (
            <span key={s} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "var(--bg-muted)", color: "var(--text-2)", fontWeight: 500, border: "1px solid var(--border)" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {org.phone && (
          <a href={`tel:${org.phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--purple)", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#5b21b6"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--purple)"}>
            <Phone size={13} /> Call
          </a>
        )}
        {org.email && (
          <a href={`mailto:${org.email}`} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--bg-muted)", color: "var(--text-1)", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1.5px solid var(--border)", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple)" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-1)" }}>
            <Mail size={13} /> Email
          </a>
        )}
        {org.website && (
          <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 14px", borderRadius: 10, background: "var(--bg-muted)", color: "var(--text-2)", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1.5px solid var(--border)", transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--purple)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
            <Globe size={13} /> Website
          </a>
        )}
      </div>
    </div>
  )
}

export default function LegalAid() {
  const [data, setData]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState("")
  const [category, setCategory] = useState("all")
  const [state, setState]       = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [error, setError]       = useState("")

  useEffect(() => { fetchData() }, [category, state])

  async function fetchData(s = search) {
    setLoading(true); setError("")
    try {
      const p = {}
      if (s) p.search = s
      if (category !== "all") p.category = category
      if (state !== "all") p.state = state
      const res = await legalAidAPI.getAll(p)
      setData(res.data)
    } catch { setError("Could not load legal aid resources. Please try again.") }
    setLoading(false)
  }

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 24, marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Free Legal Support
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
              Legal Aid Directory
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 560 }}>
              Find free legal support for domestic violence, workplace harassment, cyber crime, family law, and more across India.
            </p>
          </div>

          {/* National Legal Aid banner */}
          <div style={{ background: "var(--black)", borderRadius: 16, padding: "20px 24px", minWidth: 220, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#9b9b9b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>National Helpline</p>
            <a href="tel:15100" style={{ fontSize: 28, fontWeight: 900, color: "white", letterSpacing: "-1px", textDecoration: "none", display: "block", marginBottom: 4 }}>15100</a>
            <p style={{ fontSize: 12, color: "#9b9b9b" }}>NALSA Free Legal Aid</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === "Enter" && fetchData(search)} placeholder="Search by organization name, city or service..."
              style={{ width: "100%", padding: "16px 18px 16px 50px", borderRadius: 14, border: "1.5px solid var(--border)", fontSize: 15, fontFamily: "inherit", background: "var(--white)", color: "var(--text-1)", outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.target.style.borderColor = "var(--purple)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"} />
          </div>
          <button className="btn btn-purple" onClick={() => fetchData(search)} style={{ padding: "0 28px", fontSize: 15 }}>Search</button>
          <button onClick={() => setShowFilters(!showFilters)} style={{ padding: "0 20px", borderRadius: 14, border: "1.5px solid var(--border)", background: showFilters ? "var(--purple-light)" : "var(--white)", color: showFilters ? "var(--purple)" : "var(--text-2)", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
            <Filter size={16} /> Filters
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "24px 28px", marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Legal Category</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", background: category === c ? "var(--purple)" : "var(--white)", color: category === c ? "white" : "var(--text-2)", borderColor: category === c ? "var(--purple)" : "var(--border)" }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>State</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {states.map(s => (
                    <button key={s} onClick={() => setState(s)} style={{ padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", background: state === s ? "var(--black)" : "var(--white)", color: state === s ? "white" : "var(--text-2)", borderColor: state === s ? "var(--black)" : "var(--border)" }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[...Array(4)].map((_, i) => <div key={i} style={{ height: 140, borderRadius: 20, background: "var(--border)", opacity: 0.3 }} />)}
          </div>
        ) : data.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "var(--white)", borderRadius: 20, border: "1.5px solid var(--border)" }}>
            <Scale size={36} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>No legal aid organizations found</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(""); setCategory("all"); setState("all"); fetchData("") }}>Clear Filters</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>
              Showing <strong style={{ color: "var(--text-1)" }}>{data.length}</strong> organizations
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {data.map(org => <LegalAidCard key={org._id} org={org} />)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}