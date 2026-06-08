import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"
import { AlertTriangle, Phone, MapPin, Plus, Trash2, X } from "lucide-react"

const helplines = [
  { name: "Women Helpline",     number: "1091", color: "#fef2f2", tc: "#991b1b" },
  { name: "Police",             number: "100",  color: "#eff6ff", tc: "#1e40af" },
  { name: "Ambulance",          number: "108",  color: "#f0fdf4", tc: "#166534" },
  { name: "Domestic Violence",  number: "181",  color: "#f5f3ff", tc: "#5b21b6" },
  { name: "Child Helpline",     number: "1098", color: "#fdf4ff", tc: "#6b21a8" },
  { name: "Mental Health",      number: "1860-2662-345", color: "#fffbeb", tc: "#92400e" },
]

const relationships = ["mother","father","sister","brother","friend","partner","other"]

export default function SOS() {
  const { currentUser } = useAuth()
  const [sosActive, setSosActive]   = useState(false)
  const [location, setLocation]     = useState(null)
  const [locating, setLocating]     = useState(false)
  const [locError, setLocError]     = useState("")
  const [contacts, setContacts]     = useState([])
  const [loadingC, setLoadingC]     = useState(true)
  const [showForm, setShowForm]     = useState(false)
  const [saving, setSaving]         = useState(false)
  const [newC, setNewC]             = useState({ name: "", phone: "", relationship: "friend" })

  useEffect(() => { if (currentUser?.uid) loadContacts() }, [currentUser])

  async function loadContacts() {
    setLoadingC(true)
    try { const r = await emergencyAPI.getContacts(currentUser.uid); setContacts(r.data) } catch {}
    setLoadingC(false)
  }

  function triggerSOS() {
    setSosActive(true); setLocating(true); setLocError("")
    if (!navigator.geolocation) { setLocError("Location not supported"); setLocating(false); return }
    navigator.geolocation.getCurrentPosition(
      p => { setLocation({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5), acc: Math.round(p.coords.accuracy) }); setLocating(false) },
      () => { setLocError("Could not get location — please share manually"); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleAddContact(e) {
    e.preventDefault(); setSaving(true)
    try { await emergencyAPI.addContact({ userId: currentUser.uid, ...newC }); setNewC({ name: "", phone: "", relationship: "friend" }); setShowForm(false); await loadContacts() } catch (err) { alert(err.message) }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm("Remove this contact?")) return
    try { await emergencyAPI.deleteContact(id); setContacts(p => p.filter(c => c._id !== id)) } catch {}
  }

  return (
    <AppLayout>
      <div style={{ padding: "40px 48px", maxWidth: 800, margin: "0 auto" }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-1px", marginBottom: 6 }}>SOS Emergency</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>You are safe here. Help is one tap away.</p>
        </div>

        {/* SOS Active */}
        {sosActive ? (
          <div style={{ marginBottom: 24 }}>
            <div style={{ background: "var(--black)", borderRadius: 20, padding: 28, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{ width: 52, height: 52, borderRadius: 16, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <AlertTriangle size={26} color="white" />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 18, fontWeight: 800 }}>SOS Activated</p>
                  <p style={{ color: "#9b9b9b", fontSize: 13 }}>Call your emergency contacts below</p>
                </div>
              </div>

              {/* Location */}
              <div style={{ background: "#111", borderRadius: 14, padding: "16px 20px", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <MapPin size={14} color="#9b9b9b" />
                  <span style={{ fontSize: 12, color: "#9b9b9b", fontWeight: 600 }}>Your Location</span>
                </div>
                {locating ? (
                  <p style={{ color: "#9b9b9b", fontSize: 13 }}>Getting your location...</p>
                ) : location ? (
                  <div>
                    <p style={{ color: "white", fontSize: 13, marginBottom: 8 }}>
                      {location.lat}, {location.lng} (±{location.acc}m)
                    </p>
                    <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
                      style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "var(--purple)", color: "white", fontSize: 12, fontWeight: 600, textDecoration: "none" }}>
                      <MapPin size={12} /> Open in Google Maps
                    </a>
                  </div>
                ) : <p style={{ color: "#ef4444", fontSize: 13 }}>{locError}</p>}
              </div>

              {/* Contacts to call */}
              {contacts.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {contacts.map(c => (
                    <a key={c._id} href={`tel:${c.phone}`} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 18px", borderRadius: 12, background: "#111",
                      textDecoration: "none", transition: "all 0.15s"
                    }}>
                      <div>
                        <p style={{ color: "white", fontSize: 14, fontWeight: 600 }}>{c.name}</p>
                        <p style={{ color: "#9b9b9b", fontSize: 12 }}>{c.relationship} · {c.phone}</p>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--green)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Phone size={16} color="white" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>

            <button onClick={() => { setSosActive(false); setLocation(null) }} className="btn btn-outline" style={{ width: "100%" }}>
              I Am Safe — Cancel SOS
            </button>
          </div>
        ) : (
          /* Big SOS button */
          <div style={{ textAlign: "center", padding: "48px 0", marginBottom: 24 }}>
            <button
              onClick={triggerSOS}
              style={{
                width: 180, height: 180, borderRadius: "50%",
                background: "var(--black)", border: "4px solid #dc2626",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                gap: 10, cursor: "pointer", margin: "0 auto",
                transition: "all 0.2s", color: "white",
                boxShadow: "0 0 0 0 rgba(220,38,38,0.3)"
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 0 16px rgba(220,38,38,0.1)"; e.currentTarget.style.transform = "scale(1.03)" }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 0 0 rgba(220,38,38,0.3)"; e.currentTarget.style.transform = "scale(1)" }}
              aria-label="Activate SOS Emergency">
              <AlertTriangle size={40} color="#dc2626" />
              <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "0.05em" }}>TAP FOR SOS</span>
            </button>
            <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 20, maxWidth: 300, margin: "20px auto 0" }}>
              Pressing SOS will capture your GPS location and show your emergency contacts to call.
            </p>
          </div>
        )}

        {/* Helplines */}
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>
            National Helplines — Always Available
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {helplines.map(h => (
              <a key={h.number} href={`tel:${h.number}`} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "14px 16px",
                borderRadius: 12, background: h.color, textDecoration: "none",
                transition: "all 0.15s", border: "1px solid transparent"
              }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
              onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <Phone size={16} color={h.tc} />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: h.tc }}>{h.number}</p>
                  <p style={{ fontSize: 11, color: h.tc, opacity: 0.7 }}>{h.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Emergency contacts manager */}
        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>My Emergency Contacts</h2>
              <p style={{ fontSize: 12, color: "var(--text-3)" }}>Up to 5 trusted people</p>
            </div>
            {contacts.length < 5 && (
              <button className="btn btn-purple btn-sm" onClick={() => setShowForm(!showForm)}>
                {showForm ? <><X size={14}/> Cancel</> : <><Plus size={14}/> Add Contact</>}
              </button>
            )}
          </div>

          {showForm && (
            <form onSubmit={handleAddContact} style={{ background: "var(--bg-muted)", borderRadius: 14, padding: 20, marginBottom: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <input required value={newC.name} onChange={e => setNewC({...newC, name: e.target.value})} placeholder="Full name" className="input" />
              <input required type="tel" value={newC.phone} onChange={e => setNewC({...newC, phone: e.target.value})} placeholder="Phone number" className="input" />
              <select value={newC.relationship} onChange={e => setNewC({...newC, relationship: e.target.value})} className="input">
                {relationships.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
              <button type="submit" disabled={saving} className="btn btn-purple">
                {saving ? "Saving..." : "Save Contact"}
              </button>
            </form>
          )}

          {loadingC ? (
            <div style={{ height: 80, borderRadius: 12, background: "var(--border)", opacity: 0.4 }} />
          ) : contacts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>No contacts yet</p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>Add trusted people who can help in an emergency</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {contacts.map(c => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--white)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)" }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-3)" }}>{c.relationship} · {c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(c._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 8, borderRadius: 8, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  )
}