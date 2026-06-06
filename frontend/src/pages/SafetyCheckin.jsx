// SafetyCheckin.jsx - Safety timer with missed check-in alerts
import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"

// Preset timer durations
const presets = [
  { label: "15 min",  seconds: 15 * 60 },
  { label: "30 min",  seconds: 30 * 60 },
  { label: "1 hour",  seconds: 60 * 60 },
  { label: "2 hours", seconds: 2 * 60 * 60 },
  { label: "custom",  seconds: null },
]

// Format seconds into MM:SS or HH:MM:SS
function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

// Calculate progress percentage for the ring
function getProgress(current, total) {
  if (total === 0) return 0
  return ((total - current) / total) * 100
}

function SafetyCheckin() {
  const { currentUser } = useAuth()

  // Timer state
  const [status, setStatus]           = useState("idle") // idle | running | missed | checkedin
  const [selectedPreset, setPreset]   = useState(presets[1]) // default 30 min
  const [customMinutes, setCustom]    = useState(45)
  const [totalSeconds, setTotal]      = useState(30 * 60)
  const [remaining, setRemaining]     = useState(30 * 60)
  const [contacts, setContacts]       = useState([])
  const [note, setNote]               = useState("")

  // Interval ref — stores the timer interval so we can clear it
  const intervalRef = useRef(null)

  // Load emergency contacts
  useEffect(() => {
    if (currentUser?.uid) loadContacts()
  }, [currentUser])

  async function loadContacts() {
    try {
      const res = await emergencyAPI.getContacts(currentUser.uid)
      setContacts(res.data)
    } catch {
      // silently fail
    }
  }

  // Countdown logic
  useEffect(() => {
    if (status === "running") {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            // Timer hit zero — missed check-in!
            clearInterval(intervalRef.current)
            setStatus("missed")
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      // Clear interval when not running
      clearInterval(intervalRef.current)
    }

    // Cleanup on unmount
    return () => clearInterval(intervalRef.current)
  }, [status])

  function handlePresetSelect(preset) {
    setPreset(preset)
    if (preset.seconds) {
      setTotal(preset.seconds)
      setRemaining(preset.seconds)
    } else {
      const secs = customMinutes * 60
      setTotal(secs)
      setRemaining(secs)
    }
  }

  function handleCustomChange(val) {
    const mins = Math.max(1, Math.min(480, Number(val)))
    setCustom(mins)
    if (selectedPreset.seconds === null) {
      setTotal(mins * 60)
      setRemaining(mins * 60)
    }
  }

  function startTimer() {
    const secs = selectedPreset.seconds ?? customMinutes * 60
    setTotal(secs)
    setRemaining(secs)
    setStatus("running")
  }

  function checkIn() {
    clearInterval(intervalRef.current)
    setStatus("checkedin")
  }

  function resetTimer() {
    clearInterval(intervalRef.current)
    const secs = selectedPreset.seconds ?? customMinutes * 60
    setTotal(secs)
    setRemaining(secs)
    setStatus("idle")
  }

  function restartFromMissed() {
    resetTimer()
  }

  // Progress for SVG ring
  const progress = getProgress(remaining, totalSeconds)
  const isUrgent = remaining <= 60 && status === "running"
  const circumference = 2 * Math.PI * 54 // radius = 54

  return (
    <AppLayout>
      <div className="p-8 max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            safety check-in ⏱️
          </h1>
          <p className="text-purple-400 text-sm">
            set a timer — if you don't check in, your contacts will be alerted 💜
          </p>
        </div>

        {/* ── MISSED STATE ── */}
        {status === "missed" && (
          <div className="mb-6 p-6 rounded-2xl border-2 border-pink-300 text-center"
            style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)" }}>
            <div className="text-4xl mb-3 animate-bounce">🚨</div>
            <h2 className="text-lg font-bold text-pink-700 mb-2">
              check-in missed!
            </h2>
            <p className="text-sm text-pink-500 mb-5">
              you didn't check in on time. please call your emergency contacts or a helpline now.
            </p>

            {/* Emergency contacts */}
            {contacts.length > 0 && (
              <div className="space-y-2 mb-5 text-left">
                {contacts.map((c) => (
                  <a key={c._id} href={`tel:${c.phone}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-pink-100">
                    <div>
                      <p className="text-sm font-medium text-purple-800">{c.name}</p>
                      <p className="text-xs text-purple-400">{c.relationship} · {c.phone}</p>
                    </div>
                    <span className="text-xl">📞</span>
                  </a>
                ))}
              </div>
            )}

            <div className="flex gap-3">
              <a href="tel:1091"
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white text-center"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}>
                call 1091 🆘
              </a>
              <button onClick={restartFromMissed}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-purple-600 border-2 border-purple-200 hover:bg-purple-50">
                i am safe — reset
              </button>
            </div>
          </div>
        )}

        {/* ── CHECKED IN STATE ── */}
        {status === "checkedin" && (
          <div className="mb-6 p-6 rounded-2xl border border-green-200 text-center bg-green-50">
            <div className="text-4xl mb-3">✅</div>
            <h2 className="text-lg font-semibold text-green-700 mb-2">
              check-in successful! 💜
            </h2>
            <p className="text-sm text-green-600 mb-5">
              you're safe. want to set another timer?
            </p>
            <button onClick={resetTimer}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              set new timer
            </button>
          </div>
        )}

        {/* ── TIMER DISPLAY ── */}
        {(status === "idle" || status === "running") && (
          <div className="bg-white rounded-2xl border border-purple-100 p-8 mb-6">

            {/* SVG Countdown Ring */}
            <div className="flex justify-center mb-6">
              <div className="relative w-36 h-36">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
                  {/* Background ring */}
                  <circle cx="60" cy="60" r="54"
                    fill="none" stroke="#f3e8ff" strokeWidth="8" />
                  {/* Progress ring */}
                  <circle cx="60" cy="60" r="54"
                    fill="none"
                    stroke={isUrgent ? "#ec4899" : "#a855f7"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (progress / 100) * circumference}
                    style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }}
                  />
                </svg>
                {/* Time text in center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-2xl font-bold ${isUrgent ? "text-pink-600" : "text-purple-700"}`}>
                    {formatTime(remaining)}
                  </span>
                  <span className="text-xs text-purple-400 mt-1">
                    {status === "running" ? "remaining" : "ready"}
                  </span>
                </div>
              </div>
            </div>

            {/* Preset selector — only when idle */}
            {status === "idle" && (
              <div className="mb-6">
                <p className="text-xs font-medium text-purple-600 mb-3 text-center">
                  choose duration
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {presets.map((p) => (
                    <button key={p.label} onClick={() => handlePresetSelect(p)}
                      className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                        selectedPreset.label === p.label
                          ? "text-white border-transparent"
                          : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
                      }`}
                      style={selectedPreset.label === p.label
                        ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                        : {}}>
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Custom minutes input */}
                {selectedPreset.seconds === null && (
                  <div className="mt-3 flex items-center gap-3 justify-center">
                    <label className="text-xs text-purple-500">minutes:</label>
                    <input
                      type="number"
                      value={customMinutes}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      min={1}
                      max={480}
                      className="w-20 px-3 py-2 rounded-xl text-sm text-center border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 text-purple-800"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Optional note */}
            {status === "idle" && (
              <div className="mb-6">
                <label className="block text-xs font-medium text-purple-600 mb-1.5">
                  where are you going? (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. going for a walk in the park..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200 text-purple-800"
                />
              </div>
            )}

            {/* Note display while running */}
            {status === "running" && note && (
              <p className="text-xs text-center text-purple-400 mb-4 italic">
                📝 {note}
              </p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {status === "idle" ? (
                <button onClick={startTimer}
                  className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                  start check-in timer ⏱️
                </button>
              ) : (
                <>
                  <button onClick={checkIn}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                    ✅ i'm safe — check in
                  </button>
                  <button onClick={resetTimer}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-purple-500 border-2 border-purple-200 hover:bg-purple-50 transition-all">
                    cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          <h2 className="text-sm font-semibold text-purple-700 mb-3">
            💜 how to use safety check-in
          </h2>
          <div className="space-y-2">
            {[
              "set a timer before going somewhere unfamiliar or meeting someone new",
              "if you don't tap 'i'm safe' before the timer ends, you'll see an alert to call for help",
              "add emergency contacts in the sos page so they're ready",
              "use the note field to record where you're going",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-300 mt-1.5 flex-shrink-0" />
                <p className="text-xs text-purple-500 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  )
}

export default SafetyCheckin