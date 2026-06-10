import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { chatAPI } from "@/lib/api"
import { Send, Bot, User, RotateCcw, Sparkles, Shield, Scale, Heart, MapPin } from "lucide-react"

const promptCategories = [
  {
    icon: Shield, label: "Safety",
    prompts: ["What should I do if I feel unsafe walking home at night?", "How do I create a safety plan for an emergency?"]
  },
  {
    icon: Scale, label: "Legal",
    prompts: ["What are my legal rights if I face domestic violence?", "How do I file a police complaint safely?"]
  },
  {
    icon: Heart, label: "Emotional",
    prompts: ["I'm feeling very anxious and scared. Can you help?", "How do I cope after a traumatic experience?"]
  },
  {
    icon: MapPin, label: "Resources",
    prompts: ["How do I find an NGO near me for shelter?", "What government schemes are available for women in distress?"]
  },
]

function Message({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div style={{ display: "flex", gap: 16, justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 24 }}>
      {!isUser && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Bot size={18} color="white" />
        </div>
      )}
      <div style={{
        maxWidth: "70%", padding: "14px 18px", borderRadius: 18,
        borderBottomRightRadius: isUser ? 4 : 18,
        borderBottomLeftRadius: isUser ? 18 : 4,
        background: isUser ? "var(--black)" : "var(--white)",
        color: isUser ? "white" : "var(--text-1)",
        fontSize: 14, lineHeight: 1.75,
        border: isUser ? "none" : "1.5px solid var(--border)",
        boxShadow: "var(--shadow-xs)"
      }}>
        {msg.content.split("\n").map((line, i) => (
          <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>
        ))}
      </div>
      {isUser && (
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--bg-muted)", border: "1.5px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <User size={18} color="var(--text-2)" />
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Bot size={18} color="white" />
      </div>
      <div style={{ padding: "14px 18px", borderRadius: "18px 18px 18px 4px", background: "var(--white)", border: "1.5px solid var(--border)", display: "flex", gap: 5, alignItems: "center" }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--text-3)", animation: "pulse 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  )
}

export default function AIAssistant() {
  const [messages, setMessages] = useState([])
  const [input, setInput]       = useState("")
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState("")
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }) }, [messages, loading])

  async function sendMessage(text) {
    const t = text || input.trim()
    if (!t || loading) return
    setInput(""); setError("")
    const newMsgs = [...messages, { role: "user", content: t }]
    setMessages(newMsgs); setLoading(true)
    try {
      const res = await chatAPI.sendMessage(newMsgs.map(m => ({ role: m.role, content: m.content })))
      setMessages([...newMsgs, { role: "assistant", content: res.message }])
    } catch {
      setError("Sakhi could not respond right now. Please try again.")
      setMessages(messages)
    }
    setLoading(false)
    inputRef.current?.focus()
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>

        {/* Header */}
        <div style={{ padding: "20px 36px", borderBottom: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.3px" }}>Sakhi</h1>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e" }} />
                <p style={{ fontSize: 12, color: "var(--text-3)" }}>AI Safety Assistant · Online</p>
              </div>
            </div>
          </div>
          {messages.length > 0 && (
            <button onClick={() => setMessages([])} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10, border: "1.5px solid var(--border)", background: "var(--white)", fontSize: 13, fontWeight: 600, color: "var(--text-2)", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = "var(--purple)"}
            onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
              <RotateCcw size={14} /> New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "36px 80px", background: "var(--bg)" }}>
          {messages.length === 0 ? (
            <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>

              {/* Hero */}
              <div style={{ width: 80, height: 80, borderRadius: 24, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
                <Sparkles size={36} color="white" />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-1)", marginBottom: 12, letterSpacing: "-1px" }}>
                Hi, I'm Sakhi
              </h2>
              <p style={{ fontSize: 16, color: "var(--text-3)", lineHeight: 1.7, marginBottom: 48, maxWidth: 460, margin: "0 auto 48px" }}>
                Ask me about safety advice, legal rights, emergency resources, emotional support, and guidance. I'm here 24/7.
              </p>

              {/* Prompt categories */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, textAlign: "left" }}>
                {promptCategories.map(cat => {
                  const Icon = cat.icon
                  return (
                    <div key={cat.label} style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                        <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--purple-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Icon size={15} color="var(--purple)" />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-1)" }}>{cat.label}</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {cat.prompts.map(p => (
                          <button key={p} onClick={() => sendMessage(p)} style={{
                            padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)",
                            background: "var(--bg-muted)", fontSize: 12, color: "var(--text-2)",
                            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
                            lineHeight: 1.5, transition: "all 0.15s", fontWeight: 500
                          }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple)"; e.currentTarget.style.background = "var(--purple-light)" }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)"; e.currentTarget.style.background = "var(--bg-muted)" }}>
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div style={{ maxWidth: 760, margin: "0 auto" }}>
              {messages.map((m, i) => <Message key={i} msg={m} />)}
              {loading && <TypingIndicator />}
              {error && (
                <div style={{ textAlign: "center", marginBottom: 20 }}>
                  <span style={{ fontSize: 13, color: "var(--red)", background: "#fef2f2", padding: "8px 16px", borderRadius: 100, border: "1px solid #fecaca" }}>
                    {error}
                  </span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ padding: "20px 80px 28px", borderTop: "1px solid var(--border)", background: "var(--white)", flexShrink: 0 }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  placeholder="Ask Sakhi anything — safety, legal rights, emotional support..."
                  rows={1}
                  style={{
                    width: "100%", padding: "14px 18px", borderRadius: 14,
                    border: "1.5px solid var(--border)", fontSize: 14,
                    fontFamily: "inherit", resize: "none", outline: "none",
                    color: "var(--text-1)", maxHeight: 140, lineHeight: 1.6,
                    transition: "border-color 0.2s", background: "var(--white)"
                  }}
                  onFocus={e => e.target.style.borderColor = "var(--purple)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"}
                />
              </div>
              <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: input.trim() && !loading ? "var(--black)" : "var(--bg-muted)",
                  border: "none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s"
                }}
                aria-label="Send message">
                <Send size={18} color={input.trim() && !loading ? "white" : "var(--text-3)"} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 10 }}>
              Sakhi provides general guidance only · Always call 100 or 1091 in an emergency
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}