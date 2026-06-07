import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Shield, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"

function generateSuggestions() {
  const adj  = ["Violet", "Rose", "Lotus", "Pearl", "Luna", "Aurora", "Crystal", "Amber"]
  const noun = ["Moon", "Star", "Safe", "Hope", "Dawn", "Bloom", "River", "Sky"]
  const sym  = ["@", "#", "!", "&"]
  const num  = ["7", "9", "21", "92", "2024"]
  return Array.from({ length: 3 }, () => {
    return `${adj[Math.floor(Math.random()*adj.length)]}${sym[Math.floor(Math.random()*sym.length)]}${noun[Math.floor(Math.random()*noun.length)]}${num[Math.floor(Math.random()*num.length)]}`
  })
}

function checkRules(password) {
  return {
    length:    password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number:    /[0-9]/.test(password),
    special:   /[^A-Za-z0-9]/.test(password),
  }
}

function getStrength(rules) {
  const passed = Object.values(rules).filter(Boolean).length
  if (passed === 0) return { score: 0, label: "",         color: "" }
  if (passed === 1) return { score: 1, label: "Weak",     color: "#dc2626" }
  if (passed === 2) return { score: 2, label: "Fair",     color: "#d97706" }
  if (passed === 3) return { score: 3, label: "Good",     color: "#7c3aed" }
  return              { score: 4, label: "Strong",   color: "#059669" }
}

export default function Login() {
  const [isSignup, setIsSignup]     = useState(false)
  const [email, setEmail]           = useState("")
  const [password, setPassword]     = useState("")
  const [showPass, setShowPass]     = useState(false)
  const [error, setError]           = useState("")
  const [loading, setLoading]       = useState(false)
  const [suggestions]               = useState(generateSuggestions())
  const [copiedIndex, setCopied]    = useState(null)

  const navigate = useNavigate()
  const rules    = checkRules(password)
  const strength = getStrength(rules)

  function applySuggestion(s, i) {
    setPassword(s)
    setCopied(i)
    setTimeout(() => setCopied(null), 1500)
  }

  async function handleEmailAuth(e) {
    e.preventDefault()
    setError("")
    if (isSignup && strength.score < 3) {
      setError("Please choose a stronger password — at least 3 of 4 rules must be met.")
      return
    }
    setLoading(true)
    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      navigate("/dashboard")
    } catch (err) {
      const msgs = {
        "auth/email-already-in-use": "This email is already registered. Try signing in.",
        "auth/wrong-password":       "Incorrect password. Please try again.",
        "auth/user-not-found":       "No account found with this email.",
        "auth/weak-password":        "Password is too weak. Please make it stronger.",
        "auth/invalid-credential":   "Invalid credentials. Please check and try again.",
      }
      setError(msgs[err.code] || err.message)
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    setError("")
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--background)" }}>

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white"
        style={{ background: "var(--primary)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Shield size={16} color="white" />
          </div>
          <span className="text-base font-semibold">SafeHer</span>
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight mb-6">
            Your safety is our{" "}
            <span className="text-violet-200">priority</span>
          </h1>
          <p className="text-violet-200 text-base leading-relaxed mb-10">
            Join thousands of women who trust SafeHer for emergency support,
            legal guidance, and community connection.
          </p>
          <div className="space-y-4">
            {[
              "Emergency SOS with live location sharing",
              "Verified NGO and mentor directory",
              "Anonymous community support",
              "AI-powered safety assistant",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={16} className="text-violet-300 flex-shrink-0" />
                <span className="text-sm text-violet-100">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-violet-300">
          Free forever · No data sold · Always private
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--primary)" }}>
              <Shield size={16} color="white" />
            </div>
            <span className="text-base font-semibold text-gray-900">SafeHer</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            {isSignup
              ? "Join SafeHer today — it's completely free."
              : "Sign in to access your safety dashboard."}
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg mb-5 text-sm"
              style={{ background: "var(--danger-light)", color: "var(--danger)", border: "1px solid #fecaca" }}>
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          {/* Google */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all mb-5 disabled:opacity-50">
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium">or with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <form onSubmit={handleEmailAuth} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm bg-white border border-gray-200 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition-all text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="h-1 flex-1 rounded-full transition-all"
                        style={{ background: i <= strength.score ? strength.color : "#e5e7eb" }} />
                    ))}
                  </div>
                  <p className="text-xs font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}

              {/* Rules */}
              {isSignup && (
                <div className="grid grid-cols-2 gap-1.5 mt-3">
                  {[
                    { key: "length",    label: "8+ characters" },
                    { key: "uppercase", label: "Uppercase letter" },
                    { key: "number",    label: "Number" },
                    { key: "special",   label: "Special character" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-1.5">
                      <CheckCircle
                        size={12}
                        color={rules[key] ? "var(--success)" : "#d1d5db"}
                        fill={rules[key] ? "var(--success)" : "none"}
                      />
                      <span className="text-xs" style={{ color: rules[key] ? "var(--success)" : "#9ca3af" }}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Suggestions */}
            {isSignup && (
              <div className="p-3 rounded-xl border border-gray-100 bg-gray-50">
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Suggested strong passwords
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s, i) => (
                    <button key={i} type="button" onClick={() => applySuggestion(s, i)}
                      className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition-all">
                      {copiedIndex === i ? "Applied!" : s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-98 disabled:opacity-50"
              style={{ background: "var(--primary)", boxShadow: "0 4px 14px rgba(124,58,237,0.25)" }}>
              {loading ? "Please wait..." : isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isSignup ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => { setIsSignup(!isSignup); setError("") }}
              className="ml-1 font-semibold hover:underline"
              style={{ color: "var(--primary)" }}>
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}