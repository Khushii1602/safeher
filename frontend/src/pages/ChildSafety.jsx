import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { childSafetyAPI } from "@/lib/api"
import { Phone, Globe, Mail, CheckCircle, Shield, Baby, AlertTriangle, Heart, Search, ExternalLink } from "lucide-react"

const types = ["all","ngo","helpline","shelter","rehabilitation","rights organization","missing child","government"]

const typeColors = {
  "ngo":                 { bg: "#f5f3ff", text: "#5b21b6" },
  "helpline":            { bg: "#fef2f2", text: "#991b1b" },
  "shelter":             { bg: "#f0fdf4", text: "#14532d" },
  "rehabilitation":      { bg: "#eff6ff", text: "#1e40af" },
  "rights organization": { bg: "#fffbeb", text: "#92400e" },
  "missing child":       { bg: "#fdf4ff", text: "#6b21a8" },
  "government":          { bg: "#f9fafb", text: "#374151" },
}

const typeIcons = {
  "ngo":                 Heart,
  "helpline":            Phone,
  "shelter":             Shield,
  "rehabilitation":      Heart,
  "rights organization": Shield,
  "missing child":       AlertTriangle,
  "government":          Shield,
}

export default function ChildSafety() {
  const [data, setData]     = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType]     = useState("all")
  const [error, setError]   = useState("")

  useEffect(() => { fetchData() }, [type])

  async function fetchData() {
    setLoading(true); setError("")
    try {
      const p = {}
      if (type !== "all") p.type = type
      const res = await childSafetyAPI.getAll(p)
      setData(res.data)
    } catch { setError("Could not load child safety resources.") }
    setLoading(false)
  }

  const national  = data.filter(d => d.isNational)
  const specific  = data.filter(d => !d.isNational)

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Protection & Support
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
            Child Safety Resources
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 560 }}>
            Resources for minors, guardians, teachers, and caregivers. Find NGOs, helplines, shelters and government support for child protection.
          </p>
        </div>

        {/* NCPCR Feature Card */}
        <div style={{ background: "var(--black)", borderRadius: 24, padding: "32px 40px", marginBottom: 36, display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ background: "var(--purple)", width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={16} color="white" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: "#9b9b9b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Government Body
              </span>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "white", letterSpacing: "-0.5px", marginBottom: 8 }}>
              NCPCR — National Commission for Protection of Child Rights
            </h2>
            <p style={{ fontSize: 14, color: "#9b9b9b", lineHeight: 1.7, maxWidth: 560, marginBottom: 20 }}>
              The statutory body that monitors and enforces children's rights in India. File complaints, access resources, and report violations directly.
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <a href="tel:1800-121-2830" style={{ padding: "10px 20px", borderRadius: 10, background: "#dc2626", color: "white", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
                <Phone size={13} /> 1800-121-2830
              </a>
              <a href="https://ncpcr.gov.in" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", borderRadius: 10, background: "#111", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
                <Globe size={13} /> Official Website
              </a>
              <a href="https://ncpcr.gov.in/complaint" target="_blank" rel="noopener noreferrer" style={{ padding: "10px 20px", borderRadius: 10, background: "#111", color: "white", fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #333", display: "flex", alignItems: "center", gap: 8 }}>
                <ExternalLink size={13} /> File a Complaint
              </a>
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 48, fontWeight: 900, color: "white", letterSpacing: "-2px" }}>1098</p>
            <p style={{ fontSize: 13, color: "#9b9b9b" }}>Childline Emergency</p>
            <p style={{ fontSize: 11, color: "#555", marginTop: 4 }}>24/7 · Free · Confidential</p>
          </div>
        </div>

        {/* Type filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
          {types.map(t => (
            <button key={t} onClick={() => setType(t)} style={{ padding: "9px 18px", borderRadius: 100, fontSize: 12, fontWeight: 600, border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", background: type === t ? "var(--black)" : "var(--white)", color: type === t ? "white" : "var(--text-2)", borderColor: type === t ? "var(--black)" : "var(--border)" }}>
              {t === "all" ? "All Resources" : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {error && <div style={{ background: "#fef2f2", color: "#991b1b", padding: "14px 18px", borderRadius: 12, marginBottom: 24, fontSize: 14 }}>{error}</div>}

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ height: 260, borderRadius: 20, background: "var(--border)", opacity: 0.3 }} />)}
          </div>
        ) : (
          <>
            {/* National resources */}
            {national.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 4, letterSpacing: "-0.3px" }}>National Resources</h2>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>Available across all of India</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {national.map(org => <ResourceCard key={org._id} org={org} />)}
                </div>
              </div>
            )}

            {/* State-specific */}
            {specific.length > 0 && (
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", marginBottom: 4, letterSpacing: "-0.3px" }}>State-Specific Organizations</h2>
                <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 20 }}>Specialized regional resources</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                  {specific.map(org => <ResourceCard key={org._id} org={org} />)}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  )
}

function ResourceCard({ org }) {
  const tc = typeColors[org.type] || typeColors["ngo"]
  const Icon = typeIcons[org.type] || Shield

  return (
    <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden", transition: "all 0.2s" }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)" }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "" }}>

      <div style={{ height: 5, background: org.isNational ? "var(--purple)" : "var(--border)" }} />
      <div style={{ padding: "22px 22px" }}>

        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: tc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Icon size={18} color={tc.text} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", lineHeight: 1.3 }}>{org.name}</h3>
              {org.isVerified && <CheckCircle size={13} color="var(--green)" />}
            </div>
            {org.city && <p style={{ fontSize: 11, color: "var(--text-3)" }}>{org.city}{org.state ? `, ${org.state}` : ""}</p>}
          </div>
        </div>

        <span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: tc.bg, color: tc.text, marginBottom: 12 }}>
          {org.type}
        </span>

        {org.description && (
          <p style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6, marginBottom: 14, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {org.description}
          </p>
        )}

        {org.services?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 16 }}>
            {org.services.slice(0, 3).map(s => (
              <span key={s} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 6, background: "var(--bg-muted)", color: "var(--text-2)" }}>{s}</span>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
          {(org.emergencyPhone || org.phone) && (
            <a href={`tel:${org.emergencyPhone || org.phone}`} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "9px 0", borderRadius: 10, background: "var(--purple)", color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
              <Phone size={12} /> {org.emergencyPhone || org.phone}
            </a>
          )}
          {org.website && (
            <a href={org.website} target="_blank" rel="noopener noreferrer" style={{ width: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10, background: "var(--bg-muted)", border: "1.5px solid var(--border)", textDecoration: "none", color: "var(--text-2)", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--purple)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--text-2)"}>
              <Globe size={14} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}