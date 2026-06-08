import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"
import { Timer, CheckCircle, AlertTriangle, Phone, RotateCcw } from "lucide-react"

const presets = [
  { label:"15 min",  seconds:15*60 },
  { label:"30 min",  seconds:30*60 },
  { label:"1 hour",  seconds:60*60 },
  { label:"2 hours", seconds:2*60*60 },
  { label:"Custom",  seconds:null },
]

function formatTime(s) {
  const h=Math.floor(s/3600), m=Math.floor((s%3600)/60), sec=s%60
  if(h>0) return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`
}

export default function SafetyCheckin() {
  const { currentUser } = useAuth()
  const [status, setStatus]       = useState("idle")
  const [preset, setPreset]       = useState(presets[1])
  const [customMin, setCustomMin] = useState(45)
  const [total, setTotal]         = useState(30*60)
  const [remaining, setRemaining] = useState(30*60)
  const [contacts, setContacts]   = useState([])
  const [note, setNote]           = useState("")
  const intervalRef = useRef(null)

  useEffect(() => { if(currentUser?.uid) emergencyAPI.getContacts(currentUser.uid).then(r=>setContacts(r.data)).catch(()=>{}) }, [currentUser])

  useEffect(() => {
    if(status==="running") {
      intervalRef.current = setInterval(()=>{
        setRemaining(p=>{ if(p<=1){ clearInterval(intervalRef.current); setStatus("missed"); return 0 } return p-1 })
      },1000)
    } else clearInterval(intervalRef.current)
    return ()=>clearInterval(intervalRef.current)
  },[status])

  function handlePreset(p) {
    setPreset(p)
    const s = p.seconds ?? customMin*60
    setTotal(s); setRemaining(s)
  }

  function startTimer() {
    const s = preset.seconds ?? customMin*60
    setTotal(s); setRemaining(s); setStatus("running")
  }

  function reset() {
    clearInterval(intervalRef.current)
    const s = preset.seconds ?? customMin*60
    setTotal(s); setRemaining(s); setStatus("idle")
  }

  const progress = total > 0 ? ((total-remaining)/total)*100 : 0
  const isUrgent = remaining<=60 && status==="running"
  const C = 2*Math.PI*54

  return (
    <AppLayout>
      <div style={{ padding:"40px 48px", maxWidth:700, margin:"0 auto" }}>

        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-1px", marginBottom:6 }}>Safety Check-in</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}>Set a timer — if you don't check in, your contacts will be alerted.</p>
        </div>

        {/* Missed */}
        {status==="missed" && (
          <div style={{ background:"var(--black)", borderRadius:20, padding:28, marginBottom:20 }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:20 }}>
              <div style={{ width:48, height:48, borderRadius:14, background:"#dc2626", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <AlertTriangle size={24} color="white" />
              </div>
              <div>
                <p style={{ color:"white", fontSize:17, fontWeight:800 }}>Check-in Missed</p>
                <p style={{ color:"#9b9b9b", fontSize:13 }}>Please call your emergency contacts or a helpline now.</p>
              </div>
            </div>
            {contacts.length > 0 && (
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:16 }}>
                {contacts.map(c=>(
                  <a key={c._id} href={`tel:${c.phone}`} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 18px", borderRadius:12, background:"#111", textDecoration:"none" }}>
                    <div>
                      <p style={{ color:"white", fontSize:14, fontWeight:600 }}>{c.name}</p>
                      <p style={{ color:"#9b9b9b", fontSize:12 }}>{c.phone}</p>
                    </div>
                    <Phone size={18} color="var(--green)" />
                  </a>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:10 }}>
              <a href="tel:1091" className="btn btn-danger" style={{ flex:1, textDecoration:"none", justifyContent:"center" }}>
                <Phone size={15}/> Call 1091
              </a>
              <button onClick={reset} className="btn btn-outline" style={{ flex:1, background:"transparent", borderColor:"#333", color:"white" }}>
                I Am Safe — Reset
              </button>
            </div>
          </div>
        )}

        {/* Checked in */}
        {status==="checkedin" && (
          <div style={{ background:"var(--green-light)", border:"1px solid #a7f3d0", borderRadius:20, padding:28, textAlign:"center", marginBottom:20 }}>
            <CheckCircle size={40} color="var(--green)" style={{ margin:"0 auto 12px" }} />
            <h2 style={{ fontSize:20, fontWeight:800, color:"#065f46", marginBottom:8 }}>Check-in Successful!</h2>
            <p style={{ fontSize:14, color:"#047857", marginBottom:20 }}>You're safe. Want to set another timer?</p>
            <button onClick={reset} className="btn btn-purple">Set New Timer</button>
          </div>
        )}

        {/* Timer */}
        {(status==="idle"||status==="running") && (
          <div className="card" style={{ padding:36, marginBottom:20, textAlign:"center" }}>

            {/* Ring */}
            <div style={{ position:"relative", width:160, height:160, margin:"0 auto 32px" }}>
              <svg width={160} height={160} style={{ transform:"rotate(-90deg)" }}>
                <circle cx={80} cy={80} r={54} fill="none" stroke="var(--border)" strokeWidth={8} />
                <circle cx={80} cy={80} r={54} fill="none"
                  stroke={isUrgent ? "#dc2626" : "var(--purple)"}
                  strokeWidth={8} strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={C-(progress/100)*C}
                  style={{ transition:"stroke-dashoffset 1s linear, stroke 0.3s" }}
                />
              </svg>
              <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:26, fontWeight:800, letterSpacing:"-1px", color: isUrgent ? "#dc2626" : "var(--text-1)" }}>
                  {formatTime(remaining)}
                </span>
                <span style={{ fontSize:11, color:"var(--text-3)", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginTop:4 }}>
                  {status==="running" ? "remaining" : "ready"}
                </span>
              </div>
            </div>

            {/* Presets */}
            {status==="idle" && (
              <div style={{ marginBottom:24 }}>
                <p style={{ fontSize:12, fontWeight:700, color:"var(--text-3)", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:12 }}>
                  Choose Duration
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
                  {presets.map(p=>(
                    <button key={p.label} onClick={()=>handlePreset(p)} style={{
                      padding:"8px 18px", borderRadius:100, fontSize:13, fontWeight:600,
                      border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
                      background: preset.label===p.label ? "var(--purple)" : "var(--white)",
                      color: preset.label===p.label ? "white" : "var(--text-2)",
                      borderColor: preset.label===p.label ? "var(--purple)" : "var(--border)",
                    }}>
                      {p.label}
                    </button>
                  ))}
                </div>
                {preset.seconds===null && (
                  <div style={{ display:"flex", alignItems:"center", gap:10, justifyContent:"center", marginTop:16 }}>
                    <label style={{ fontSize:13, color:"var(--text-2)", fontWeight:500 }}>Minutes:</label>
                    <input type="number" value={customMin} onChange={e=>{ const v=Math.max(1,Math.min(480,Number(e.target.value))); setCustomMin(v); setTotal(v*60); setRemaining(v*60) }} min={1} max={480} className="input" style={{ width:80, textAlign:"center" }} />
                  </div>
                )}
              </div>
            )}

            {/* Note */}
            {status==="idle" && (
              <div style={{ marginBottom:24 }}>
                <input type="text" value={note} onChange={e=>setNote(e.target.value)} placeholder="Where are you going? (optional)" className="input" />
              </div>
            )}

            {status==="running" && note && (
              <p style={{ fontSize:13, color:"var(--text-3)", marginBottom:20, fontStyle:"italic" }}>{note}</p>
            )}

            {/* Buttons */}
            <div style={{ display:"flex", gap:10 }}>
              {status==="idle" ? (
                <button onClick={startTimer} className="btn btn-purple btn-lg" style={{ flex:1 }}>
                  <Timer size={18}/> Start Timer
                </button>
              ) : (
                <>
                  <button onClick={()=>{ clearInterval(intervalRef.current); setStatus("checkedin") }} className="btn btn-purple btn-lg" style={{ flex:2 }}>
                    <CheckCircle size={18}/> I'm Safe — Check In
                  </button>
                  <button onClick={reset} className="btn btn-outline" style={{ flex:1 }}>
                    <RotateCcw size={16}/> Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="card" style={{ padding:24 }}>
          <h2 style={{ fontSize:14, fontWeight:700, color:"var(--text-1)", marginBottom:16 }}>How to Use Safety Check-in</h2>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {[
              "Set a timer before going somewhere unfamiliar or meeting someone new.",
              "If you don't tap 'I'm Safe' before the timer ends, you'll see an alert to call for help.",
              "Add emergency contacts in the SOS page so they're ready when needed.",
              "Use the note field to record where you're going for your own reference.",
            ].map((tip,i)=>(
              <div key={i} style={{ display:"flex", gap:12 }}>
                <div style={{ width:20, height:20, borderRadius:"50%", background:"var(--purple-light)", color:"var(--purple)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
                  {i+1}
                </div>
                <p style={{ fontSize:13, color:"var(--text-2)", lineHeight:1.6 }}>{tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}