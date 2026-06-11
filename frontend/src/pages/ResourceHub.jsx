import AppLayout from "@/components/layout/AppLayout"
import { BookOpen, Shield, Heart, Briefcase, Baby, Sword, Brain, ExternalLink, Download, ChevronRight } from "lucide-react"

const resourceCategories = [
  {
    icon: Shield, title: "Legal Rights", color: "#eff6ff", ic: "#1e40af",
    resources: [
      { title: "Protection of Women from Domestic Violence Act, 2005", desc: "Comprehensive guide on rights, protections, and legal remedies available under the PWDVA.", link: "https://wcd.nic.in/act/protection-women-domestic-violence-act-2005" },
      { title: "Sexual Harassment of Women at Workplace Act (POSH), 2013", desc: "Understanding your rights and the complaint process for workplace sexual harassment.", link: "https://labour.gov.in/sites/default/files/TheSexual HarassmentofWomenatWorkplace.pdf" },
      { title: "IPC Sections for Women's Protection", desc: "Key IPC sections including 354, 376, 498A, and 509 explained in simple language.", link: "https://indiankanoon.org" },
      { title: "Cyber Crime Laws in India", desc: "IT Act provisions, reporting procedures, and legal protections for online harassment.", link: "https://cybercrime.gov.in" },
    ]
  },
  {
    icon: Heart, title: "Domestic Violence", color: "#fef2f2", ic: "#991b1b",
    resources: [
      { title: "Recognizing Domestic Violence", desc: "Signs, types, and patterns of domestic abuse — physical, emotional, financial, and digital.", link: "https://ncadv.org/signs-of-abuse" },
      { title: "Safety Planning Guide", desc: "Step-by-step safety plan for leaving an abusive relationship safely.", link: "https://www.thehotline.org/create-a-safety-plan" },
      { title: "iCall Crisis Support", desc: "Free mental health and emotional support for DV survivors.", link: "https://icallhelpline.org" },
      { title: "Shelter Home Directory", desc: "Government-verified shelter homes for women across India.", link: "https://wcd.nic.in/schemes/swadhar-greh" },
    ]
  },
  {
    icon: Briefcase, title: "Workplace Safety", color: "#f5f3ff", ic: "#5b21b6",
    resources: [
      { title: "Filing a POSH Complaint", desc: "How to file a sexual harassment complaint with your Internal Complaints Committee.", link: "https://posh.co.in" },
      { title: "External Complaints Committee", desc: "Guidance when there is no ICC at your workplace or the ICC doesn't act.", link: "https://labour.gov.in" },
      { title: "Labour Commissioner Office", desc: "Contact your state labour commissioner for workplace rights violations.", link: "https://labour.gov.in/contact" },
      { title: "Women in Informal Sector", desc: "Special protections and resources for women in unorganized sectors.", link: "https://labour.gov.in/wcl" },
    ]
  },
  {
    icon: Baby, title: "Child Protection", color: "#fdf4ff", ic: "#6b21a8",
    resources: [
      { title: "POCSO Act — Complete Guide", desc: "Protection of Children from Sexual Offences Act — explained for parents, teachers, and caregivers.", link: "https://ncpcr.gov.in/index1.php?lang=1&level=2&sublinkid=689&lid=536" },
      { title: "Child Friendly Police Guidelines", desc: "How to report child abuse to police and what to expect from the process.", link: "https://ncpcr.gov.in" },
      { title: "Childline 1098 — How It Works", desc: "Understanding how to use the Childline emergency service for children.", link: "https://childlineindia.org.in" },
      { title: "Online Safety for Children", desc: "Cyberbullying, grooming, and digital safety guide for children and parents.", link: "https://cybercrime.gov.in/Webform/crime_cybersafety.aspx" },
    ]
  },
  {
    icon: Brain, title: "Mental Health", color: "#f0fdf4", ic: "#14532d",
    resources: [
      { title: "Understanding Trauma", desc: "How trauma affects the mind and body — and pathways to healing.", link: "https://icallhelpline.org/resources" },
      { title: "iCall — Free Counselling", desc: "Professional mental health counselling services by TISS Mumbai.", link: "https://icallhelpline.org" },
      { title: "Vandrevala Foundation Helpline", desc: "24/7 mental health crisis support at 1860-2662-345.", link: "https://www.vandrevalafoundation.com" },
      { title: "Coping After Abuse", desc: "Self-care strategies and professional resources for recovery.", link: "https://www.nimhans.ac.in" },
    ]
  },
  {
    icon: Shield, title: "Cyber Safety", color: "#fffbeb", ic: "#92400e",
    resources: [
      { title: "Reporting Cyberstalking", desc: "Step-by-step guide to report cyberstalking, harassment, and threats online.", link: "https://cybercrime.gov.in" },
      { title: "Digital Privacy Guide", desc: "Protecting your personal information, accounts, and digital footprint.", link: "https://cybercrime.gov.in/Webform/crime_cybersafety.aspx" },
      { title: "Revenge Porn — Legal Remedies", desc: "IT Act Section 67 — legal actions available against non-consensual sharing.", link: "https://indiankanoon.org/doc/1985600" },
      { title: "Social Media Safety Checklist", desc: "Security settings and privacy controls for Facebook, Instagram, WhatsApp.", link: "https://cybercrime.gov.in" },
    ]
  },
]

export default function ResourceHub() {
  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
            Knowledge Center
          </p>
          <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 10 }}>
            Resource Hub
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-3)", maxWidth: 560 }}>
            Curated guides, legal information, and practical resources on safety, rights, mental health and child protection.
          </p>
        </div>

        {/* Resource categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {resourceCategories.map(cat => {
            const Icon = cat.icon
            return (
              <div key={cat.title}>
                {/* Category header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: cat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={22} color={cat.ic} strokeWidth={2} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.5px" }}>{cat.title}</h2>
                  </div>
                </div>

                {/* Resource cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                  {cat.resources.map(r => (
                    <div key={r.title} style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "20px", display: "flex", flexDirection: "column", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.boxShadow = "var(--shadow-sm)"; e.currentTarget.style.transform = "translateY(-2px)" }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.transform = "" }}>
                      <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)", marginBottom: 8, lineHeight: 1.4 }}>{r.title}</h3>
                      <p style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.6, flex: 1, marginBottom: 16 }}>{r.desc}</p>
                      <a href={r.link} target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: "var(--purple)", textDecoration: "none", transition: "gap 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.gap = "10px"}
                      onMouseLeave={e => e.currentTarget.style.gap = "6px"}>
                        Read More <ExternalLink size={11} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 56, background: "var(--black)", borderRadius: 20, padding: "32px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "white", letterSpacing: "-0.5px", marginBottom: 8 }}>
              Can't find what you're looking for?
            </h3>
            <p style={{ fontSize: 14, color: "#9b9b9b" }}>Ask Sakhi, our AI assistant — she's trained on Indian law and safety resources.</p>
          </div>
          <a href="/assistant" style={{ padding: "12px 24px", borderRadius: 12, background: "var(--purple)", color: "white", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 8, flexShrink: 0, transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#5b21b6"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--purple)"}>
            Ask Sakhi <ChevronRight size={16} />
          </a>
        </div>

      </div>
    </AppLayout>
  )
}