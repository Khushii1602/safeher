import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { profileAPI, emergencyAPI, mentorRequestAPI } from "@/lib/api"
import { User, MapPin, Shield, CheckCircle, Edit2, Save, X, Plus, Trash2, Lock, Clock, MessageSquare, AlertCircle
} from "lucide-react"
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"

const indianStates = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]
const relationships = ["mother","father","sister","brother","friend","partner","other"]

const iStyle = { width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--text-1)", background: "var(--white)", transition: "border-color 0.2s" }
const lStyle = { display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }

function MyRequests({ userId }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!userId) return
    mentorRequestAPI.getUserRequests(userId)
      .then(r => setRequests(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [userId])

  const statusConfig = {
    pending:   { label: "Pending",   color: "#92400e", bg: "#fffbeb", icon: Clock },
    read:      { label: "Read",      color: "#1e40af", bg: "#eff6ff", icon: CheckCircle },
    responded: { label: "Responded", color: "#15803d", bg: "#f0fdf4", icon: MessageSquare },
    declined:  { label: "Declined",  color: "#991b1b", bg: "#fef2f2", icon: AlertCircle },
  }

  if (loading) return null

  return (
    <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px", marginTop: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <MessageSquare size={18} color="var(--purple)" />
        </div>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>My Mentor Requests</h2>
          <p style={{ fontSize: 12, color: "var(--text-3)" }}>{requests.length} request{requests.length !== 1 ? "s" : ""} sent</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <MessageSquare size={32} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>No requests yet</p>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>When you request a mentor session, it will appear here</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map(r => {
            const sc = statusConfig[r.status] || statusConfig.pending
            const Icon = sc.icon
            return (
              <div key={r._id} style={{ padding: "18px 20px", borderRadius: 14, border: "1.5px solid var(--border)", background: "var(--white)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>
                      {r.mentorName}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-3)" }}>
                      {r.specialization} · {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 100, fontSize: 11, fontWeight: 700, background: sc.bg, color: sc.color, flexShrink: 0 }}>
                    <Icon size={10} /> {sc.label}
                  </span>
                </div>

                <p style={{ fontSize: 13, color: "var(--text-2)", lineHeight: 1.6, padding: "10px 14px", background: "var(--bg-muted)", borderRadius: 8, marginBottom: r.response ? 10 : 0 }}>
                  {r.message}
                </p>

                {/* Mentor response */}
                {r.response && (
                  <div style={{ padding: "12px 16px", background: "var(--green-light)", border: "1px solid #a7f3d0", borderRadius: 10, marginTop: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "#065f46", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                      Response from {r.mentorName}
                    </p>
                    <p style={{ fontSize: 13, color: "#047857", lineHeight: 1.6 }}>{r.response}</p>
                    {r.respondedAt && (
                      <p style={{ fontSize: 11, color: "#6ee7b7", marginTop: 6 }}>
                        Responded {new Date(r.respondedAt).toLocaleDateString("en-IN")}
                      </p>
                    )}
                  </div>
                )}

                {/* Pending message */}
                {r.status === "pending" && (
                  <p style={{ fontSize: 12, color: "#92400e", marginTop: 8 }}>
                    Response expected within 24-48 hours at {r.userEmail}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function Profile() {
  const { currentUser } = useAuth()
  const [profile, setProfile]       = useState(null)
  const [contacts, setContacts]     = useState([])
  const [loading, setLoading]       = useState(true)
  const [editing, setEditing]       = useState(false)
  const [saving, setSaving]         = useState(false)
  const [form, setForm]             = useState({})
  const [showAddContact, setShowAC] = useState(false)
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "friend" })
  const [savingContact, setSavingC] = useState(false)
  const [pwForm, setPwForm]         = useState({ current: "", next: "", confirm: "" })
  const [pwMsg, setPwMsg]           = useState("")
  const [pwLoading, setPwLoading]   = useState(false)

  useEffect(() => {
    if (currentUser?.uid) {
      Promise.all([
        profileAPI.get(currentUser.uid).catch(() => null),
        emergencyAPI.getContacts(currentUser.uid).catch(() => ({ data: [] }))
      ]).then(([p, c]) => {
        if (p?.data) { setProfile(p.data); setForm(p.data) }
        setContacts(c.data)
        setLoading(false)
      })
    }
  }, [currentUser])

  function update(k, v) { setForm(p => ({ ...p, [k]: v })) }

  async function saveProfile() {
    setSaving(true)
    try {
      const res = await profileAPI.upsert({ uid: currentUser.uid, ...form })
      setProfile(res.data); setEditing(false)
    } catch {}
    setSaving(false)
  }

  async function addContact(e) {
    e.preventDefault(); setSavingC(true)
    try {
      await emergencyAPI.addContact({ userId: currentUser.uid, ...newContact })
      const res = await emergencyAPI.getContacts(currentUser.uid)
      setContacts(res.data); setNewContact({ name: "", phone: "", relationship: "friend" }); setShowAC(false)
    } catch (err) { alert(err.message) }
    setSavingC(false)
  }

  async function deleteContact(id) {
    if (!confirm("Remove this contact?")) return
    try { await emergencyAPI.deleteContact(id); setContacts(p => p.filter(c => c._id !== id)) } catch {}
  }

  async function changePassword(e) {
    e.preventDefault()
    if (pwForm.next !== pwForm.confirm) { setPwMsg("Passwords do not match"); return }
    if (pwForm.next.length < 8) { setPwMsg("Password must be at least 8 characters"); return }
    setPwLoading(true); setPwMsg("")
    try {
      const cred = EmailAuthProvider.credential(currentUser.email, pwForm.current)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, pwForm.next)
      setPwMsg("success"); setPwForm({ current: "", next: "", confirm: "" })
    } catch { setPwMsg("Current password is incorrect") }
    setPwLoading(false)
  }

  const completedFields = profile ? ["fullName","gender","city","state","occupation"].filter(f => profile[f]).length : 0
  const completionPct = Math.round((completedFields / 5) * 100)

  if (loading) return <AppLayout><div style={{ padding: 48, textAlign: "center" }}><p style={{ color: "var(--text-3)" }}>Loading profile...</p></div></AppLayout>

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 6 }}>My Profile</h1>
          <p style={{ fontSize: 14, color: "var(--text-3)" }}>Manage your personal information, emergency contacts, and account security.</p>
        </div>

        {/* Profile completion */}
        <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "24px 28px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 2 }}>Profile Completion</p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>{completionPct}% complete — {completionPct < 100 ? "add more details to improve your experience" : "your profile is complete"}</p>
            </div>
            <p style={{ fontSize: 28, fontWeight: 900, color: completionPct === 100 ? "var(--green)" : "var(--purple)", letterSpacing: "-1px" }}>
              {completionPct}%
            </p>
          </div>
          <div style={{ height: 6, background: "var(--border)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: 6, borderRadius: 99, background: completionPct === 100 ? "var(--green)" : "var(--purple)", width: `${completionPct}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>

        {/* Personal Info */}
        <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <User size={18} color="var(--purple)" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Personal Information</h2>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>Your basic profile details</p>
              </div>
            </div>
            {!editing ? (
              <button onClick={() => setEditing(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 13, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <Edit2 size={14} /> Edit
              </button>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => { setEditing(false); setForm(profile || {}) }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 13, fontWeight: 600, color: "var(--text-2)", cursor: "pointer" }}>
                  <X size={14} /> Cancel
                </button>
                <button onClick={saveProfile} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 10, background: "var(--purple)", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", opacity: saving ? 0.7 : 1 }}>
                  <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            )}
          </div>

          {editing ? (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { k: "fullName", label: "Full Name", type: "text", placeholder: "Your full name" },
                { k: "age", label: "Age", type: "number", placeholder: "Your age" },
                { k: "occupation", label: "Occupation", type: "text", placeholder: "Your occupation" },
                { k: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
              ].map(f => (
                <div key={f.k}>
                  <label style={lStyle}>{f.label}</label>
                  <input type={f.type} value={form[f.k] || ""} onChange={e => update(f.k, e.target.value)} placeholder={f.placeholder} style={iStyle}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <div>
                <label style={lStyle}>Gender</label>
                <select value={form.gender || ""} onChange={e => update("gender", e.target.value)} style={iStyle}>
                  <option value="">Select gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-Binary</option>
                  <option value="prefer not to say">Prefer Not To Say</option>
                </select>
              </div>
              <div>
                <label style={lStyle}>City</label>
                <input type="text" value={form.city || ""} onChange={e => update("city", e.target.value)} placeholder="Your city" style={iStyle}
                  onFocus={e => e.target.style.borderColor = "var(--purple)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"} />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <label style={lStyle}>State</label>
                <select value={form.state || ""} onChange={e => update("state", e.target.value)} style={iStyle}>
                  <option value="">Select state</option>
                  {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "Full Name",   value: profile?.fullName },
                { label: "Age",         value: profile?.age },
                { label: "Gender",      value: profile?.gender },
                { label: "Occupation",  value: profile?.occupation },
                { label: "City",        value: profile?.city },
                { label: "State",       value: profile?.state },
                { label: "Email",       value: currentUser?.email },
                { label: "Phone",       value: profile?.phone },
              ].map(f => (
                <div key={f.label} style={{ padding: "14px 16px", borderRadius: 10, background: "var(--bg-muted)" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{f.label}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: f.value ? "var(--text-1)" : "var(--text-3)" }}>
                    {f.value || "Not set"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Contacts */}
        <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={18} color="#dc2626" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Emergency Contacts</h2>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>{contacts.length} of 5 contacts added</p>
              </div>
            </div>
            {contacts.length < 5 && (
              <button onClick={() => setShowAC(!showAddContact)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: showAddContact ? "var(--purple)" : "var(--white)", color: showAddContact ? "white" : "var(--text-2)", border: "1.5px solid var(--border)", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
                {showAddContact ? <><X size={14} /> Cancel</> : <><Plus size={14} /> Add Contact</>}
              </button>
            )}
          </div>

          {showAddContact && (
            <form onSubmit={addContact} style={{ background: "var(--bg-muted)", borderRadius: 14, padding: 20, marginBottom: 20, display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 12, alignItems: "flex-end" }}>
              <div>
                <label style={lStyle}>Name</label>
                <input required value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})} placeholder="Contact name" style={iStyle} />
              </div>
              <div>
                <label style={lStyle}>Phone</label>
                <input required type="tel" value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})} placeholder="+91 98765 43210" style={iStyle} />
              </div>
              <div>
                <label style={lStyle}>Relationship</label>
                <select value={newContact.relationship} onChange={e => setNewContact({...newContact, relationship: e.target.value})} style={iStyle}>
                  {relationships.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>
              <button type="submit" disabled={savingContact} style={{ padding: "11px 16px", borderRadius: 10, background: "var(--purple)", color: "white", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
                {savingContact ? "..." : "Add"}
              </button>
            </form>
          )}

          {contacts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <Shield size={32} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-1)", marginBottom: 4 }}>No emergency contacts yet</p>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>Add trusted people who can help in an emergency</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {contacts.map(c => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", borderRadius: 12, background: "var(--bg-muted)", border: "1px solid var(--border)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--purple)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)" }}>{c.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text-3)" }}>{c.relationship} · {c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => deleteContact(c._id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 8, borderRadius: 8, transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "var(--red)" }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-3)" }}>
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Change Password */}
        {currentUser?.providerData?.[0]?.providerId === "password" && (
          <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-muted)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Lock size={18} color="var(--text-2)" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Account Security</h2>
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>Change your password</p>
              </div>
            </div>

            <form onSubmit={changePassword} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              {[
                { k: "current", label: "Current Password", placeholder: "Current password" },
                { k: "next",    label: "New Password",     placeholder: "Min. 8 characters" },
                { k: "confirm", label: "Confirm Password", placeholder: "Repeat new password" },
              ].map(f => (
                <div key={f.k}>
                  <label style={lStyle}>{f.label}</label>
                  <input type="password" value={pwForm[f.k]} onChange={e => setPwForm(p => ({...p, [f.k]: e.target.value}))} placeholder={f.placeholder} style={iStyle}
                    onFocus={e => e.target.style.borderColor = "var(--purple)"}
                    onBlur={e => e.target.style.borderColor = "var(--border)"} />
                </div>
              ))}
              <div style={{ gridColumn: "1/-1", display: "flex", alignItems: "center", gap: 16 }}>
                <button type="submit" disabled={pwLoading} className="btn btn-purple">
                  {pwLoading ? "Updating..." : "Update Password"}
                </button>
                {pwMsg && (
                  <p style={{ fontSize: 13, color: pwMsg === "success" ? "var(--green)" : "var(--red)", fontWeight: 600 }}>
                    {pwMsg === "success" ? "Password updated successfully" : pwMsg}
                  </p>
                )}
              </div>
            </form>
          </div>
        )}
{/* My Mentor Requests */}
<MyRequests userId={currentUser?.uid} />
      </div>
    </AppLayout>
  )
}