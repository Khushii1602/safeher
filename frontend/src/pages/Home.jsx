// Home.jsx - Public landing page for SafeHer
import { useNavigate } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"

// Feature cards data
const features = [
  {
    icon: "🆘",
    title: "sos emergency",
    desc: "one tap sends your live location to emergency contacts and alerts nearby help instantly.",
    color: "#fce7f3", border: "#fbcfe8", text: "#be185d",
  },
  {
    icon: "🏢",
    title: "ngo directory",
    desc: "find verified ngos near you offering legal aid, shelter, counselling and more.",
    color: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9",
  },
  {
    icon: "👩‍🏫",
    title: "trusted mentors",
    desc: "connect with verified seniors and mentors who can guide and support you.",
    color: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce",
  },
  {
    icon: "⏱️",
    title: "safety check-in",
    desc: "set a timer. if you miss a check-in, your emergency contacts are alerted automatically.",
    color: "#f0fdf4", border: "#bbf7d0", text: "#15803d",
  },
  {
    icon: "📍",
    title: "nearby help",
    desc: "instantly find police stations, hospitals, and ngos closest to your location.",
    color: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8",
  },
  {
    icon: "🔒",
    title: "evidence vault",
    desc: "securely store photos, audio, and documents as evidence — private and encrypted.",
    color: "#fff7ed", border: "#fed7aa", text: "#c2410c",
  },
  {
    icon: "💬",
    title: "community",
    desc: "share anonymously, find support, and read stories from survivors and allies.",
    color: "#fdf2f8", border: "#fbcfe8", text: "#9d174d",
  },
  {
    icon: "🤖",
    title: "ai safety assistant",
    desc: "chat with an ai trained to give safety advice, legal info, and emotional support.",
    color: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9",
  },
]

// Stats data
const stats = [
  { number: "50,000+", label: "women supported" },
  { number: "1,200+", label: "verified ngos" },
  { number: "800+",   label: "trusted mentors" },
  { number: "24/7",   label: "emergency support" },
]

// Testimonials
const testimonials = [
  {
    quote: "safeher gave me the courage to reach out for help. the ngo directory connected me with a shelter within minutes.",
    name: "priya s.",
    location: "delhi, india",
  },
  {
    quote: "the sos feature saved me once. my contacts were alerted before i could even make a call.",
    name: "ananya r.",
    location: "mumbai, india",
  },
  {
    quote: "i found my mentor through safeher. she helped me navigate a legal situation i had no idea how to handle.",
    name: "meera k.",
    location: "bangalore, india",
  },
]

function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen"
      style={{ background: "linear-gradient(160deg, #fdf2f8 0%, #faf5ff 50%, #ede9fe 100%)" }}>

      {/* Navbar */}
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 border border-purple-200 text-purple-600 text-xs font-medium mb-8">
          <span>💜</span>
          <span>a safe space built for women, by women</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-purple-900 leading-tight mb-6">
          you deserve to feel{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            safe
          </span>
          {" "}everywhere
        </h1>

        {/* Subheading */}
        <p className="text-lg text-purple-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          safeher connects women with emergency support, verified ngos, trusted mentors,
          legal aid, and a caring community — all in one place. 🌸
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-2xl text-white font-medium text-base transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            get started for free 💜
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-2xl text-purple-600 font-medium text-base border-2 border-purple-200 hover:bg-purple-50 transition-all">
            learn more 🌸
          </button>
        </div>

        {/* Trust note */}
        <p className="text-xs text-purple-300 mt-6">
          free to use · no data sold · always private 🔒
        </p>
      </section>

      {/* ── Stats Section ── */}
      <section id="stats" className="max-w-4xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-6 text-center border border-purple-100">
              <p className="text-3xl font-bold text-purple-700 mb-1">{s.number}</p>
              <p className="text-xs text-purple-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-3">
            everything you need, in one place 🛡️
          </h2>
          <p className="text-purple-400 text-base max-w-xl mx-auto">
            safeher is more than an app — it's a complete safety ecosystem
            designed around your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="p-5 rounded-2xl border transition-all hover:scale-105 cursor-default"
              style={{ background: f.color, borderColor: f.border }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-sm font-semibold mb-1.5" style={{ color: f.text }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: f.text, opacity: 0.75 }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials Section ── */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-purple-900 mb-3">
            stories that matter 💜
          </h2>
          <p className="text-purple-400 text-base">
            real women, real impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white p-6 rounded-2xl border border-purple-100">
              <p className="text-sm text-purple-600 italic leading-relaxed mb-4">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                  {t.name[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-medium text-purple-700">{t.name}</p>
                  <p className="text-xs text-purple-300">{t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA Section ── */}
      <section id="about" className="max-w-3xl mx-auto px-6 pb-24 text-center">
        <div
          className="p-10 rounded-3xl border border-purple-200"
          style={{ background: "linear-gradient(135deg, #fdf2f8, #ede9fe)" }}>
          <h2 className="text-3xl font-bold text-purple-900 mb-4">
            ready to feel safer? 🌸
          </h2>
          <p className="text-purple-400 mb-8 text-base">
            join thousands of women who trust safeher every day.
            it's free, private, and always here for you.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-2xl text-white font-medium text-base transition-all hover:opacity-90 hover:scale-105"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            join safeher today 💜
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-purple-100 bg-white/60 px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center text-sm"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              🛡️
            </div>
            <span className="text-sm font-medium text-purple-700">SafeHer</span>
          </div>
          <p className="text-xs text-purple-300">
            made with 💜 for every woman who deserves to feel safe
          </p>
          <p className="text-xs text-purple-300">
            © 2024 safeher · all rights reserved
          </p>
        </div>
      </footer>

    </div>
  )
}

export default Home