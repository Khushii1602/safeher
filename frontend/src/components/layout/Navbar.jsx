import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Shield, Menu, X } from "lucide-react"
import { useState } from "react"

export default function Navbar() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100"
      style={{ boxShadow: "var(--shadow-sm)" }}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--primary)" }}>
            <Shield size={16} color="white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-700 text-gray-900 tracking-tight">
            Safe<span style={{ color: "var(--primary)" }}>Her</span>
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "#features" },
            { label: "Our Impact", href: "#stats" },
            { label: "About", href: "#about" },
          ].map((item) => (
            <a key={item.label} href={item.href}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-lg text-sm font-600 text-white"
              style={{ background: "var(--primary)" }}>
              Go to Dashboard
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg text-sm font-500 text-gray-700 hover:bg-gray-100">
                Sign In
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 rounded-lg text-sm font-600 text-white"
                style={{ background: "var(--primary)" }}>
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 space-y-3 animate-fade-in">
          {["Features", "Our Impact", "About"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(" ", "")}`}
              className="block text-sm text-gray-600 hover:text-gray-900 py-1">
              {item}
            </a>
          ))}
          <div className="pt-3 border-t border-gray-100 flex flex-col gap-2">
            <button onClick={() => navigate("/login")}
              className="w-full py-2 rounded-lg text-sm font-500 text-gray-700 border border-gray-200 hover:bg-gray-50">
              Sign In
            </button>
            <button onClick={() => navigate("/login")}
              className="w-full py-2 rounded-lg text-sm font-600 text-white"
              style={{ background: "var(--primary)" }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  )
}