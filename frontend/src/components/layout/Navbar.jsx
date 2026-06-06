// Navbar.jsx - Top navigation bar for public pages (Home, etc.)
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

function Navbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between border-b border-purple-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">

      {/* Logo */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-base"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          🛡️
        </div>
        <span className="text-base font-semibold text-purple-700">SafeHer</span>
      </div>

      {/* Nav links */}
      <div className="hidden md:flex items-center gap-6 text-sm text-purple-400">
        <button onClick={() => navigate("/#features")} className="hover:text-purple-600 transition-colors">features</button>
        <button onClick={() => navigate("/#stats")}    className="hover:text-purple-600 transition-colors">our impact</button>
        <button onClick={() => navigate("/#about")}    className="hover:text-purple-600 transition-colors">about</button>
      </div>

      {/* CTA */}
      <div className="flex items-center gap-3">
        {currentUser ? (
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            go to dashboard 💜
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-sm font-medium text-purple-600 border border-purple-200 hover:bg-purple-50 transition-all">
              login
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              get started 🌸
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar