import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { mentorApplicationAPI } from "@/lib/api"
import Navbar from "@/components/layout/Navbar"
import {
  Shield, CheckCircle, ChevronRight, ChevronLeft,
  User, Briefcase, Clock, Globe, AlertCircle
} from "lucide-react"

const indianStates = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]

const specializations = [
  { value: "legal aid",                label: "Legal Aid",                desc: "Legal advice, FIR assistance, court support" },
  { value: "mental health",            label: "Mental Health",            desc: "Counselling, therapy, emotional support" },
  { value: "career guidance",          label: "Career Guidance",          desc: "Job search, interviews, workplace navigation" },
  { value: "financial independence",   label: "Financial Independence",   desc: "Budgeting, investing, financial planning" },
  { value: "domestic violence support",label: "Domestic Violence Support",desc: "Survivor support, safety planning" },
  { value: "digital safety",           label: "Digital Safety",           desc: "Cybersecurity, online harassment, privacy" },
  { value: "entrepreneurship",         label: "Entrepreneurship",         desc: "Business planning, funding, startups" },
  { value: "education",                label: "Education",                desc: "Scholarships, career counselling, academics" },
]

const languageOptions = ["Hindi","English","Tamil","Telugu","Kannada","Malayalam","Marathi","Bengali","Gujarati","Punjabi","Urdu","Odia","Assamese","Bhojpuri"]

const steps = [
  { id: 1, title: "Personal Info",     icon: User,      desc: "Tell us about yourself" },
  { id: 2, title: "Professional Info", icon: Briefcase, desc: "Your expertise and experience" },
  { id: 3, title: "Availability",      icon: Clock,     desc: "When can you help?" },
  { id: 4, title: "Online Presence",   icon: Globe,     desc: "Optional verification links" },
]

const iStyle = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--text-1)", background: "var(--white)", transition: "border-color 0.2s" }
const lStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }

const emptyForm = {
  fullName: "", email: "", phone: "", city: "", state: "", gender: "",
  title: "", organization: "", specialization: "", experience: "", languages: [], bio: "", qualifications: "",
  availability: "available", hoursPerWeek: "",
  linkedinUrl: "", websiteUrl: "",
}

export default function BecomeMentor() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [form, setForm]       = useState(emptyForm)
  const [submitting, setSub]  = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError]     = useState("")
  const [fieldErrors, setFieldErrors] = useState({})

  function update(k, v) { setForm(p => ({ ...p, [k]: v })); setFieldErrors(p => ({ ...p, [k]: "" })) }

  function toggleLanguage(lang) {
    setForm(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang]
    }))
  }

  function validateStep() {
    const errors = {}
    if (step === 1) {
      if (!form.fullName.trim()) errors.fullName = "Full name is required"
      if (!form.email.trim())    errors.email    = "Email is required"
      if (!form.phone.trim())    errors.phone    = "Phone number is required"
      if (!form.city.trim())     errors.city     = "City is required"
      if (!form.state)           errors.state    = "State is required"
    }
    if (step === 2) {
      if (!form.title.trim())          errors.title          = "Professional title is required"
      if (!form.specialization)        errors.specialization = "Please select a specialization"
      if (!form.experience)            errors.experience     = "Years of experience is required"
      if (!form.bio.trim())            errors.bio            = "Bio is required"
      if (form.languages.length === 0) errors.languages      = "Select at least one language"
      if (form.bio.trim().length < 100) errors.bio           = "Bio must be at least 100 characters"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  function nextStep() {
    if (validateStep()) setStep(p => Math.min(p + 1, steps.length))
  }

  function prevStep() {
    setStep(p => Math.max(p - 1, 1))
    setFieldErrors({})
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!validateStep()) return
    setSub(true); setError("")

    try {
      await mentorApplicationAPI.apply({
        ...form,
        experience: Number(form.experience),
        hoursPerWeek: Number(form.hoursPerWeek) || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.")
    }
    setSub(false)
  }

  const progress = (step / steps.length) * 100

  // Success state
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        <Navbar />
        <div style={{ maxWidth: 560, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--green-light)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px" }}>
            <CheckCircle size={40} color="var(--green)" />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-1px", marginBottom: 12 }}>
            Application Submitted
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", lineHeight: 1.7, marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
            Thank you for applying to become a SafeHer mentor. We will review your application and respond to <strong>{form.email}</strong> within 5-7 business days.
          </p>

          <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px 32px", marginBottom: 36, textAlign: "left" }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 16 }}>
              What Happens Next
            </p>
            {[
              { n: "1", title: "Application Review",      desc: "Our team reviews your credentials and experience within 5-7 days." },
              { n: "2", title: "Verification Call",       desc: "We may reach out to verify your professional background." },
              { n: "3", title: "Profile Goes Live",       desc: "Once approved, your profile appears in the mentor directory." },
              { n: "4", title: "Start Helping Women",     desc: "You'll receive session requests via email and can respond directly." },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--purple-light)", color: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                  {s.n}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>{s.title}</p>
                  <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn btn-outline" onClick={() => navigate("/")}>Back to Home</button>
            <button className="btn btn-purple" onClick={() => navigate("/mentors")}>View Mentor Directory</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "clamp(24px, 5vw, 60px) clamp(16px, 4vw, 24px)" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Shield size={26} color="white" />
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "var(--text-1)", letterSpacing: "-1px", marginBottom: 10 }}>
            Become a SafeHer Mentor
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-3)", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
            Share your expertise to help women navigate legal, mental health, career and safety challenges. Your guidance can change lives.
          </p>
        </div>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 0, marginBottom: 8, background: "var(--white)", borderRadius: 16, border: "1.5px solid var(--border)", overflow: "hidden" }}>
          {steps.map((s, i) => {
            const Icon = s.icon
            const isActive   = s.id === step
            const isComplete = s.id < step
            return (
              <div key={s.id} style={{ flex: 1, padding: "14px 8px", textAlign: "center", background: isActive ? "var(--purple)" : isComplete ? "var(--purple-light)" : "var(--white)", borderRight: i < steps.length - 1 ? "1px solid var(--border)" : "none", transition: "all 0.2s" }}>
                <Icon size={16} color={isActive ? "white" : isComplete ? "var(--purple)" : "var(--text-3)"} style={{ margin: "0 auto 4px" }} />
                <p style={{ fontSize: 10, fontWeight: 700, color: isActive ? "white" : isComplete ? "var(--purple)" : "var(--text-3)", letterSpacing: "0.04em" }}>
                  {s.title}
                </p>
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: "var(--border)", borderRadius: 99, marginBottom: 32, overflow: "hidden" }}>
          <div style={{ height: 4, background: "var(--purple)", width: `${progress}%`, borderRadius: 99, transition: "width 0.4s ease" }} />
        </div>

        {/* Form card */}
        <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 24, padding: "clamp(24px, 5vw, 40px)" }}>

          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
              Step {step} of {steps.length} — {steps[step-1].desc}
            </p>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.5px" }}>
              {steps[step-1].title}
            </h2>
          </div>

          {error && (
            <div style={{ display: "flex", gap: 10, padding: "12px 16px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, marginBottom: 24 }}>
              <AlertCircle size={16} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: 13, color: "#991b1b" }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* ── Step 1: Personal Info ── */}
            {step === 1 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={lStyle}>Full Name *</label>
                    <input value={form.fullName} onChange={e => update("fullName", e.target.value)} placeholder="Your full name" style={{ ...iStyle, borderColor: fieldErrors.fullName ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.fullName ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.fullName && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.fullName}</p>}
                  </div>
                  <div>
                    <label style={lStyle}>Gender</label>
                    <select value={form.gender} onChange={e => update("gender", e.target.value)} style={iStyle}>
                      <option value="">Select (optional)</option>
                      <option value="female">Female</option>
                      <option value="male">Male</option>
                      <option value="non-binary">Non-Binary</option>
                      <option value="prefer not to say">Prefer Not To Say</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={lStyle}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" style={{ ...iStyle, borderColor: fieldErrors.email ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.email ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.email && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.email}</p>}
                  </div>
                  <div>
                    <label style={lStyle}>Phone Number *</label>
                    <input type="tel" value={form.phone} onChange={e => update("phone", e.target.value)} placeholder="+91 98765 43210" style={{ ...iStyle, borderColor: fieldErrors.phone ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.phone ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.phone && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.phone}</p>}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={lStyle}>City *</label>
                    <input value={form.city} onChange={e => update("city", e.target.value)} placeholder="Your city" style={{ ...iStyle, borderColor: fieldErrors.city ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.city ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.city && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.city}</p>}
                  </div>
                  <div>
                    <label style={lStyle}>State *</label>
                    <select value={form.state} onChange={e => update("state", e.target.value)} style={{ ...iStyle, borderColor: fieldErrors.state ? "var(--red)" : "var(--border)" }}>
                      <option value="">Select state</option>
                      {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {fieldErrors.state && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.state}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Professional Info ── */}
            {step === 2 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={lStyle}>Professional Title *</label>
                    <input value={form.title} onChange={e => update("title", e.target.value)} placeholder="e.g. Senior Advocate, Clinical Psychologist" style={{ ...iStyle, borderColor: fieldErrors.title ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.title ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.title && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.title}</p>}
                  </div>
                  <div>
                    <label style={lStyle}>Organization <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                    <input value={form.organization} onChange={e => update("organization", e.target.value)} placeholder="Current employer or firm" style={iStyle}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  </div>
                </div>

                <div>
                  <label style={lStyle}>Specialization Area *</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                    {specializations.map(s => (
                      <button key={s.value} type="button" onClick={() => update("specialization", s.value)} style={{
                        padding: "12px 14px", borderRadius: 12, border: "1.5px solid",
                        cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                        background: form.specialization === s.value ? "var(--purple-light)" : "var(--white)",
                        borderColor: form.specialization === s.value ? "var(--purple)" : "var(--border)",
                      }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: form.specialization === s.value ? "var(--purple)" : "var(--text-1)", marginBottom: 3 }}>{s.label}</p>
                        <p style={{ fontSize: 11, color: "var(--text-3)", lineHeight: 1.4 }}>{s.desc}</p>
                      </button>
                    ))}
                  </div>
                  {fieldErrors.specialization && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>{fieldErrors.specialization}</p>}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                  <div>
                    <label style={lStyle}>Years of Experience *</label>
                    <input type="number" value={form.experience} onChange={e => update("experience", e.target.value)} placeholder="e.g. 5" min={0} max={60} style={{ ...iStyle, borderColor: fieldErrors.experience ? "var(--red)" : "var(--border)" }}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = fieldErrors.experience ? "var(--red)" : "var(--border)"} />
                    {fieldErrors.experience && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.experience}</p>}
                  </div>
                  <div>
                    <label style={lStyle}>Qualifications <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                    <input value={form.qualifications} onChange={e => update("qualifications", e.target.value)} placeholder="e.g. LLB, Delhi University" style={iStyle}
                      onFocus={e => e.target.style.borderColor = "var(--purple)"}
                      onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  </div>
                </div>

                <div>
                  <label style={lStyle}>Languages Spoken *</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {languageOptions.map(lang => (
                      <button key={lang} type="button" onClick={() => toggleLanguage(lang)} style={{
                        padding: "7px 14px", borderRadius: 100, fontSize: 13, fontWeight: 600,
                        border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                        background: form.languages.includes(lang) ? "var(--purple)" : "var(--white)",
                        color: form.languages.includes(lang) ? "white" : "var(--text-2)",
                        borderColor: form.languages.includes(lang) ? "var(--purple)" : "var(--border)",
                      }}>
                        {lang}
                      </button>
                    ))}
                  </div>
                  {fieldErrors.languages && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 6 }}>{fieldErrors.languages}</p>}
                </div>

                <div>
                  <label style={lStyle}>Your Bio * <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11, color: "var(--text-3)" }}>({form.bio.length}/100+ characters)</span></label>
                  <textarea value={form.bio} onChange={e => update("bio", e.target.value)} rows={5} placeholder="Tell women why you want to mentor, what your approach is, and what kind of situations you have experience with. Be specific and genuine — this is what women will read before reaching out to you."
                    style={{ ...iStyle, resize: "none", borderColor: fieldErrors.bio ? "var(--red)" : "var(--border)" }}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = fieldErrors.bio ? "var(--red)" : "var(--border)"} />
                  {fieldErrors.bio && <p style={{ fontSize: 11, color: "var(--red)", marginTop: 4 }}>{fieldErrors.bio}</p>}
                </div>
              </div>
            )}

            {/* ── Step 3: Availability ── */}
            {step === 3 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div>
                  <label style={lStyle}>Current Availability *</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      { value: "available",   label: "Available",           desc: "I can accept new session requests now",           color: "#f0fdf4", tc: "#15803d", bc: "#a7f3d0" },
                      { value: "busy",        label: "Busy — Limited",      desc: "I can take a few requests but my schedule is full", color: "#fffbeb", tc: "#92400e", bc: "#fde68a" },
                      { value: "unavailable", label: "Unavailable",         desc: "I'm not available to take requests right now",     color: "#f9fafb", tc: "#374151", bc: "#e5e7eb" },
                    ].map(opt => (
                      <button key={opt.value} type="button" onClick={() => update("availability", opt.value)} style={{
                        padding: "14px 18px", borderRadius: 12, border: `1.5px solid ${form.availability === opt.value ? opt.bc : "var(--border)"}`,
                        background: form.availability === opt.value ? opt.color : "var(--white)",
                        cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14, transition: "all 0.15s"
                      }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${opt.tc}`, background: form.availability === opt.value ? opt.tc : "transparent", flexShrink: 0 }} />
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: opt.tc }}>{opt.label}</p>
                          <p style={{ fontSize: 12, color: "var(--text-3)" }}>{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label style={lStyle}>Hours Available per Week <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <input type="number" value={form.hoursPerWeek} onChange={e => update("hoursPerWeek", e.target.value)} placeholder="e.g. 5" min={1} max={40} style={iStyle}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                  <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 6 }}>This helps users know how quickly to expect a response</p>
                </div>

                {/* What to expect */}
                <div style={{ padding: "20px 24px", background: "var(--purple-light)", borderRadius: 16, border: "1px solid #ddd6fe" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--purple)", marginBottom: 12 }}>How the mentor system works</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      "Women browse your profile in the mentor directory",
                      "They send a session request with their message",
                      "You receive the request at your registered email",
                      "You respond directly to their email",
                      "All communication is tracked in SafeHer's system",
                    ].map((t, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>
                          {i + 1}
                        </div>
                        <p style={{ fontSize: 13, color: "#5b21b6", lineHeight: 1.5 }}>{t}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Online Presence ── */}
            {step === 4 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ padding: "16px 20px", background: "var(--bg-muted)", borderRadius: 14, border: "1px solid var(--border)", marginBottom: 4 }}>
                  <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
                    These links help SafeHer verify your professional background. Both fields are optional but strongly recommended — profiles with LinkedIn verification are marked as "Verified" and appear higher in search results.
                  </p>
                </div>

                <div>
                  <label style={lStyle}>LinkedIn Profile URL <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <input value={form.linkedinUrl} onChange={e => update("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/yourname" style={iStyle}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>

                <div>
                  <label style={lStyle}>Personal / Organization Website <span style={{ fontWeight: 400, textTransform: "none" }}>(optional)</span></label>
                  <input value={form.websiteUrl} onChange={e => update("websiteUrl", e.target.value)} placeholder="https://yourwebsite.com" style={iStyle}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>

                {/* Summary */}
                <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "22px 24px" }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 16 }}>Application Summary</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { label: "Name",           value: form.fullName },
                      { label: "Email",           value: form.email },
                      { label: "Specialization",  value: form.specialization },
                      { label: "Experience",      value: form.experience ? `${form.experience} years` : "" },
                      { label: "City",            value: form.city ? `${form.city}, ${form.state}` : "" },
                      { label: "Languages",       value: form.languages.join(", ") },
                    ].map(f => (
                      <div key={f.label} style={{ padding: "10px 14px", background: "var(--bg-muted)", borderRadius: 8 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 3 }}>{f.label}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: f.value ? "var(--text-1)" : "var(--text-3)" }}>
                          {f.value || "Not provided"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agreement */}
                <div style={{ padding: "14px 18px", background: "#f0fdf4", borderRadius: 12, border: "1px solid #a7f3d0" }}>
                  <p style={{ fontSize: 13, color: "#15803d", lineHeight: 1.6 }}>
                    By submitting this application, you agree to SafeHer's mentor guidelines: maintain confidentiality, respond to requests within 48 hours, and provide guidance in good faith.
                  </p>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 32 }}>
              {step > 1 && (
                <button type="button" onClick={prevStep} style={{ flex: 1, padding: "13px", borderRadius: 12, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 14, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <ChevronLeft size={16} /> Back
                </button>
              )}

              {step < steps.length ? (
                <button type="button" onClick={nextStep} style={{ flex: step === 1 ? 1 : 2, padding: "13px", borderRadius: 12, background: "var(--black)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  Continue <ChevronRight size={16} />
                </button>
              ) : (
                <button type="submit" disabled={submitting} style={{ flex: 2, padding: "13px", borderRadius: 12, background: "var(--purple)", color: "white", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: submitting ? 0.7 : 1, transition: "all 0.2s" }}>
                  <CheckCircle size={16} />
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Already applied? */}
        <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-3)", marginTop: 20 }}>
          Already applied?{" "}
          <a href="/mentors" style={{ color: "var(--purple)", fontWeight: 600, textDecoration: "none" }}>
            View Mentor Directory
          </a>
        </p>
      </div>
    </div>
  )
}