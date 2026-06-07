import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import {
  Shield, LayoutDashboard, Building2, Users, AlertTriangle,
  Timer, MapPin, Lock, MessageSquare, Bot, LogOut, ChevronRight
} from "lucide-react"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",      path: "/dashboard" },
  { icon: Building2,       label: "NGO Directory",  path: "/ngos"      },
  { icon: Users,           label: "Mentors",         path: "/mentors"   },
  { icon: AlertTriangle,   label: "SOS Emergency",  path: "/sos"       },
  { icon: Timer,           label: "Safety Check-in",path: "/checkin"   },
  { icon: MapPin,          label: "Nearby Help",    path: "/nearby"    },
  { icon: Lock,            label: "Evidence Vault", path: "/vault"     },
  { icon: MessageSquare,   label: "Community",      path: "/community" },
  { icon: Bot,             label: "AI Assistant",   path: "/assistant" },
]

export default function Sidebar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate("/login")
  }

  const initials = currentUser?.displayName
    ? currentUser.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : currentUser?.email?.[0]?.toUpperCase() || "U"

  return (
    <aside className="w-60 min-h-screen flex flex-col bg-white border-r border-gray-100">

      {/* Logo */}
      <div className="h-16 px-5 flex items-center border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)" }}>
            <Shield size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-semibold text-gray-900 tracking-tight">
            Safe<span style={{ color: "var(--primary)" }}>Her</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                  isActive
                    ? "text-violet-700 bg-violet-50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`
              }>
              {({ isActive }) => (
                <>
                  <Icon
                    size={18}
                    strokeWidth={isActive ? 2.5 : 2}
                    color={isActive ? "var(--primary)" : "currentColor"}
                  />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <ChevronRight size={14} color="var(--primary)" />
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ background: "var(--primary)" }}>
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {currentUser?.displayName || "My Account"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all">
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}