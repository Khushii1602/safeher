import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import AppLayout from "@/components/layout/AppLayout"
import {
  AlertTriangle, Building2, Users, Timer,
  MapPin, Lock, MessageSquare, Bot, ArrowRight, Shield
} from "lucide-react"

const features = [
  { icon: AlertTriangle, label: "SOS Emergency",   path: "/sos",       color: "#fef2f2", iconColor: "#dc2626", urgent: true },
  { icon: Building2,     label: "NGO Directory",   path: "/ngos",      color: "#f5f3ff", iconColor: "#7c3aed" },
  { icon: Users,         label: "Find a Mentor",   path: "/mentors",   color: "#eff6ff", iconColor: "#2563eb" },
  { icon: Timer,         label: "Safety Check-in", path: "/checkin",   color: "#f0fdf4", iconColor: "#059669" },
  { icon: MapPin,        label: "Nearby Help",     path: "/nearby",    color: "#fff7ed", iconColor: "#d97706" },
  { icon: Lock,          label: "Evidence Vault",  path: "/vault",     color: "#fdf4ff", iconColor: "#9333ea" },
  { icon: MessageSquare, label: "Community",       path: "/community", color: "#fce7f3", iconColor: "#db2777" },
  { icon: Bot,           label: "AI Assistant",    path: "/assistant", color: "#f5f3ff", iconColor: "#7c3aed" },
]

const quickStats = [
  { label: "NGOs Available",   value: "1,200+", color: "#7c3aed" },
  { label: "Trusted Mentors",  value: "800+",   color: "#2563eb" },
  { label: "Community Posts",  value: "Active", color: "#059669" },
  { label: "Response Time",    value: "< 1 min",color: "#d97706" },
]

export default function Dashboard() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const firstName = currentUser?.displayName?.split(" ")[0]
    || currentUser?.email?.split("@")[0]
    || "there"

  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening"

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl mx-auto animate-fade-in">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-1">{greeting}</p>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            You are safe here. What would you like to do today?
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((s) => (
            <div key={s.label}
              className="bg-white rounded-xl p-4 border border-gray-100"
              style={{ boxShadow: "var(--shadow-sm)" }}>
              <p className="text-2xl font-bold mb-1" style={{ color: s.color }}>
                {s.value}
              </p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* SOS Banner */}
        <div
          onClick={() => navigate("/sos")}
          className="w-full mb-8 p-5 rounded-xl border-2 border-red-200 cursor-pointer hover:border-red-300 hover:shadow-md transition-all flex items-center justify-between bg-white"
          style={{ boxShadow: "var(--shadow-sm)" }}
          role="button"
          aria-label="Open SOS Emergency">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-50">
              <AlertTriangle size={24} color="#dc2626" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-900">SOS Emergency</p>
              <p className="text-sm text-gray-500 mt-0.5">
                Tap to alert your emergency contacts instantly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
            Open
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Feature grid */}
        <div className="mb-8">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.filter(f => !f.urgent).map((f) => {
              const Icon = f.icon
              return (
                <button
                  key={f.path}
                  onClick={() => navigate(f.path)}
                  className="p-4 rounded-xl border border-gray-100 text-left hover:border-violet-200 hover:shadow-md transition-all bg-white group"
                  style={{ boxShadow: "var(--shadow-sm)" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                    style={{ background: f.color }}>
                    <Icon size={20} color={f.iconColor} strokeWidth={2} />
                  </div>
                  <p className="text-sm font-medium text-gray-900">{f.label}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-400 group-hover:text-violet-600 transition-colors">
                    Open <ArrowRight size={10} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Motivational quote */}
        <div className="p-5 rounded-xl border border-violet-100 bg-violet-50 flex items-start gap-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)" }}>
            <Shield size={16} color="white" />
          </div>
          <div>
            <p className="text-sm font-medium text-violet-800 mb-0.5">Daily Reminder</p>
            <p className="text-sm text-violet-600 italic">
              "You are braver than you believe, stronger than you seem, and more loved than you know."
            </p>
          </div>
        </div>

      </div>
    </AppLayout>
  )
}