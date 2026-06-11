import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Shield, Eye, EyeOff, CheckCircle, AlertCircle, X } from "lucide-react"

function generateSuggestions() {
  const adj  = ["Violet","Rose","Lotus","Pearl","Luna","Aurora","Crystal","Amber"]
  const noun = ["Moon","Star","Safe","Hope","Dawn","Bloom","River","Sky"]
  const sym  = ["@","#","!","&"]
  const num  = ["7","9","21","92","2024"]
  return Array.from({length:3},()=>`${adj[Math.floor(Math.random()*adj.length)]}${sym[Math.floor(Math.random()*sym.length)]}${noun[Math.floor(Math.random()*noun.length)]}${num[Math.floor(Math.random()*num.length)]}`)
}

function checkRules(p) {
  return { length: p.length>=8, uppercase: /[A-Z]/.test(p), number: /[0-9]/.test(p), special: /[^A-Za-z0-9]/.test(p) }
}

function getStrength(rules) {
  const n = Object.values(rules).filter(Boolean).length
  if(n===0) return {score:0,label:"",color:""}
  if(n===1) return {score:1,label:"Weak",color:"#dc2626"}
  if(n===2) return {score:2,label:"Fair",color:"#d97706"}
  if(n===3) return {score:3,label:"Good",color:"#6d28d9"}
  return {score:4,label:"Strong",color:"#059669"}
}
import { sendPasswordResetEmail } from "firebase/auth"

function ForgotPassword({ onClose }) {
  const [email, setEmail]   = useState("")
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState("")

  async function handleReset(e) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      await sendPasswordResetEmail(auth, email)
      setSent(true)
    } catch (err) {
      setError("Could not send reset email. Please check the address.")
    }
    setLoading(false)
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}>
      <div style={{ width: "100%", maxWidth: 400, background: "var(--white)", borderRadius: 24, padding: 36, boxShadow: "var(--shadow-lg)" }}>
        {sent ? (
          <div style={{ textAlign: "center" }}>
            <CheckCircle size={48} color="var(--green)" style={{ margin: "0 auto 16px" }} />
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, letterSpacing: "-0.5px" }}>Reset Link Sent</h3>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24, lineHeight: 1.7 }}>
              Check your email for a password reset link. It may take a few minutes to arrive.
            </p>
            <button onClick={onClose} className="btn btn-purple" style={{ minWidth: 140 }}>Done</button>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.5px" }}>Reset Password</h3>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)" }}>
                <X size={20} />
              </button>
            </div>
            <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 24 }}>
              Enter your email and we'll send you a link to reset your password.
            </p>
            {error && <p style={{ fontSize: 13, color: "var(--red)", background: "#fef2f2", padding: "10px 14px", borderRadius: 8, marginBottom: 16 }}>{error}</p>}
            <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="your@email.com"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 14, fontFamily: "inherit", outline: "none", color: "var(--text-1)" }} />
              <button type="submit" disabled={loading} className="btn btn-purple" style={{ width: "100%" }}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
export default function Login() {
  const [isSignup, setIsSignup]   = useState(false)
  const [email, setEmail]         = useState("")
  const [password, setPassword]   = useState("")
  const [showPass, setShowPass]   = useState(false)
  const [error, setError]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [suggestions]             = useState(generateSuggestions())
  const [copiedIdx, setCopied]    = useState(null)
  const navigate = useNavigate()
  const rules    = checkRules(password)
  const [showForgot, setShowForgot] = useState(false)
  const strength = getStrength(rules)

  function applySuggestion(s,i) { setPassword(s); setCopied(i); setTimeout(()=>setCopied(null),1500) }

  async function handleEmailAuth(e) {
    e.preventDefault(); setError("")
    if(isSignup && strength.score < 3) { setError("Please choose a stronger password — at least 3 of 4 rules must be met."); return }
    setLoading(true)
    try {
      if(isSignup) await createUserWithEmailAndPassword(auth,email,password)
      else await signInWithEmailAndPassword(auth,email,password)
      navigate("/onboarding")

    } catch(err) {
      const msgs = {
        "auth/email-already-in-use":"This email is already registered. Try signing in.",
        "auth/wrong-password":"Incorrect password. Please try again.",
        "auth/user-not-found":"No account found with this email.",
        "auth/weak-password":"Password is too weak.",
        "auth/invalid-credential":"Invalid credentials. Please check and try again.",
      }
      setError(msgs[err.code] || err.message)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    setError(""); setLoading(true)
    try { await signInWithPopup(auth,googleProvider); navigate("/dashboard") }
    catch(err) { setError(err.message) }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"var(--bg)" }}>

      {/* Left panel */}
      <div style={{
        display:"none", width:"45%", background:"var(--black)",
        padding:"48px", flexDirection:"column", justifyContent:"space-between",
        position:"relative", overflow:"hidden"
      }} className="lg-flex">

        {/* Background pattern */}
        <div style={{ position:"absolute", inset:0, opacity:0.03, backgroundImage:"radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize:"32px 32px" }} />

        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:64 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"var(--purple)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield size={16} color="white" strokeWidth={2.5} />
            </div>
            <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-0.5px", color:"white" }}>SafeHer</span>
          </div>

          <h1 style={{ fontSize:40, fontWeight:900, letterSpacing:"-2px", color:"white", lineHeight:1.1, marginBottom:20 }}>
            Your safety<br />
            is our<br />
            <span style={{ color:"#a78bfa" }}>priority</span>
          </h1>
          <p style={{ fontSize:15, color:"#9b9b9b", lineHeight:1.7, marginBottom:40, maxWidth:320 }}>
            Join thousands of women who trust SafeHer for emergency support, legal guidance, and community connection.
          </p>

          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {[
              "Emergency SOS with live location sharing",
              "Verified NGO and mentor directory",
              "Anonymous community support",
              "AI-powered safety assistant, Sakhi",
            ].map(item => (
              <div key={item} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <CheckCircle size={16} color="#a78bfa" />
                <span style={{ fontSize:14, color:"#d4d4d4" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize:12, color:"#555", position:"relative" }}>
          Free forever · No data sold · Always private
        </p>
      </div>

      {/* Right panel — form */}
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"48px 32px", overflowY:"auto" }}>
        <div style={{ width:"100%", maxWidth:420 }}>

          {/* Mobile logo */}
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:40 }}>
            <div style={{ width:32, height:32, borderRadius:8, background:"var(--purple)", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <Shield size={16} color="white" />
            </div>
            <span style={{ fontSize:17, fontWeight:800, letterSpacing:"-0.5px", color:"var(--text-1)" }}>
              Safe<span style={{ color:"var(--purple)" }}>Her</span>
            </span>
          </div>

          <h2 style={{ fontSize:26, fontWeight:800, letterSpacing:"-1px", color:"var(--text-1)", marginBottom:6 }}>
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p style={{ fontSize:14, color:"var(--text-3)", marginBottom:32 }}>
            {isSignup ? "Join SafeHer today — completely free." : "Sign in to access your safety dashboard."}
          </p>

          {/* Tabs */}
          <div style={{ display:"flex", background:"var(--bg-muted)", borderRadius:12, padding:4, marginBottom:28 }}>
            {["Sign In","Sign Up"].map((t,i) => (
              <button key={t} onClick={() => { setIsSignup(i===1); setError("") }} style={{
                flex:1, padding:"9px 0", borderRadius:9, fontSize:13, fontWeight:600,
                border:"none", cursor:"pointer", transition:"all 0.2s",
                background: (isSignup ? i===1 : i===0) ? "var(--white)" : "transparent",
                color: (isSignup ? i===1 : i===0) ? "var(--text-1)" : "var(--text-3)",
                boxShadow: (isSignup ? i===1 : i===0) ? "var(--shadow-xs)" : "none",
              }}>
                {t}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div style={{ display:"flex", alignItems:"flex-start", gap:10, padding:"12px 16px", borderRadius:12, marginBottom:20, background:"#fef2f2", border:"1px solid #fecaca" }}>
              <AlertCircle size={16} color="#dc2626" style={{ flexShrink:0, marginTop:1 }} />
              <span style={{ fontSize:13, color:"#991b1b" }}>{error}</span>
            </div>
          )}

          {/* Google */}
          <button onClick={handleGoogleLogin} disabled={loading} style={{
            width:"100%", display:"flex", alignItems:"center", justifyContent:"center", gap:12,
            padding:"12px 20px", borderRadius:12, border:"1.5px solid var(--border-dark)",
            background:"var(--white)", fontSize:14, fontWeight:600, color:"var(--text-1)",
            cursor:"pointer", marginBottom:20, transition:"all 0.15s", fontFamily:"inherit"
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple)"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border-dark)"}>
            <img src="https://www.google.com/favicon.ico" alt="Google" width={18} height={18} />
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
            <span style={{ fontSize:12, color:"var(--text-3)", fontWeight:500 }}>or with email</span>
            <div style={{ flex:1, height:1, background:"var(--border)" }} />
          </div>

          <form onSubmit={handleEmailAuth} style={{ display:"flex", flexDirection:"column", gap:16 }}>

            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text-2)", marginBottom:6 }}>
                Email address
              </label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" className="input" />
            </div>

            <div>
              <label style={{ display:"block", fontSize:13, fontWeight:600, color:"var(--text-2)", marginBottom:6 }}>
                Password
              </label>
              <div style={{ position:"relative" }}>
                <input type={showPass?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min. 8 characters" className="input" style={{ paddingRight:44 }} />
                <button type="button" onClick={()=>setShowPass(!showPass)} style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", display:"flex" }}>
                  {showPass ? <EyeOff size={17}/> : <Eye size={17}/>}
                </button>
              </div>

              {/* Strength */}
              {password.length > 0 && (
                <div style={{ marginTop:10 }}>
                  <div style={{ display:"flex", gap:4, marginBottom:6 }}>
                    {[1,2,3,4].map(i => (
                      <div key={i} style={{ height:3, flex:1, borderRadius:99, transition:"all 0.3s", background: i<=strength.score ? strength.color : "var(--border)" }} />
                    ))}
                  </div>
                  <p style={{ fontSize:12, fontWeight:600, color:strength.color }}>{strength.label}</p>
                </div>
              )}

              {/* Rules */}
              {isSignup && (
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginTop:12 }}>
                  {[{k:"length",l:"8+ characters"},{k:"uppercase",l:"Uppercase letter"},{k:"number",l:"Number"},{k:"special",l:"Special character"}].map(({k,l}) => (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <CheckCircle size={13} color={rules[k] ? "var(--green)" : "var(--border-dark)"} fill={rules[k] ? "var(--green)" : "none"} />
                      <span style={{ fontSize:12, color: rules[k] ? "var(--green)" : "var(--text-3)" }}>{l}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions */}
            {isSignup && (
              <div style={{ padding:"14px 16px", borderRadius:12, background:"var(--bg-muted)", border:"1px solid var(--border)" }}>
                <p style={{ fontSize:12, fontWeight:600, color:"var(--text-2)", marginBottom:10 }}>
                  Suggested strong passwords
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {suggestions.map((s,i) => (
                    <button key={i} type="button" onClick={()=>applySuggestion(s,i)} style={{
                      padding:"6px 12px", borderRadius:8, border:"1.5px solid var(--border-dark)",
                      background:"var(--white)", fontSize:12, fontFamily:"monospace",
                      color:"var(--text-1)", cursor:"pointer", transition:"all 0.15s",
                      fontWeight:500
                    }}
                    onMouseEnter={e=>{ e.currentTarget.style.borderColor="var(--purple)"; e.currentTarget.style.color="var(--purple)" }}
                    onMouseLeave={e=>{ e.currentTarget.style.borderColor="var(--border-dark)"; e.currentTarget.style.color="var(--text-1)" }}>
                      {copiedIdx===i ? "Applied!" : s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-purple" style={{ width:"100%", padding:"13px", marginTop:4 }}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

        {/* Forgot password */}
{!isSignup && (
  <div style={{ textAlign: "right", marginTop: 12 }}>
    <button
      type="button"
      onClick={() => setShowForgot(true)}
      style={{
        background: "none",
        border: "none",
        fontSize: 13,
        color: "var(--purple)",
        cursor: "pointer",
        fontFamily: "inherit"
      }}
    >
      Forgot password?
    </button>
  </div>
)}

<p style={{ textAlign:"center", fontSize:13, color:"var(--text-3)", marginTop:24 }}>
  {isSignup ? "Already have an account?" : "Don't have an account?"}
  <button
    onClick={() => {
      setIsSignup(!isSignup)
      setError("")
    }}
    style={{
      background:"none",
      border:"none",
      cursor:"pointer",
      fontSize:13,
      fontWeight:700,
      color:"var(--purple)",
      marginLeft:6
    }}
  >
    {isSignup ? "Sign In" : "Sign Up"}
  </button>
</p>
         {/* Forgot Password Modal */}
           {showForgot && (
             <ForgotPassword onClose={() => setShowForgot(false)} />
)}
        </div>
      </div>
    </div>
  )
}