import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { mentorAPI } from "@/lib/api"

const specializations = [
  "all",
  "legal aid",
  "mental health",
  "career guidance",
  "financial independence",
  "domestic violence support",
  "digital safety",
  "entrepreneurship",
  "education",
]

const specializationColors = {
  "legal aid":                  { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "mental health":              { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  "career guidance":            { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "financial independence":     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "domestic violence support":  { bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  "digital safety":             { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  "entrepreneurship":           { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  "education":                  { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
}

const availabilityColors = {
  available:   { bg: "#f0fdf4", text: "#15803d" },
  busy:        { bg: "#fff7ed", text: "#c2410c" },
  unavailable: { bg: "#f9fafb", text: "#6b7280" },
}

// Request Help Modal
function RequestModal({ mentor, onClose }) {
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  function handleSend(e) {
    e.preventDefault()
    // In a real app this would call an API
    // For now we simulate a successful send
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(88, 28, 135, 0.3)" }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-purple-100">

        {sent ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-3">💜</div>
            <h3 className="text-base font-semibold text-purple-700 mb-2">
              request sent!
            </h3>
            <p className="text-sm text-purple-400 mb-6">
              {mentor.name} will get back to you soon. you've got this 🌸
            </p>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-purple-800">
                request help from {mentor.name}
              </h3>
              <button onClick={onClose} className="text-purple-400 hover:text-purple-600 text-xl">
                ×
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-purple-600 mb-1.5">
                  what do you need help with? 💜
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="share what you're going through — this is a safe space..."
                  className="w-full px-4 py-3 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all resize-none placeholder:text-purple-200 text-purple-800"
                />
              </div>
              <button type="submit"
                className="w-full py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                send request 💜
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// Single mentor card
function MentorCard({ mentor, onRequest }) {
  const specColors = specializationColors[mentor.specialization] || specializationColors["legal aid"]
  const availColors = availabilityColors[mentor.availability]

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 hover:shadow-md hover:border-purple-200 transition-all flex flex-col">

      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
          {mentor.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold text-purple-900">{mentor.name}</h3>
            {mentor.isVerified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                ✓ verified
              </span>
            )}
          </div>
          <p className="text-xs text-purple-400 mt-0.5 truncate">{mentor.title}</p>
          <p className="text-xs text-purple-300 mt-0.5">
            📍 {mentor.city}, {mentor.state}
          </p>
        </div>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap gap-2 mb-3">
        <span className="text-xs px-2.5 py-1 rounded-full border"
          style={{ background: specColors.bg, color: specColors.text, borderColor: specColors.border }}>
          {mentor.specialization}
        </span>
        <span className="text-xs px-2.5 py-1 rounded-full"
          style={{ background: availColors.bg, color: availColors.text }}>
          {mentor.availability}
        </span>
      </div>

      {/* Bio */}
      <p className="text-xs text-purple-500 leading-relaxed mb-3 flex-1 line-clamp-3">
        {mentor.bio}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-xs text-purple-400">
        <span>⭐ {mentor.rating}</span>
        <span>🗓️ {mentor.experience} yrs exp</span>
        <span>💬 {mentor.totalSessions} sessions</span>
      </div>

      {/* Languages */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {mentor.languages.map((lang) => (
          <span key={lang}
            className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-400 border border-purple-100">
            {lang}
          </span>
        ))}
      </div>

      {/* Request button */}
      <button
        onClick={() => onRequest(mentor)}
        disabled={mentor.availability === "unavailable"}
        className="w-full py-2.5 rounded-xl text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
        {mentor.availability === "unavailable" ? "currently unavailable" : "request help 💜"}
      </button>
    </div>
  )
}

function MentorDirectory() {
  const [mentors, setMentors]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")
  const [search, setSearch]           = useState("")
  const [specialization, setSpec]     = useState("all")
  const [selectedMentor, setSelected] = useState(null)

  useEffect(() => { fetchMentors() }, [specialization])

  async function fetchMentors(searchTerm = search) {
    setLoading(true)
    setError("")
    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (specialization !== "all") params.specialization = specialization
      const res = await mentorAPI.getAll(params)
      setMentors(res.data)
    } catch {
      setError("couldn't load mentors 💜 please try again")
    }
    setLoading(false)
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            mentor directory 👩‍🏫
          </h1>
          <p className="text-purple-400 text-sm">
            connect with verified mentors who genuinely want to help you 💜
          </p>
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchMentors(search)}
            placeholder="search by name, city, or expertise..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200 text-purple-800"
          />
          <button onClick={() => fetchMentors(search)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            search
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {specializations.map((s) => (
            <button key={s} onClick={() => setSpec(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                specialization === s
                  ? "text-white border-transparent"
                  : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
              }`}
              style={specialization === s
                ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                : {}}>
              {s}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-pink-50 text-pink-600 text-sm p-4 rounded-xl mb-6 border border-pink-100">
            {error}
          </div>
        )}

        {/* Loading skeletons */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100 p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100" />
                  <div className="flex-1">
                    <div className="h-4 bg-purple-100 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-purple-50 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-purple-50 rounded mb-3" />
                <div className="h-9 bg-purple-100 rounded" />
              </div>
            ))}
          </div>
        ) : mentors.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-purple-400 text-sm">no mentors found</p>
            <button onClick={() => { setSearch(""); setSpec("all"); fetchMentors("") }}
              className="mt-4 text-xs text-purple-500 underline">
              clear filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs text-purple-400 mb-4">
              showing {mentors.length} mentor{mentors.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {mentors.map((mentor) => (
                <MentorCard
                  key={mentor._id}
                  mentor={mentor}
                  onRequest={setSelected}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Request Modal */}
      {selectedMentor && (
        <RequestModal
          mentor={selectedMentor}
          onClose={() => setSelected(null)}
        />
      )}
    </AppLayout>
  )
}

export default MentorDirectory