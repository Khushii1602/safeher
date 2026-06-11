import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { profileAPI } from "@/lib/api"
import { Shield, User, MapPin, Briefcase, Phone, ChevronRight, CheckCircle } from "lucide-react"

const indianStates = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]

const steps = [
  { id: 1, title: "Personal Info",    icon: User,      desc: "Tell us about yourself" },
  { id: 2, title: "Your Location",    icon: MapPin,    desc: "City and state" },
  { id: 3, title: "Emergency Contact",icon: Phone,     desc: "Someone we can alert" },
]

export default function Onboarding() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]     = useState(1)
  const [saving, setSaving] = useState(false)
  const [form, setForm]     = useState({
    fullName: currentUser?.displayName || "",
    age: "", gender: "", occupation: "",
    city: "", state: "",
    emergencyName: "", emergencyPhone: "",
  })

  function update(key, val) { setForm(p => ({ ...p, [key]: val })) }

  async function finish() {
    setSaving(true)
    try {
      await profileAPI.upsert({
        uid: currentUser.uid,
        fullName: form.fullName,
        age: Number(form.age) || undefined,
        gender: form.gender,
        city: form.city,
        state: form.state,
        occupation: form.occupation,
      })
      navigate("/dashboard")
    } catch { navigate("/dashboard") }
    setSaving(false)
  }

  const progress = (step / steps.length) * 100

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40, justifyContent: "center" }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={16} color="white" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.5px" }}>
            Safe<span style={{ color: "var(--purple)" }}>Her</span>
          </span>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          {steps.map(s => (
            <div key={s.id} style={{ flex: 1, height: 4, borderRadius: 99, background: s.id <= step ? "var(--purple)" : "var(--border)", transition: "background 0.3s" }} />
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 32 }}>
          Step {step} of {steps.length}
        </p>

        {/* Card */}
        <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 24, padding: "36px 40px" }}>

          {/* Step header */}
          <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>
              {steps[step - 1].desc}
            </p>
            <h2 style={{ fontSize: 26, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.5px" }}>
              {steps[step - 1].title}
            </h2>
          </div>

          {/* Step 1 — Personal Info */}
          {step === 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" style={inputStyle} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Age</label>
                  <input type="number" value={form.age} onChange={e => update("age", e.target.value)} placeholder="e.g. 24" min={10} max={100} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Gender</label>
                  <select value={form.gender} onChange={e => update("gender", e.target.value)} style={inputStyle}>
                    <option value="">Select gender</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-Binary</option>
                    <option value="prefer not to say">Prefer Not To Say</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>Occupation <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
                <input value={form.occupation} onChange={e => update("occupation", e.target.value)} placeholder="e.g. Student, Teacher, Professional" style={inputStyle} />
              </div>
            </div>
          )}

          {/* Step 2 — Location */}
          {step === 2 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={labelStyle}>City</label>
                <input value={form.city} onChange={e => update("city", e.target.value)} placeholder="Your city" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>State</label>
                <select value={form.state} onChange={e => update("state", e.target.value)} style={inputStyle}>
                  <option value="">Select state</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 3 — Emergency Contact */}
          {step === 3 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ padding: "14px 18px", background: "var(--purple-light)", borderRadius: 12, border: "1px solid #ddd6fe", marginBottom: 4 }}>
                <p style={{ fontSize: 13, color: "var(--purple)", lineHeight: 1.6 }}>
                  This person will be alerted if you activate SOS or miss a safety check-in. You can update this anytime in your profile.
                </p>
              </div>
              <div>
                <label style={labelStyle}>Emergency Contact Name <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
                <input value={form.emergencyName} onChange={e => update("emergencyName", e.target.value)} placeholder="e.g. Mother, Best Friend" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Their Phone Number <span style={{ color: "var(--text-3)", fontWeight: 400 }}>(optional)</span></label>
                <input type="tel" value={form.emergencyPhone} onChange={e => update("emergencyPhone", e.target.value)} placeholder="+91 98765 43210" style={inputStyle} />
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
            {step > 1 && (
              <button onClick={() => setStep(p => p - 1)} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 14, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s" }}>
                Back
              </button>
            )}
            {step < steps.length ? (
              <button onClick={() => setStep(p => p + 1)} style={{ flex: 2, padding: "13px", borderRadius: 12, background: "var(--black)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}>
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={finish} disabled={saving} style={{ flex: 2, padding: "13px", borderRadius: 12, background: "var(--purple)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", opacity: saving ? 0.7 : 1 }}>
                <CheckCircle size={16} /> {saving ? "Saving..." : "Complete Setup"}
              </button>
            )}
          </div>

          {/* Skip */}
          <button onClick={() => navigate("/dashboard")} style={{ width: "100%", marginTop: 16, background: "none", border: "none", fontSize: 13, color: "var(--text-3)", cursor: "pointer", textDecoration: "underline" }}>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  )
}

const labelStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }
const inputStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--text-1)", background: "var(--white)", transition: "border-color 0.2s" }