import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"
import {
  AlertTriangle, Phone, MapPin, Plus, Trash2,
  X, Shield, Clock, CheckCircle, Navigation
} from "lucide-react"

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
  const [sosHistory]                = useState([
    { id: 1, time: "2 days ago", location: "Connaught Place, Delhi", resolved: true },
    { id: 2, time: "1 week ago", location: "Lajpat Nagar, Delhi",    resolved: true },
  ])

  useEffect(() => { if (currentUser?.uid) loadContacts() }, [currentUser])

  async function loadContacts() {
    setLoadingC(true)
    try { const r = await emergencyAPI.getContacts(currentUser.uid); setContacts(r.data) } catch {}
    setLoadingC(false)
  }

  function triggerSOS() {
    setSosActive(true); setLocating(true); setLocError("")
    if (!navigator.geolocation) { setLocError("Location not supported on this device"); setLocating(false); return }
    navigator.geolocation.getCurrentPosition(
      p => { setLocation({ lat: p.coords.latitude.toFixed(5), lng: p.coords.longitude.toFixed(5), acc: Math.round(p.coords.accuracy) }); setLocating(false) },
      () => { setLocError("Could not get your location — please share it manually"); setLocating(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleAddContact(e) {
    e.preventDefault(); setSaving(true)
    try { await emergencyAPI.addContact({ userId: currentUser.uid, ...newC }); setNewC({ name: "", phone: "", relationship: "friend" }); setShowForm(false); await loadContacts() }
    catch (err) { alert(err.message) }
    setSaving(false)
  }

  async function handleDelete(id) {
    if (!confirm("Remove this contact?")) return
    try { await emergencyAPI.deleteContact(id); setContacts(p => p.filter(c => c._id !== id)) } catch {}
  }

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 900, margin: "0 auto" }}>

        {/* Emergency Banner */}
        <div style={{
          background: sosActive ? "#dc2626" : "var(--black)",
          borderRadius: 24, padding: "28px 36px", marginBottom: 36,
          transition: "background 0.5s ease"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: sosActive ? "#fca5a5" : "#22c55e", animation: sosActive ? "pulse 1s infinite" : "none" }} />
            <span style={{ fontSize: 12, fontWeight: 800, color: sosActive ? "#fca5a5" : "#9b9b9b", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              {sosActive ? "SOS ACTIVE — SEEK HELP IMMEDIATELY" : "Emergency System Ready"}
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", marginTop: 10, letterSpacing: "-0.5px" }}>
            {sosActive ? "Your location is being tracked" : "SOS Emergency Center"}
          </h1>
          {sosActive && location && (
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 6 }}>
              {location.lat}, {location.lng} (accuracy: ±{location.acc}m)
            </p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* SOS Button */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 24, padding: "48px 40px", textAlign: "center" }}>

              {sosActive ? (
                <div>
                  {/* Location status */}
                  <div style={{ background: "#fef2f2", borderRadius: 16, padding: "20px 24px", marginBottom: 24, textAlign: "left" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Navigation size={18} color="#dc2626" />
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#991b1b" }}>Live Location</span>
                    </div>
                    {locating ? (
                      <p style={{ fontSize: 13, color: "#991b1b" }}>Acquiring GPS coordinates...</p>
                    ) : location ? (
                      <div>
                        <p style={{ fontSize: 13, color: "#991b1b", marginBottom: 12 }}>
                          Lat: {location.lat} · Lng: {location.lng} · Accuracy: ±{location.acc}m
                        </p>
                        <a href={`https://www.google.com/maps?q=${location.lat},${location.lng}`} target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 18px", borderRadius: 8, background: "#dc2626", color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none" }}>
                          <MapPin size={12} /> Open in Maps
                        </a>
                      </div>
                    ) : <p style={{ fontSize: 13, color: "#dc2626" }}>{locError}</p>}
                  </div>

                  {/* Call contacts */}
                  {contacts.length > 0 && (
                    <div style={{ marginBottom: 24 }}>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12, textAlign: "left" }}>
                        Call Your Contacts
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {contacts.map(c => (
                          <a key={c._id} href={`tel:${c.phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: "var(--bg-muted)", border: "1.5px solid var(--border)", textDecoration: "none", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.background = "#fef2f2" }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-muted)" }}>
                            <div>
                              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{c.name}</p>
                              <p style={{ fontSize: 12, color: "var(--text-3)" }}>{c.relationship} · {c.phone}</p>
                            </div>
                            <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Phone size={18} color="white" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={() => { setSosActive(false); setLocation(null) }} style={{
                    width: "100%", padding: "14px", borderRadius: 12,
                    background: "var(--bg-muted)", border: "1.5px solid var(--border)",
                    fontSize: 14, fontWeight: 700, color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                    I Am Safe — Cancel SOS
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 32 }}>
                    Tap when you need immediate help
                  </p>
                  <button onClick={triggerSOS}
                    style={{
                      width: 200, height: 200, borderRadius: "50%",
                      background: "var(--black)", border: "6px solid #dc2626",
                      display: "flex", flexDirection: "column", alignItems: "center",
                      justifyContent: "center", gap: 12, cursor: "pointer", margin: "0 auto",
                      transition: "all 0.25s", color: "white",
                      boxShadow: "0 0 0 0 rgba(220,38,38,0.4)"
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 0 20px rgba(220,38,38,0.1), 0 0 0 40px rgba(220,38,38,0.05)"; e.currentTarget.style.transform = "scale(1.04)" }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = "" }}
                    aria-label="Activate SOS Emergency">
                    <AlertTriangle size={52} color="#dc2626" strokeWidth={2} />
                    <span style={{ fontSize: 16, fontWeight: 900, letterSpacing: "0.12em", color: "white" }}>SOS</span>
                  </button>
                  <p style={{ fontSize: 13, color: "var(--text-3)", marginTop: 28, maxWidth: 300, margin: "28px auto 0", lineHeight: 1.6 }}>
                    Activating SOS will capture your GPS coordinates and prompt you to call your emergency contacts.
                  </p>
                </div>
              )}
            </div>

            {/* SOS History */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px 28px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", marginBottom: 4, letterSpacing: "-0.3px" }}>Recent Activity</h2>
              <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 20 }}>Your recent SOS history</p>

              {sosHistory.length === 0 ? (
                <p style={{ fontSize: 14, color: "var(--text-3)", textAlign: "center", padding: "24px 0" }}>No recent activity</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {sosHistory.map(h => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 12, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: h.resolved ? "var(--green-light)" : "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {h.resolved ? <CheckCircle size={18} color="var(--green)" /> : <AlertTriangle size={18} color="#dc2626" />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>{h.location}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                          <Clock size={11} color="var(--text-3)" />
                          <span style={{ fontSize: 11, color: "var(--text-3)" }}>{h.time}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: h.resolved ? "var(--green)" : "#dc2626", background: h.resolved ? "var(--green-light)" : "#fef2f2", padding: "3px 10px", borderRadius: 100 }}>
                        {h.resolved ? "Resolved" : "Active"}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Helplines */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", marginBottom: 4, letterSpacing: "-0.3px" }}>National Helplines</h2>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>Available 24/7</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {helplines.map(h => (
                  <a key={h.number} href={`tel:${h.number}`} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    borderRadius: 12, background: h.color, textDecoration: "none",
                    transition: "all 0.15s"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateX(4px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = ""}>
                    <Phone size={15} color={h.tc} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 800, color: h.tc }}>{h.number}</p>
                      <p style={{ fontSize: 11, color: h.tc, opacity: 0.7 }}>{h.name}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Emergency Contacts */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px", flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", marginBottom: 2, letterSpacing: "-0.3px" }}>
                    Emergency Contacts
                  </h2>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>{contacts.length} of 5 added</p>
                </div>
                {contacts.length < 5 && (
                  <button onClick={() => setShowForm(!showForm)} style={{
                    width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)",
                    background: showForm ? "var(--purple)" : "var(--white)",
                    color: showForm ? "white" : "var(--text-2)",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s"
                  }}>
                    {showForm ? <X size={16} /> : <Plus size={16} />}
                  </button>
                )}
              </div>

              {showForm && (
                <form onSubmit={handleAddContact} style={{ background: "var(--bg-muted)", borderRadius: 14, padding: 16, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                  <input required value={newC.name} onChange={e => setNewC({...newC, name: e.target.value})} placeholder="Full name" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, fontFamily: "inherit", outline: "none", background: "var(--white)", color: "var(--text-1)" }} />
                  <input required type="tel" value={newC.phone} onChange={e => setNewC({...newC, phone: e.target.value})} placeholder="Phone number" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, fontFamily: "inherit", outline: "none", background: "var(--white)", color: "var(--text-1)" }} />
                  <select value={newC.relationship} onChange={e => setNewC({...newC, relationship: e.target.value})} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, fontFamily: "inherit", outline: "none", background: "var(--white)", color: "var(--text-1)" }}>
                    {relationships.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                  </select>
                  <button type="submit" disabled={saving} className="btn btn-purple btn-sm">
                    {saving ? "Saving..." : "Save Contact"}
                  </button>
                </form>
              )}

              {loadingC ? (
                <div style={{ height: 60, borderRadius: 10, background: "var(--border)", opacity: 0.3 }} />
              ) : contacts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <Shield size={28} color="var(--text-3)" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>No contacts yet</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>Add trusted people who can help in an emergency</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {contacts.map(c => (
                    <div key={c._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--white)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800 }}>
                          {c.name[0].toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{c.name}</p>
                          <p style={{ fontSize: 11, color: "var(--text-3)" }}>{c.relationship}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete(c._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 6, borderRadius: 6, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
                        onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}