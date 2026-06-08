import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { ngoAPI } from "@/lib/api"
import { Search, Phone, Mail, Globe, MapPin, CheckCircle, Filter } from "lucide-react"

const categories = ["all","legal aid","mental health","shelter","education","employment","child welfare","domestic violence","general support"]

const categoryColors = {
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
  const c = categoryColors[ngo.category] || categoryColors["general support"]

  return (
    <div className="card" style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)" }}>
              {ngo.name}
            </h3>
            {ngo.isVerified && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "#f0fdf4", color: "#15803d", padding: "2px 8px", borderRadius: 100, fontSize: 11, fontWeight: 600 }}>
                <CheckCircle size={10} /> Verified
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--text-3)" }}>
            <MapPin size={11} />
            {ngo.city}, {ngo.state}
          </div>
        </div>
        {ngo.rating > 0 && (
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", background: "var(--bg-muted)", padding: "4px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
            {ngo.rating} / 5
          </div>
        )}
      </div>

      {/* Category */}
      <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, background: c.bg, color: c.text, alignSelf: "flex-start" }}>
        {ngo.category}
      </span>

      {/* Description */}
      <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.7, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {ngo.description}
      </p>

      {/* Services */}
      {ngo.services?.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {ngo.services.slice(0, 3).map(s => (
            <span key={s} style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "var(--bg-muted)", color: "var(--text-2)", fontWeight: 500 }}>
              {s}
            </span>
          ))}
          {ngo.services.length > 3 && (
            <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "var(--bg-muted)", color: "var(--text-3)" }}>
              +{ngo.services.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: 8, paddingTop: 8, borderTop: "1px solid var(--border)" }}>
        {ngo.phone && (
          <a href={`tel:${ngo.phone}`} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", borderRadius: 10, background: "var(--bg-muted)",
            fontSize: 12, fontWeight: 600, color: "var(--text-1)", textDecoration: "none",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--purple-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-muted)"}>
            <Phone size={13} /> Call
          </a>
        )}
        {ngo.email && (
          <a href={`mailto:${ngo.email}`} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", borderRadius: 10, background: "var(--bg-muted)",
            fontSize: 12, fontWeight: 600, color: "var(--text-1)", textDecoration: "none",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--purple-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-muted)"}>
            <Mail size={13} /> Email
          </a>
        )}
        {ngo.website && (
          <a href={ngo.website} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "9px 12px", borderRadius: 10, background: "var(--bg-muted)",
            fontSize: 12, fontWeight: 600, color: "var(--text-1)", textDecoration: "none",
            transition: "all 0.15s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--purple-light)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--bg-muted)"}>
            <Globe size={13} /> Website
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

  useEffect(() => { fetchNGOs() }, [category])

  async function fetchNGOs(s = search) {
    setLoading(true); setError("")
    try {
      const p = {}
      if (s) p.search = s
      if (category !== "all") p.category = category
      const res = await ngoAPI.getAll(p)
      setNgos(res.data)
    } catch { setError("Could not load NGOs. Please try again.") }
    setLoading(false)
  }

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 6 }}>
            NGO Directory
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>
            Find verified organisations that can help you
          </p>
        </div>

        {/* Search + Filter bar */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={16} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-3)" }} />
            <input
              type="text" value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchNGOs(search)}
              placeholder="Search by name, city or service..."
              className="input" style={{ paddingLeft: 42 }}
            />
          </div>
          <button className="btn btn-purple" onClick={() => fetchNGOs(search)}>
            <Search size={15} /> Search
          </button>
        </div>

        {/* Category filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: "7px 16px", borderRadius: 100,
              fontSize: 12, fontWeight: 600, border: "1.5px solid",
              cursor: "pointer", transition: "all 0.15s",
              background: category === cat ? "var(--purple)" : "var(--white)",
              color: category === cat ? "white" : "var(--text-2)",
              borderColor: category === cat ? "var(--purple)" : "var(--border)",
            }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: "#fef2f2", color: "#991b1b", padding: "12px 16px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Results */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} style={{ height: 280, borderRadius: 16, background: "var(--border)", opacity: 0.4, animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : ngos.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)", marginBottom: 6 }}>No NGOs found</p>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>Try a different search or category</p>
            <button className="btn btn-outline btn-sm" onClick={() => { setSearch(""); setCategory("all"); fetchNGOs("") }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>
              Showing {ngos.length} organisation{ngos.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {ngos.map(ngo => <NGOCard key={ngo._id} ngo={ngo} />)}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  )
}