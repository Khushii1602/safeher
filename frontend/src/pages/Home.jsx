import { useNavigate } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import {
  Shield, AlertTriangle, Building2, Users, Timer,
  MapPin, Lock, MessageSquare, Bot, ArrowRight,
  CheckCircle, Phone, Heart, Star
} from "lucide-react"

const features = [
  {
    icon: AlertTriangle,
    title: "SOS Emergency",
    desc: "One tap sends your live location to emergency contacts and alerts nearby help instantly.",
    color: "#fef2f2", iconColor: "#dc2626",
  },
  {
    icon: Building2,
    title: "NGO Directory",
    desc: "Find verified NGOs near you offering legal aid, shelter, counselling and more.",
    color: "#f5f3ff", iconColor: "#7c3aed",
  },
  {
    icon: Users,
    title: "Trusted Mentors",
    desc: "Connect with verified seniors and mentors who can guide and support you.",
    color: "#eff6ff", iconColor: "#2563eb",
  },
  {
    icon: Timer,
    title: "Safety Check-in",
    desc: "Set a timer. If you miss a check-in, your emergency contacts are alerted automatically.",
    color: "#f0fdf4", iconColor: "#059669",
  },
  {
    icon: MapPin,
    title: "Nearby Help",
    desc: "Instantly find police stations, hospitals, and NGOs closest to your location.",
    color: "#fff7ed", iconColor: "#d97706",
  },
  {
    icon: Lock,
    title: "Evidence Vault",
    desc: "Securely store photos, audio, and documents as evidence — private and encrypted.",
    color: "#fdf4ff", iconColor: "#9333ea",
  },
  {
    icon: MessageSquare,
    title: "Community",
    desc: "Share anonymously, find support, and read stories from survivors and allies.",
    color: "#fce7f3", iconColor: "#db2777",
  },
  {
    icon: Bot,
    title: "AI Safety Assistant",
    desc: "Chat with an AI trained to give safety advice, legal info, and emotional support.",
    color: "#f5f3ff", iconColor: "#7c3aed",
  },
]

const stats = [
  { number: "50,000+", label: "Women Supported", icon: Heart },
  { number: "1,200+",  label: "Verified NGOs",   icon: Building2 },
  { number: "800+",    label: "Trusted Mentors",  icon: Users },
  { number: "24/7",    label: "Always Available", icon: Shield },
]

const steps = [
  { step: "01", title: "Create Your Account", desc: "Sign up in seconds with your email or Google account. No personal details required beyond the basics." },
  { step: "02", title: "Set Up Your Safety Net", desc: "Add emergency contacts, set your preferences, and explore resources available in your area." },
  { step: "03", title: "Access Help Anytime", desc: "Use the SOS button, find nearby NGOs, chat with Sakhi our AI assistant, or connect with a mentor." },
]

const testimonials = [
  { quote: "SafeHer connected me with a shelter within minutes. The NGO directory is incredibly detailed and trustworthy.", name: "Priya S.", location: "Delhi, India" },
  { quote: "The SOS feature alerted my contacts before I could even make a call. This app genuinely saved me.", name: "Ananya R.", location: "Mumbai, India" },
  { quote: "I found my mentor through SafeHer. She helped me navigate a legal situation I had no idea how to handle.", name: "Meera K.", location: "Bangalore, India" },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8 border"
            style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "#ddd6fe" }}>
            <Shield size={12} />
            Built for women, by women
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            You deserve to feel{" "}
            <span style={{ color: "var(--primary)" }}>safe</span>{" "}
            everywhere
          </h1>

          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            SafeHer connects women with emergency support, verified NGOs, trusted mentors,
            legal aid, and a caring community — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ background: "var(--primary)", boxShadow: "0 4px 14px rgba(124,58,237,0.35)" }}>
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-gray-700 border border-gray-200 hover:bg-white hover:border-gray-300 transition-all">
              Learn More
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
            {["Free to use", "No data sold", "Always private", "Verified NGOs"].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <CheckCircle size={12} style={{ color: "var(--success)" }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="border-y border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="text-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: "var(--primary-light)" }}>
                    <Icon size={20} style={{ color: "var(--primary)" }} />
                  </div>
                  <p className="text-3xl font-bold text-gray-900 mb-1">{s.number}</p>
                  <p className="text-sm text-gray-500">{s.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need, in one place
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            SafeHer is more than an app — it's a complete safety ecosystem
            designed around your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => {
            const Icon = f.icon
            return (
              <div key={f.title}
                className="bg-white rounded-xl p-5 border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all group cursor-default"
                style={{ boxShadow: "var(--shadow-sm)" }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: f.color }}>
                  <Icon size={20} color={f.iconColor} strokeWidth={2} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-gray-500">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <div key={s.step} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gray-200" />
                )}
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-xl font-bold text-white"
                  style={{ background: "var(--primary)" }}>
                  {s.step}
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Stories That Matter</h2>
          <p className="text-gray-500">Real women, real impact.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name}
              className="bg-white rounded-xl p-6 border border-gray-100"
              style={{ boxShadow: "var(--shadow-sm)" }}>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-5 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white"
                  style={{ background: "var(--primary)" }}>
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="max-w-6xl mx-auto px-6 pb-24">
        <div className="rounded-2xl p-12 text-center text-white"
          style={{ background: "var(--primary)" }}>
          <h2 className="text-3xl font-bold mb-4">Ready to Feel Safer?</h2>
          <p className="text-violet-200 mb-8 max-w-lg mx-auto">
            Join thousands of women who trust SafeHer every day.
            Free, private, and always here for you.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold bg-white hover:bg-violet-50 transition-all"
            style={{ color: "var(--primary)" }}>
            Join SafeHer Today
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: "var(--primary)" }}>
              <Shield size={12} color="white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">SafeHer</span>
          </div>
          <p className="text-xs text-gray-400">
            Made with care for every woman who deserves to feel safe
          </p>
          <p className="text-xs text-gray-400">
            © 2024 SafeHer. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}