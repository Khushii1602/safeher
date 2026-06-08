import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { chatAPI } from "@/lib/api"
import { Send, Bot, User, RotateCcw } from "lucide-react"

const suggestions = [
  "What should I do if I feel unsafe walking home?",
  "What are my legal rights if I face domestic violence?",
  "How do I file a police complaint safely?",
  "What is the POSH Act and how does it protect me?",
  "How do I find an NGO near me for shelter?",
  "I'm feeling very anxious and scared, can you help?",
]

function Message({ msg }) {
  const isUser = msg.role === "user"
  return (
    <div style={{ display: "flex", gap: 12, justifyContent: isUser ? "flex-end" : "flex-start", marginBottom: 16 }}>
      {!isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <Bot size={16} color="white" />
        </div>
      )}
      <div style={{
        maxWidth: "72%", padding: "12px 16px", borderRadius: 16,
        borderBottomRightRadius: isUser ? 4 : 16,
        borderBottomLeftRadius: isUser ? 16 : 4,
        background: isUser ? "var(--purple)" : "var(--white)",
        color: isUser ? "white" : "var(--text-1)",
        fontSize: 14, lineHeight: 1.7,
        boxShadow: "var(--shadow-xs)",
        border: isUser ? "none" : "1px solid var(--border)"
      }}>
        {msg.content.split("\n").map((line, i) => (
          <span key={i}>{line}{i < msg.content.split("\n").length - 1 && <br />}</span>
        ))}
      </div>
      {isUser && (
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-muted)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
          <User size={16} color="var(--text-2)" />
        </div>
      )}
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Bot size={16} color="white" />
      </div>
      <div style={{ padding: "14px 18px", borderRadius: 16, borderBottomLeftRadius: 4, background: "var(--white)", border: "1px solid var(--border)", display: "flex", gap: 5, alignItems: "center" }}>
        {[0,1,2].map(i => (
          <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--text-3)", animation: "pulse 1.2s infinite", animationDelay: `${i*0.2}s` }} />
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
    } catch { setError("Sakhi could not respond right now. Please try again."); setMessages(messages) }
    setLoading(false)
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", padding: "0 0" }}>

        {/* Header */}
        <div style={{ padding: "24px 40px", borderBottom: "1px solid var(--border)", background: "var(--white)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={22} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 800, color: "var(--text-1)", letterSpacing: "-0.5px" }}>Sakhi</h1>
              <p style={{ fontSize: 12, color: "var(--text-3)" }}>AI Safety Assistant · Always available</p>
            </div>
          </div>
          {messages.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={() => setMessages([])}>
              <RotateCcw size={14} /> Clear Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px", background: "var(--bg)" }}>
          {messages.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ width: 72, height: 72, borderRadius: 22, background: "var(--purple)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <Bot size={36} color="white" />
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-1)", marginBottom: 8, letterSpacing: "-0.5px" }}>
                Hi, I'm Sakhi
              </h2>
              <p style={{ fontSize: 14, color: "var(--text-3)", maxWidth: 380, margin: "0 auto 36px", lineHeight: 1.7 }}>
                I'm here to help with safety advice, legal information, emotional support, and connecting you with the right resources.
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 600, margin: "0 auto" }}>
                {suggestions.map(s => (
                  <button key={s} onClick={() => sendMessage(s)} style={{
                    padding: "10px 16px", borderRadius: 100,
                    fontSize: 13, color: "var(--text-2)",
                    background: "var(--white)", border: "1.5px solid var(--border)",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s", fontFamily: "inherit"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple)" }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => <Message key={i} msg={m} />)}
          {loading && <TypingIndicator />}
          {error && (
            <div style={{ textAlign: "center", padding: 8 }}>
              <span style={{ fontSize: 13, color: "var(--red)", background: "#fef2f2", padding: "8px 16px", borderRadius: 100 }}>{error}</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: "20px 40px", borderTop: "1px solid var(--border)", background: "var(--white)" }}>
          <div style={{ display: "flex", gap: 12, maxWidth: 800, margin: "0 auto" }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              placeholder="Ask Sakhi anything..."
              rows={1}
              className="input"
              style={{ flex: 1, resize: "none", maxHeight: 120, lineHeight: 1.6 }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn btn-purple"
              style={{ flexShrink: 0, opacity: !input.trim() || loading ? 0.5 : 1 }}
              aria-label="Send message">
              <Send size={16} />
            </button>
          </div>
          <p style={{ fontSize: 11, color: "var(--text-3)", textAlign: "center", marginTop: 10 }}>
            Sakhi provides general guidance only · Always call 100 or 1091 in an emergency
          </p>
        </div>

      </div>
    </AppLayout>
  )
}