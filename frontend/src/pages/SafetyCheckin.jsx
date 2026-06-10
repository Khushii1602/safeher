import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"
import { Timer, CheckCircle, AlertTriangle, Phone, RotateCcw, Clock, Shield, Play, Square } from "lucide-react"

const presets = [
  { label: "15 min",  seconds: 15 * 60 },
  { label: "30 min",  seconds: 30 * 60 },
  { label: "1 hour",  seconds: 60 * 60 },
  { label: "2 hours", seconds: 2 * 60 * 60 },
  { label: "Custom",  seconds: null },
]

function formatTime(s) {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60
  if (h > 0) return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
}

export default function SafetyCheckin() {
  const { currentUser } = useAuth()
  const [status, setStatus]       = useState("idle")
  const [preset, setPreset]       = useState(presets[1])
  const [customMin, setCustomMin] = useState(45)
  const [total, setTotal]         = useState(30 * 60)
  const [remaining, setRemaining] = useState(30 * 60)
  const [contacts, setContacts]   = useState([])
  const [note, setNote]           = useState("")
  const intervalRef = useRef(null)

  useEffect(() => {
    if (currentUser?.uid) {
      emergencyAPI.getContacts(currentUser.uid).then(r => setContacts(r.data)).catch(() => {})
    }
  }, [currentUser])

  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining(p => {
          if (p <= 1) { clearInterval(intervalRef.current); setStatus("missed"); return 0 }
          return p - 1
        })
      }, 1000)
    } else clearInterval(intervalRef.current)
    return () => clearInterval(intervalRef.current)
  }, [status])

  function handlePreset(p) {
    setPreset(p)
    const s = p.seconds ?? customMin * 60
    setTotal(s); setRemaining(s)
  }

  function startTimer() {
    const s = preset.seconds ?? customMin * 60
    setTotal(s); setRemaining(s); setStatus("running")
  }

  function reset() {
    clearInterval(intervalRef.current)
    const s = preset.seconds ?? customMin * 60
    setTotal(s); setRemaining(s); setStatus("idle")
  }

  const progress = total > 0 ? ((total - remaining) / total) * 100 : 0
  const isUrgent = remaining <= 60 && status === "running"
  const C = 2 * Math.PI * 70

  const statusConfig = {
    idle:       { label: "Ready to Start",     color: "var(--text-3)",  bg: "var(--bg-muted)" },
    running:    { label: "Check-in Active",     color: "var(--purple)",  bg: "var(--purple-light)" },
    missed:     { label: "Check-in Missed",     color: "var(--red)",     bg: "#fef2f2" },
    checkedin:  { label: "Checked In Safely",   color: "var(--green)",   bg: "var(--green-light)" },
  }
  const sc = statusConfig[status]

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1000, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Wellness Dashboard
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 8 }}>
              Safety Check-in
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-3)" }}>
              Set a timer. If you don't check in, your emergency contacts will be alerted.
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 100, background: sc.bg, border: `1.5px solid ${sc.color}20` }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: sc.color }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: sc.color }}>{sc.label}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>

          {/* Main timer card */}
          <div>

            {/* Missed */}
            {status === "missed" && (
              <div style={{ background: "var(--black)", borderRadius: 24, padding: "32px 36px", marginBottom: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <AlertTriangle size={26} color="white" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p style={{ color: "white", fontSize: 20, fontWeight: 900, letterSpacing: "-0.5px" }}>Check-in Missed</p>
                    <p style={{ color: "#9b9b9b", fontSize: 14, marginTop: 4 }}>Please contact your emergency contacts or call a helpline immediately.</p>
                  </div>
                </div>
                {contacts.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                    {contacts.map(c => (
                      <a key={c._id} href={`tel:${c.phone}`} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: "#111", textDecoration: "none" }}>
                        <div>
                          <p style={{ color: "white", fontSize: 14, fontWeight: 700 }}>{c.name}</p>
                          <p style={{ color: "#9b9b9b", fontSize: 12 }}>{c.relationship} · {c.phone}</p>
                        </div>
                        <Phone size={18} color="#22c55e" />
                      </a>
                    ))}
                  </div>
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <a href="tel:1091" style={{ flex: 1, padding: "13px", borderRadius: 12, background: "#dc2626", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    <Phone size={16} /> Call 1091
                  </a>
                  <button onClick={reset} style={{ flex: 1, padding: "13px", borderRadius: 12, background: "transparent", border: "1.5px solid #333", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#111"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    I Am Safe — Reset
                  </button>
                </div>
              </div>
            )}

            {/* Checked in */}
            {status === "checkedin" && (
              <div style={{ background: "var(--green-light)", border: "1.5px solid #a7f3d0", borderRadius: 24, padding: "32px 36px", textAlign: "center", marginBottom: 20 }}>
                <CheckCircle size={48} color="var(--green)" style={{ margin: "0 auto 16px" }} />
                <h2 style={{ fontSize: 24, fontWeight: 900, color: "#065f46", letterSpacing: "-0.5px", marginBottom: 8 }}>
                  Check-in Successful
                </h2>
                <p style={{ fontSize: 15, color: "#047857", marginBottom: 24 }}>
                  You're safe. Would you like to set another timer?
                </p>
                <button onClick={reset} className="btn btn-purple">
                  Set New Timer
                </button>
              </div>
            )}

            {/* Timer display */}
            {(status === "idle" || status === "running") && (
              <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 24, padding: "48px 40px" }}>

                {/* SVG ring */}
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
                  <div style={{ position: "relative", width: 200, height: 200 }}>
                    <svg width={200} height={200} style={{ transform: "rotate(-90deg)" }}>
                      <circle cx={100} cy={100} r={70} fill="none" stroke="var(--border)" strokeWidth={10} />
                      <circle cx={100} cy={100} r={70} fill="none"
                        stroke={isUrgent ? "#dc2626" : "var(--purple)"}
                        strokeWidth={10} strokeLinecap="round"
                        strokeDasharray={C}
                        strokeDashoffset={C - (progress / 100) * C}
                        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                      />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-2px", color: isUrgent ? "#dc2626" : "var(--text-1)", fontVariantNumeric: "tabular-nums" }}>
                        {formatTime(remaining)}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 6 }}>
                        {status === "running" ? "remaining" : "duration"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Preset picker */}
                {status === "idle" && (
                  <div style={{ marginBottom: 28 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14, textAlign: "center" }}>
                      Set Duration
                    </p>
                    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
                      {presets.map(p => (
                        <button key={p.label} onClick={() => handlePreset(p)} style={{
                          padding: "9px 20px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                          border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                          background: preset.label === p.label ? "var(--black)" : "var(--white)",
                          color: preset.label === p.label ? "white" : "var(--text-2)",
                          borderColor: preset.label === p.label ? "var(--black)" : "var(--border)",
                        }}>
                          {p.label}
                        </button>
                      ))}
                    </div>
                    {preset.seconds === null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", marginTop: 16 }}>
                        <label style={{ fontSize: 13, color: "var(--text-2)", fontWeight: 500 }}>Minutes:</label>
                        <input type="number" value={customMin}
                          onChange={e => { const v = Math.max(1, Math.min(480, Number(e.target.value))); setCustomMin(v); setTotal(v * 60); setRemaining(v * 60) }}
                          min={1} max={480}
                          style={{ width: 80, padding: "8px 12px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", textAlign: "center", outline: "none", color: "var(--text-1)" }} />
                      </div>
                    )}
                  </div>
                )}

                {/* Note */}
                {status === "idle" && (
                  <div style={{ marginBottom: 28 }}>
                    <input type="text" value={note} onChange={e => setNote(e.target.value)} placeholder="Where are you going? (optional)"
                      style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--text-1)", transition: "border-color 0.2s" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  </div>
                )}

                {status === "running" && note && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 10, background: "var(--bg-muted)", marginBottom: 24 }}>
                    <Clock size={14} color="var(--text-3)" />
                    <span style={{ fontSize: 13, color: "var(--text-2)", fontStyle: "italic" }}>{note}</span>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: "flex", gap: 12 }}>
                  {status === "idle" ? (
                    <button onClick={startTimer} style={{
                      flex: 1, padding: "16px", borderRadius: 14,
                      background: "var(--black)", color: "white",
                      fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.2s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "#333"}
                    onMouseLeave={e => e.currentTarget.style.background = "var(--black)"}>
                      <Play size={18} /> Start Check-in Timer
                    </button>
                  ) : (
                    <>
                      <button onClick={() => { clearInterval(intervalRef.current); setStatus("checkedin") }} style={{
                        flex: 2, padding: "16px", borderRadius: 14,
                        background: "var(--purple)", color: "white",
                        fontSize: 15, fontWeight: 800, border: "none", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 10, transition: "all 0.15s"
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "#5b21b6"}
                      onMouseLeave={e => e.currentTarget.style.background = "var(--purple)"}>
                        <CheckCircle size={18} /> I'm Safe — Check In
                      </button>
                      <button onClick={reset} style={{
                        flex: 1, padding: "16px", borderRadius: 14,
                        background: "var(--bg-muted)", color: "var(--text-2)",
                        fontSize: 14, fontWeight: 600, border: "1.5px solid var(--border)", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s"
                      }}>
                        <Square size={16} /> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right panel */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Status summary */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px" }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", marginBottom: 20, letterSpacing: "-0.3px" }}>
                Check-in Summary
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Current Status",        value: sc.label,                      color: sc.color },
                  { label: "Duration Set",           value: preset.label === "Custom" ? `${customMin} min` : preset.label, color: "var(--text-1)" },
                  { label: "Time Remaining",         value: status === "running" ? formatTime(remaining) : "—",            color: isUrgent ? "var(--red)" : "var(--text-1)" },
                  { label: "Emergency Contacts",     value: `${contacts.length} added`,    color: contacts.length > 0 ? "var(--green)" : "var(--text-3)" },
                ].map(s => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, color: "var(--text-3)" }}>{s.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency contacts */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px", flex: 1 }}>
              <h2 style={{ fontSize: 15, fontWeight: 800, color: "var(--text-1)", marginBottom: 6, letterSpacing: "-0.3px" }}>
                Emergency Contacts
              </h2>
              <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
                These people will be notified if you miss a check-in
              </p>
              {contacts.length === 0 ? (
                <div style={{ textAlign: "center", padding: "24px 0" }}>
                  <Shield size={28} color="var(--text-3)" style={{ margin: "0 auto 10px" }} />
                  <p style={{ fontSize: 13, color: "var(--text-3)" }}>No contacts added yet</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 4 }}>Add them in the SOS page</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {contacts.map(c => (
                    <div key={c._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                        {c.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{c.name}</p>
                        <p style={{ fontSize: 11, color: "var(--text-3)" }}>{c.relationship} · {c.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* How it works */}
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px" }}>
              <h2 style={{ fontSize: 14, fontWeight: 800, color: "var(--text-1)", marginBottom: 16, letterSpacing: "-0.3px" }}>
                How It Works
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { n: "1", text: "Set your timer duration and optionally add a note about where you're going." },
                  { n: "2", text: "Start the timer before going somewhere unfamiliar or meeting someone new." },
                  { n: "3", text: "Tap 'I'm Safe' before the timer ends to confirm you're okay." },
                  { n: "4", text: "If you miss the check-in, you'll see an urgent alert to call for help." },
                ].map(s => (
                  <div key={s.n} style={{ display: "flex", gap: 12 }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--purple-light)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                      {s.n}
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--text-2)", lineHeight: 1.6 }}>{s.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}