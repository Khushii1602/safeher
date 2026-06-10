import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { ngoAPI } from "@/lib/api"
import {
  Search, Phone, Mail, Globe, MapPin,
  CheckCircle, Filter, ExternalLink, ChevronRight, X
} from "lucide-react"

const categories = ["all","legal aid","mental health","shelter","education","employment","child welfare","domestic violence","general support"]
const states = ["all","Delhi","Maharashtra","Karnataka","Tamil Nadu","West Bengal","Telangana","Kerala","Uttar Pradesh","Gujarat"]

const catColors = {
  "legal aid":         { bg: "#eff6ff", text: "#1d4ed8" },
  "mental health":     { bg: "#f5f3ff", text: "#6d28d9" },
  "shelter":           { bg: "#fdf4ff", text: "#7e22ce" },
  "education":         { bg: "#f0fdf4", text: "#15803d" },
  "employment":        { bg: "#fffbeb", text: "#92400e" },
  "child welfare":     { bg: "#fce7f3", text: "#9d174d" },
  "domestic violence": { bg: "#fef2f2", text: "#991b1b" },
  "general support":   { bg: "#f9fafb", text: "#374151" },
}

function NGOCard({ ngo }) {
  const c = catColors[ngo.category] || catColors["general support"]

  return (
    <div style={{
      background: "var(--white)", border: "1.5px solid var(--border)",
      borderRadius: 20, padding: "28px 32px",
      display: "grid", gridTemplateColumns: "2fr 2fr 1fr",
      gap: 32, alignItems: "center",
      transition: "all 0.2s"
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.boxShadow = "var(--shadow-md)" }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "" }}>

      {/* Left — org info */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>
            {ngo.name}
          </h3>
          {ngo.isVerified && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0fdf4", color: "#15803d", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
              <CheckCircle size={10} /> Verified
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
          <MapPin size={12} color="var(--text-3)" />
          <span style={{ fontSize: 13, color: "var(--text-3)" }}>{ngo.city}, {ngo.state}</span>
          {ngo.rating > 0 && (
            <>
              <span style={{ color: "var(--border)" }}>·</span>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>★ {ngo.rating}</span>
            </>
          )}
        </div>

        <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: c.bg, color: c.text }}>
          {ngo.category}
        </span>

        <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, marginTop: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {ngo.description}
        </p>
      </div>

      {/* Center — services */}
      <div>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Services Offered
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ngo.services?.slice(0, 5).map(s => (
            <span key={s} style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "var(--bg-muted)", color: "var(--text-2)", fontWeight: 500, border: "1px solid var(--border)" }}>
              {s}
            </span>
          ))}
          {ngo.services?.length > 5 && (
            <span style={{ fontSize: 12, padding: "5px 12px", borderRadius: 8, background: "var(--bg-muted)", color: "var(--text-3)" }}>
              +{ngo.services.length - 5} more
            </span>
          )}
        </div>
      </div>

      {/* Right — actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ngo.phone && (
          <a href={`tel:${ngo.phone}`} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px 16px", borderRadius: 10, background: "var(--purple)",
            color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#5b21b6"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--purple)"}>
            <Phone size={13} /> Call Now
          </a>
        )}
        {ngo.email && (
          <a href={`mailto:${ngo.email}`} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px 16px", borderRadius: 10, background: "var(--bg-muted)",
            color: "var(--text-1)", fontSize: 13, fontWeight: 600, textDecoration: "none",
            border: "1.5px solid var(--border)", transition: "all 0.15s"
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple)" }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-1)" }}>
            <Mail size={13} /> Email
          </a>
        )}
        {ngo.website && (
          <a href={ngo.website} target="_blank" rel="noopener noreferrer" style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "10px 16px", borderRadius: 10, background: "var(--bg-muted)",
            color: "var(--text-2)", fontSize: 13, fontWeight: 600, textDecoration: "none",
            border: "1.5px solid var(--border)", transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.color = "var(--purple)"}
          onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
            <Globe size={13} /> Website <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  )
}

export default function NGODirectory() {
  const [ngos, setNgos]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState("")
  const [search, setSearch]     = useState("")
  const [category, setCategory] = useState("all")
  const [state, setState]       = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => { fetchNGOs() }, [category, state])

  async function fetchNGOs(s = search) {
    setLoading(true); setError("")
    try {
      const p = {}
      if (s) p.search = s
      if (category !== "all") p.category = category
      if (state !== "all") p.state = state
      const res = await ngoAPI.getAll(p)
      setNgos(res.data)
    } catch { setError("Could not load NGOs. Please try again.") }
    setLoading(false)
  }

  const activeFilters = [
    category !== "all" && category,
    state !== "all" && state,
  ].filter(Boolean)

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Resource Explorer
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
            NGO Directory
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 520 }}>
            Find verified organizations offering legal aid, shelter, counselling and support across India.
          </p>
        </div>

        {/* Search bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchNGOs(search)}
              placeholder="Search by organization name, city or service..."
              style={{
                width: "100%", padding: "16px 18px 16px 50px",
                borderRadius: 14, border: "1.5px solid var(--border)",
                fontSize: 15, fontFamily: "inherit", background: "var(--white)",
                color: "var(--text-1)", outline: "none", transition: "all 0.2s"
              }}
              onFocus={e => e.target.style.borderColor = "var(--purple)"}
              onBlur={e => e.target.style.borderColor = "var(--border)"}
            />
          </div>
          <button onClick={() => fetchNGOs(search)} className="btn btn-purple" style={{ padding: "0 28px", fontSize: 15 }}>
            Search
          </button>
          <button onClick={() => setShowFilters(!showFilters)} style={{
            padding: "0 20px", borderRadius: 14, border: "1.5px solid var(--border)",
            background: showFilters ? "var(--purple-light)" : "var(--white)",
            color: showFilters ? "var(--purple)" : "var(--text-2)",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.15s"
          }}>
            <Filter size={16} />
            Filters
            {activeFilters.length > 0 && (
              <span style={{ background: "var(--purple)", color: "white", width: 18, height: 18, borderRadius: "50%", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {activeFilters.length}
              </span>
            )}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "24px 28px", marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                  Category
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {categories.map(c => (
                    <button key={c} onClick={() => setCategory(c)} style={{
                      padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                      border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                      background: category === c ? "var(--purple)" : "var(--white)",
                      color: category === c ? "white" : "var(--text-2)",
                      borderColor: category === c ? "var(--purple)" : "var(--border)",
                    }}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                  State
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {states.map(s => (
                    <button key={s} onClick={() => setState(s)} style={{
                      padding: "7px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                      border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                      background: state === s ? "var(--black)" : "var(--white)",
                      color: state === s ? "white" : "var(--text-2)",
                      borderColor: state === s ? "var(--black)" : "var(--border)",
                    }}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {activeFilters.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 12, color: "var(--text-3)" }}>Active filters:</span>
                {activeFilters.map(f => (
                  <span key={f} style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 100, background: "var(--purple-light)", color: "var(--purple)", fontSize: 12, fontWeight: 600 }}>
                    {f} <X size={10} style={{ cursor: "pointer" }} onClick={() => { if (categories.includes(f)) setCategory("all"); else setState("all") }} />
                  </span>
                ))}
                <button onClick={() => { setCategory("all"); setState("all") }} style={{ fontSize: 12, color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} style={{ height: 140, borderRadius: 20, background: "var(--border)", opacity: 0.3, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : ngos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", background: "var(--white)", borderRadius: 20, border: "1.5px solid var(--border)" }}>
            <Search size={36} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
            <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>No organizations found</p>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}>Try adjusting your search or filters</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(""); setCategory("all"); setState("all"); fetchNGOs("") }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 14, color: "var(--text-3)", fontWeight: 500 }}>
                Showing <strong style={{ color: "var(--text-1)" }}>{ngos.length}</strong> organization{ngos.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {ngos.map(ngo => <NGOCard key={ngo._id} ngo={ngo} />)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}