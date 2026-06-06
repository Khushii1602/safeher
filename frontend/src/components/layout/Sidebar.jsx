// Sidebar.jsx - The main navigation panel shown after login
// Appears on the left side of every protected page

import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

// Navigation items with emoji icons, labels and their routes
const navItems = [
  { icon: "📊", label: "dashboard",     path: "/dashboard" },
  { icon: "🏢", label: "ngo directory", path: "/ngos"      },
  { icon: "👩‍🏫", label: "mentors",       path: "/mentors"   },
  { icon: "🆘", label: "sos emergency", path: "/sos"       },
  { icon: "⏱️", label: "safety check-in",path: "/checkin"  },
  { icon: "📍", label: "nearby help",   path: "/nearby"    },
  { icon: "🔒", label: "evidence vault",path: "/vault"     },
  { icon: "💬", label: "community",     path: "/community" },
  { icon: "🤖", label: "ai assistant",  path: "/assistant" },
]

function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  // Get first letter of email for avatar
  const avatarLetter = currentUser?.email?.[0]?.toUpperCase() || "U"
  const displayEmail = currentUser?.email || ""

  return (
    <aside className="w-64 min-h-screen flex flex-col border-r border-purple-100 bg-white">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-purple-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            🛡️
          </div>
          <div>
            <p className="text-sm font-semibold text-purple-700">SafeHer</p>
            <p className="text-xs text-purple-300">your safe space 💜</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? "bg-purple-50 text-purple-700 font-medium border border-purple-100"
                  : "text-purple-400 hover:bg-purple-50 hover:text-purple-600"
              }`
            }
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout at the bottom */}
      <div className="px-4 py-4 border-t border-purple-100">

        {/* Avatar + email */}
        <div className="flex items-center gap-3 mb-3 px-1">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            {avatarLetter}
          </div>
          <p className="text-xs text-purple-400 truncate">{displayEmail}</p>
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-xl text-xs font-medium text-pink-500 border border-pink-100 hover:bg-pink-50 transition-all">
          logout 👋
        </button>

      </div>
    </aside>
  )
}

export default Sidebar