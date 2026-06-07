import { useNavigate } from "react-router-dom"
import Navbar from "@/components/layout/Navbar"
import {
  Shield, AlertTriangle, Building2, Users, Timer,
  MapPin, Lock, MessageSquare, Bot, ArrowRight,
  CheckCircle, Star, Phone
} from "lucide-react"

const features = [
  { icon: AlertTriangle, title: "SOS Emergency",    desc: "One tap sends your live location to trusted contacts and alerts nearby help.", color: "#fff5f5", ic: "#dc2626" },
  { icon: Building2,     title: "NGO Directory",    desc: "Browse 1,200+ verified NGOs offering legal aid, shelter, and counselling.", color: "#f5f3ff", ic: "#6d28d9" },
  { icon: Users,         title: "Trusted Mentors",  desc: "Connect with verified mentors for legal, career, and emotional guidance.", color: "#eff6ff", ic: "#2563eb" },
  { icon: Timer,         title: "Safety Check-in",  desc: "Set a timer. If you miss it, your contacts are automatically alerted.", color: "#f0fdf4", ic: "#059669" },
  { icon: MapPin,        title: "Nearby Help",      desc: "Find police stations, hospitals, and NGOs closest to your location.", color: "#fffbeb", ic: "#d97706" },
  { icon: Lock,          title: "Evidence Vault",   desc: "Securely store photos, audio, and documents — only you can access them.", color: "#fdf4ff", ic: "#9333ea" },
  { icon: MessageSquare, title: "Community",        desc: "Share anonymously, find support, and connect with survivors and allies.", color: "#fff0f6", ic: "#db2777" },
  { icon: Bot,           title: "AI Assistant",     desc: "Sakhi gives safety advice, legal information, and emotional support 24/7.", color: "#f5f3ff", ic: "#6d28d9" },
]

const testimonials = [
  { quote: "SafeHer connected me with a shelter within minutes. The NGO directory is incredibly detailed.", name: "Priya S.", city: "Delhi" },
  { quote: "The SOS feature alerted my contacts before I could make a call. It genuinely saved me.", name: "Ananya R.", city: "Mumbai" },
  { quote: "My mentor helped me navigate a legal situation I had no idea how to handle. Truly life-changing.", name: "Meera K.", city: "Bangalore" },
]

const steps = [
  { n: "01", title: "Create Your Account",    desc: "Sign up in seconds. No complicated forms, just your email or Google." },
  { n: "02", title: "Set Up Your Safety Net", desc: "Add emergency contacts, explore NGOs, and set your preferences." },
  { n: "03", title: "Access Help Instantly",  desc: "Use SOS, find nearby help, or chat with Sakhi — anytime, anywhere." },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left */}
          <div className="anim-fade-up">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "var(--purple-light)", color: "var(--purple)",
              padding: "6px 14px", borderRadius: 100,
              fontSize: 11, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 28
            }}>
              <Shield size={11} /> Women's Safety Platform
            </div>

            <h1 className="t-display" style={{ marginBottom: 20 }}>
              Safety is a{" "}
              <span style={{ color: "var(--purple)", fontStyle: "italic" }}>right</span>,
              <br />not a privilege
            </h1>

            <p className="t-body" style={{ fontSize: 17, maxWidth: 440, marginBottom: 36, lineHeight: 1.7 }}>
              Connect with verified NGOs, trusted mentors, emergency support
              and a caring community — everything you need, beautifully designed.
            </p>

            <div style={{ display: "flex", gap: 12, marginBottom: 40 }}>
              <button className="btn btn-purple btn-lg" onClick={() => navigate("/login")}>
                Get Started Free <ArrowRight size={16} />
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => navigate("/login")}>
                See Features
              </button>
            </div>

            <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
              {["Free forever", "No data sold", "Always private"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--text-3)" }}>
                  <CheckCircle size={13} color="var(--green)" />
                  {t}
                </div>
              ))}
            </div>
          </div>

          {/* Right — visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* SOS card */}
            <div style={{
              background: "var(--black)", borderRadius: 20,
              padding: "20px 24px",
              display: "flex", alignItems: "center", justifyContent: "space-between"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "#dc2626",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <AlertTriangle size={22} color="white" />
                </div>
                <div>
                  <p style={{ color: "white", fontSize: 15, fontWeight: 700 }}>SOS Emergency</p>
                  <p style={{ color: "#9b9b9b", fontSize: 12, marginTop: 2 }}>Location shared with 3 contacts</p>
                </div>
              </div>
              <div style={{
                background: "#dc2626", color: "white",
                padding: "6px 14px", borderRadius: 8,
                fontSize: 12, fontWeight: 800, letterSpacing: "0.05em"
              }}>
                ACTIVE
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { n: "50,000+", l: "Women Supported" },
                { n: "1,200+",  l: "Verified NGOs" },
                { n: "800+",    l: "Trusted Mentors" },
                { n: "24/7",    l: "AI Support" },
              ].map(s => (
                <div key={s.l} className="card" style={{ padding: "20px 22px" }}>
                  <p style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-1px", color: "var(--text-1)", marginBottom: 2 }}>
                    {s.n}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>{s.l}</p>
                </div>
              ))}
            </div>

            {/* Mentor card */}
            <div className="card" style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                background: "var(--purple)", color: "white",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 700, flexShrink: 0
              }}>PS</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)" }}>Priya Sharma</p>
                <p style={{ fontSize: 11, color: "var(--text-3)" }}>Senior Advocate · Legal Aid</p>
              </div>
              <div style={{
                background: "var(--green-light)", color: "var(--green)",
                padding: "4px 10px", borderRadius: 100,
                fontSize: 11, fontWeight: 600
              }}>Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider with stats */}
      <div style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 48px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 48 }}>
            {[
              { n: "50,000+", l: "Women helped across India" },
              { n: "1,200+",  l: "Verified NGOs in directory" },
              { n: "800+",    l: "Trusted mentors available" },
              { n: "< 1 min", l: "Average response time" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center" }}>
                <p style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 4 }}>
                  {s.n}
                </p>
                <p style={{ fontSize: 13, color: "var(--text-3)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
        <div style={{ marginBottom: 56 }}>
          <p className="t-label" style={{ marginBottom: 12 }}>Everything You Need</p>
          <h2 className="t-h1" style={{ marginBottom: 16 }}>Built for real emergencies</h2>
          <p className="t-body" style={{ maxWidth: 480, fontSize: 16 }}>
            Every feature is designed for moments that matter — when you need
            help fast, or just need someone to listen.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {features.map(f => {
            const Icon = f.icon
            return (
              <div key={f.title} className="card card-interactive" style={{ padding: 24 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: f.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 16
                }}>
                  <Icon size={20} color={f.ic} strokeWidth={2} />
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <div style={{ background: "var(--black)" }}>
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b9b9b", marginBottom: 12 }}>
              Simple Process
            </p>
            <h2 className="t-h1" style={{ color: "white", marginBottom: 16 }}>How It Works</h2>
            <p style={{ fontSize: 16, color: "#9b9b9b", maxWidth: 440 }}>
              Get started in minutes. No complicated setup required.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 40 }}>
            {steps.map((s, i) => (
              <div key={s.n} style={{ position: "relative" }}>
                {i < steps.length - 1 && (
                  <div style={{
                    position: "absolute", top: 28, left: "60%",
                    width: "80%", height: 1, background: "#333"
                  }} />
                )}
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  border: "1px solid #333", background: "#111",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 18, fontWeight: 800, color: "var(--purple)",
                  marginBottom: 20
                }}>
                  {s.n}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "white", marginBottom: 10 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, color: "#9b9b9b", lineHeight: 1.7 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Testimonials */}
      <section id="ourimpact" style={{ maxWidth: 1200, margin: "0 auto", padding: "96px 48px" }}>
        <div style={{ marginBottom: 56 }}>
          <p className="t-label" style={{ marginBottom: 12 }}>Stories That Matter</p>
          <h2 className="t-h1">Real women, real impact</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {testimonials.map(t => (
            <div key={t.name} className="card" style={{ padding: 28 }}>
              <div style={{ display: "flex", gap: 3, marginBottom: 20 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: 15, color: "var(--text-2)", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                "{t.quote}"
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "var(--purple)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 700
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-3)" }}>{t.city}, India</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="about" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 96px" }}>
        <div style={{
          background: "var(--purple)", borderRadius: 28,
          padding: "64px 64px", textAlign: "center"
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#c4b5fd", marginBottom: 16 }}>
            Join SafeHer Today
          </p>
          <h2 className="t-h1" style={{ color: "white", marginBottom: 16 }}>
            Ready to feel safer?
          </h2>
          <p style={{ fontSize: 16, color: "#c4b5fd", marginBottom: 36, maxWidth: 440, margin: "0 auto 36px" }}>
            Thousands of women trust SafeHer every day. Free, private, and always here for you.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn btn-lg" onClick={() => navigate("/login")}
              style={{ background: "white", color: "var(--purple)", fontWeight: 700 }}>
              Get Started Free <ArrowRight size={16} />
            </button>
            <button className="btn btn-lg" onClick={() => navigate("/login")}
              style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              <Phone size={16} /> Emergency: 1091
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid var(--border)", background: "var(--white)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={12} color="white" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Safe<span style={{ color: "var(--purple)" }}>Her</span>
            </span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            Made with care for every woman who deserves to feel safe
          </p>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>
            © 2024 SafeHer
          </p>
        </div>
      </footer>
    </div>
  )
}