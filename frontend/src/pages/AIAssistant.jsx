// AIAssistant.jsx - AI Safety Chatbot powered by Claude
import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { chatAPI } from "@/lib/api"

// Suggested starter questions to help users begin
const suggestions = [
  "what should i do if i feel unsafe walking home?",
  "what are my legal rights if i face domestic violence?",
  "how do i file a police complaint safely?",
  "i'm feeling very anxious and scared, can you help?",
  "what is the POSH act and how does it protect me?",
  "how do i find an ngo near me for shelter?",
]

// A single chat message bubble
function MessageBubble({ message }) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      {/* Sakhi avatar — only show on AI messages */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2 mt-1"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          🤖
        </div>
      )}

      <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? "text-white rounded-tr-sm"
          : "bg-white border border-purple-100 text-purple-800 rounded-tl-sm"
        }`}
        style={isUser
          ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
          : {}}>
        {/* Render message with line breaks */}
        {message.content.split("\n").map((line, i) => (
          <span key={i}>
            {line}
            {i < message.content.split("\n").length - 1 && <br />}
          </span>
        ))}
      </div>
    </div>
  )
}

// Animated typing indicator
function TypingIndicator() {
  return (
    <div className="flex justify-start mb-4">
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mr-2"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
        🤖
      </div>
      <div className="bg-white border border-purple-100 px-4 py-3 rounded-2xl rounded-tl-sm">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map((i) => (
            <div key={i}
              className="w-2 h-2 rounded-full bg-purple-300 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </div>
  )
}

function AIAssistant() {
  // messages is an array of { role: "user" | "assistant", content: "..." }
  const [messages, setMessages]   = useState([])
  const [input, setInput]         = useState("")
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState("")

  // Ref to the bottom of the chat — used to auto-scroll
  const bottomRef = useRef(null)

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  async function sendMessage(text) {
    const messageText = text || input.trim()
    if (!messageText || loading) return

    setInput("")
    setError("")

    // Add user message to chat immediately (feels responsive)
    const newMessages = [
      ...messages,
      { role: "user", content: messageText }
    ]
    setMessages(newMessages)
    setLoading(true)

    try {
      // Send full conversation history so Claude has context
      const response = await chatAPI.sendMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content }))
      )

      // Add AI response to chat
      setMessages([
        ...newMessages,
        { role: "assistant", content: response.message }
      ])
    } catch (err) {
      setError("sakhi couldn't respond right now 💜 please try again")
      // Remove the user message if the API call failed
      setMessages(messages)
    }

    setLoading(false)
  }

  function handleKeyDown(e) {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function clearChat() {
    setMessages([])
    setError("")
  }

  return (
    <AppLayout>
      <div className="flex flex-col h-screen max-h-screen p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-shrink-0">
          <div>
            <h1 className="text-3xl font-semibold text-purple-800">
              sakhi — ai assistant 🤖
            </h1>
            <p className="text-purple-400 text-sm mt-1">
              your compassionate safety guide, available 24/7 💜
            </p>
          </div>
          {messages.length > 0 && (
            <button onClick={clearChat}
              className="text-xs text-purple-400 hover:text-purple-600 border border-purple-200 px-3 py-1.5 rounded-xl transition-all">
              clear chat
            </button>
          )}
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-purple-100 p-5 mb-4">

          {/* Welcome state — shown when no messages yet */}
          {messages.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4"
                style={{ background: "linear-gradient(135deg, #fce7f3, #ede9fe)" }}>
                🤖
              </div>
              <h2 className="text-base font-semibold text-purple-700 mb-2">
                hi, i'm sakhi 💜
              </h2>
              <p className="text-sm text-purple-400 max-w-sm mx-auto mb-8">
                i'm here to help with safety advice, legal information,
                emotional support, and connecting you with the right resources.
              </p>

              {/* Suggestion chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg mx-auto">
                {suggestions.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)}
                    className="px-3 py-2 rounded-xl text-xs text-purple-600 bg-purple-50 border border-purple-100 hover:bg-purple-100 transition-all text-left">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}

          {/* Typing indicator */}
          {loading && <TypingIndicator />}

          {/* Error message */}
          {error && (
            <div className="text-center py-2">
              <p className="text-xs text-pink-500 bg-pink-50 px-4 py-2 rounded-xl inline-block border border-pink-100">
                {error}
              </p>
            </div>
          )}

          {/* Invisible element at bottom for auto-scroll */}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="ask sakhi anything... 💜"
              rows={1}
              className="flex-1 px-4 py-3 rounded-2xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none placeholder:text-purple-200 text-purple-800"
              style={{ maxHeight: "120px" }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="px-5 py-3 rounded-2xl text-white text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              send 💜
            </button>
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-purple-300 text-center mt-3">
            sakhi provides general guidance only · always call 100 or 1091 in an emergency
          </p>
        </div>

      </div>
    </AppLayout>
  )
}

export default AIAssistant