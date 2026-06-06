import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"

// Password suggestion generator
function generateSuggestions() {
  const adjectives = ["Violet", "Rose", "Lotus", "Pearl", "Luna", "Aurora", "Sakura", "Crystal"]
  const nouns = ["Moon", "Star", "Safe", "Hope", "Dawn", "Bloom", "Mist", "Sky"]
  const symbols = ["@", "#", "!", "&", "*"]
  const nums = ["7", "9", "21", "92", "2024", "108"]

  return Array.from({ length: 3 }, () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
    const noun = nouns[Math.floor(Math.random() * nouns.length)]
    const sym = symbols[Math.floor(Math.random() * symbols.length)]
    const num = nums[Math.floor(Math.random() * nums.length)]
    return `${adj}${sym}${noun}${num}`
  })
}

// Check each password rule
function checkRules(password) {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  }
}

// Calculate strength 0-4 based on rules passed
function getStrength(rules) {
  const passed = Object.values(rules).filter(Boolean).length
  if (passed === 0) return { score: 0, label: "", color: "" }
  if (passed === 1) return { score: 1, label: "weak 🙈", color: "#f472b6" }
  if (passed === 2) return { score: 2, label: "fair 🌸", color: "#c084fc" }
  if (passed === 3) return { score: 3, label: "good 💜", color: "#a855f7" }
  return { score: 4, label: "strong ✨", color: "#7c3aed" }
}

function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestions] = useState(generateSuggestions())
  const [copiedIndex, setCopiedIndex] = useState(null)

  const navigate = useNavigate()
  const rules = checkRules(password)
  const strength = getStrength(rules)

  // Copy suggestion into password field
  function applySuggestion(suggestion, index) {
    setPassword(suggestion)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 1500)
  }

  async function handleEmailAuth(e) {
    e.preventDefault()
    setError("")

    // Block submission if signing up with a weak password
    if (isSignup && strength.score < 3) {
      setError("please choose a stronger password 💜 (need 3 of 4 rules met)")
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
      // Make Firebase errors friendlier
      const msg = err.code === "auth/email-already-in-use"
        ? "this email is already registered 🌸 try logging in!"
        : err.code === "auth/wrong-password"
        ? "wrong password, love 💜 try again"
        : err.code === "auth/user-not-found"
        ? "no account found with this email 🌸"
        : err.code === "auth/weak-password"
        ? "password is too weak 💜 please make it stronger"
        : err.message
      setError(msg)
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
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 40%, #ede9fe 100%)" }}>

      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-purple-100"
        style={{ boxShadow: "0 8px 40px rgba(168,85,247,0.10)" }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            🛡️
          </div>
          <h1 className="text-2xl font-semibold text-purple-700">SafeHer</h1>
          <p className="text-sm text-purple-300 mt-1">your safe space, always 💜</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-purple-50 rounded-xl p-1 mb-6 border border-purple-100">
          <button
            onClick={() => { setIsSignup(false); setError("") }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              !isSignup
                ? "bg-white text-purple-700 border border-purple-200"
                : "text-purple-400 hover:text-purple-600"
            }`}>
            login
          </button>
          <button
            onClick={() => { setIsSignup(true); setError("") }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              isSignup
                ? "bg-white text-purple-700 border border-purple-200"
                : "text-purple-400 hover:text-purple-600"
            }`}>
            sign up
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-pink-50 text-pink-600 text-sm p-3 rounded-xl mb-4 border border-pink-100">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-purple-600 mb-1.5 tracking-wide">
              email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-purple-900 border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-purple-600 mb-1.5 tracking-wide">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="min. 8 characters"
              className="w-full px-4 py-2.5 rounded-xl text-sm text-purple-900 border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200"
            />

            {/* Strength bar — only show when typing */}
            {password.length > 0 && (
              <div className="mt-2">
                <div className="flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all"
                      style={{
                        background: i <= strength.score ? strength.color : "#e9d5ff"
                      }} />
                  ))}
                </div>
                <p className="text-xs" style={{ color: strength.color }}>
                  strength: {strength.label}
                </p>
              </div>
            )}

            {/* Password rules — only show on signup */}
            {isSignup && (
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                {[
                  { key: "length",    label: "8+ characters" },
                  { key: "uppercase", label: "uppercase letter" },
                  { key: "number",    label: "number" },
                  { key: "special",   label: "special character" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full transition-all"
                      style={{ background: rules[key] ? "#a855f7" : "#ddd6fe" }} />
                    <span className="text-xs transition-all"
                      style={{ color: rules[key] ? "#a855f7" : "#c4b5fd" }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Suggested passwords — only on signup */}
          {isSignup && (
            <div className="bg-purple-50 rounded-xl p-3 border border-purple-100">
              <p className="text-xs font-medium text-purple-600 mb-2">
                ✨ suggested strong passwords — click to use
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => applySuggestion(s, i)}
                    className="px-3 py-1 bg-white border border-purple-200 rounded-full text-xs font-mono text-purple-700 hover:bg-purple-100 transition-all"
                  >
                    {copiedIndex === i ? "✓ applied!" : s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl text-white text-sm font-medium transition-all hover:opacity-90 active:scale-95"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            {loading ? "please wait 💜" : isSignup ? "create my account 🌸" : "login to safeher 💜"}
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-purple-100" />
          <span className="text-xs text-purple-300">or continue with</span>
          <div className="flex-1 h-px bg-purple-100" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-sm font-medium text-purple-700 border-2 border-purple-100 bg-white hover:bg-purple-50 transition-all flex items-center justify-center gap-2">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          continue with google
        </button>

      </div>
    </div>
  )
}

export default Login