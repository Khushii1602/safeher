// Dashboard.jsx - Main home screen after login
import { useAuth } from "@/context/AuthContext"
import AppLayout from "@/components/layout/AppLayout"
import { useNavigate } from "react-router-dom"

// Quick access feature cards
const features = [
  { icon: "🆘", label: "sos emergency",  path: "/sos",       color: "#fce7f3", border: "#fbcfe8", text: "#be185d" },
  { icon: "🏢", label: "ngo directory",  path: "/ngos",      color: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9" },
  { icon: "👩‍🏫", label: "find a mentor",  path: "/mentors",   color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce" },
  { icon: "⏱️", label: "safety check-in",path: "/checkin",   color: "#f0fdf4", border: "#bbf7d0", text: "#15803d" },
  { icon: "📍", label: "nearby help",    path: "/nearby",    color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" },
  { icon: "🔒", label: "evidence vault", path: "/vault",     color: "#fff7ed", border: "#fed7aa", text: "#c2410c" },
  { icon: "💬", label: "community",      path: "/community", color: "#fdf2f8", border: "#fbcfe8", text: "#9d174d" },
  { icon: "🤖", label: "ai assistant",   path: "/assistant", color: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9" },
]

function Dashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  // Get a friendly name from email (part before @)
  const firstName = currentUser?.displayName?.split(" ")[0]
    || currentUser?.email?.split("@")[0]
    || "there"

  // Greeting based on time of day
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "good morning" : hour < 17 ? "good afternoon" : "good evening"

  return (
    <AppLayout>
      <div className="p-8 max-w-4xl mx-auto">

        {/* Header greeting */}
        <div className="mb-8">
          <p className="text-sm text-purple-400 mb-1">{greeting} 🌸</p>
          <h1 className="text-3xl font-semibold text-purple-800">
            welcome back, {firstName} 💜
          </h1>
          <p className="text-purple-400 text-sm mt-1">
            you are safe here. what would you like to do today?
          </p>
        </div>

        {/* SOS Banner — always prominent */}
        <div
          onClick={() => navigate("/sos")}
          className="w-full mb-8 p-5 rounded-2xl border-2 border-pink-200 cursor-pointer hover:opacity-90 transition-all flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #fce7f3, #ede9fe)" }}>
          <div>
            <p className="text-lg font-semibold text-pink-700">🆘 emergency sos</p>
            <p className="text-sm text-pink-400 mt-0.5">
              tap to alert your emergency contacts instantly
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-pink-100 border-2 border-pink-300 flex items-center justify-center text-2xl">
            🛡️
          </div>
        </div>

        {/* Feature grid */}
        <h2 className="text-sm font-medium text-purple-500 mb-4 uppercase tracking-wider">
          quick access
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <button
              key={f.path}
              onClick={() => navigate(f.path)}
              className="p-4 rounded-2xl border text-left hover:scale-105 transition-all"
              style={{
                background: f.color,
                borderColor: f.border,
              }}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs font-medium" style={{ color: f.text }}>
                {f.label}
              </p>
            </button>
          ))}
        </div>

        {/* Motivational footer */}
        <div className="mt-10 p-4 rounded-2xl bg-purple-50 border border-purple-100 text-center">
          <p className="text-sm text-purple-400 italic">
            "you are braver than you believe, stronger than you seem 💜"
          </p>
        </div>

      </div>
    </AppLayout>
  )
}

export default Dashboard