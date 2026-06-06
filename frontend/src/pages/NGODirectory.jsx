// NGODirectory.jsx - Browse and search verified NGOs
import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { ngoAPI } from "@/lib/api"

const categories = [
  "all",
  "legal aid",
  "mental health",
  "shelter",
  "education",
  "employment",
  "child welfare",
  "domestic violence",
  "general support",
]

// Color map for category badges
const categoryColors = {
  "legal aid":        { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe" },
  "mental health":    { bg: "#f5f3ff", text: "#6d28d9", border: "#ddd6fe" },
  "shelter":          { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff" },
  "education":        { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  "employment":       { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  "child welfare":    { bg: "#fce7f3", text: "#be185d", border: "#fbcfe8" },
  "domestic violence":{ bg: "#fef2f2", text: "#b91c1c", border: "#fecaca" },
  "general support":  { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd" },
}

// Single NGO card component
function NGOCard({ ngo }) {
  const colors = categoryColors[ngo.category] || categoryColors["general support"]

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-5 hover:shadow-md hover:border-purple-200 transition-all">

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-purple-900">{ngo.name}</h3>
            {ngo.isVerified && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600 border border-green-100">
                ✓ verified
              </span>
            )}
          </div>
          <p className="text-xs text-purple-400">📍 {ngo.city}, {ngo.state}</p>
        </div>
        {ngo.rating > 0 && (
          <div className="text-xs font-medium text-amber-500 flex items-center gap-1">
            ⭐ {ngo.rating}
          </div>
        )}
      </div>

      {/* Category badge */}
      <span
        className="inline-block text-xs px-2.5 py-1 rounded-full border mb-3"
        style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
        {ngo.category}
      </span>

      {/* Description */}
      <p className="text-xs text-purple-500 leading-relaxed mb-4 line-clamp-3">
        {ngo.description}
      </p>

      {/* Services */}
      {ngo.services?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {ngo.services.slice(0, 3).map((s) => (
            <span key={s}
              className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 border border-purple-100">
              {s}
            </span>
          ))}
          {ngo.services.length > 3 && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-400">
              +{ngo.services.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Contact buttons */}
      <div className="flex gap-2 pt-3 border-t border-purple-50">
        {ngo.phone && (
          <a href={`tel:${ngo.phone}`}
            className="flex-1 text-center text-xs py-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-all">
            📞 call
          </a>
        )}
        {ngo.email && (
          <a href={`mailto:${ngo.email}`}
            className="flex-1 text-center text-xs py-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100 hover:bg-pink-100 transition-all">
            ✉️ email
          </a>
        )}
        {ngo.website && (
          <a href={ngo.website} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-center text-xs py-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-all">
            🌐 visit
          </a>
        )}
      </div>
    </div>
  )
}

function NGODirectory() {
  const [ngos, setNgos]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState("")
  const [search, setSearch]       = useState("")
  const [category, setCategory]   = useState("all")

  // Fetch NGOs whenever search or category changes
  useEffect(() => {
    fetchNGOs()
  }, [category])

  async function fetchNGOs(searchTerm = search) {
    setLoading(true)
    setError("")
    try {
      const params = {}
      if (searchTerm) params.search = searchTerm
      if (category !== "all") params.category = category

      const response = await ngoAPI.getAll(params)
      setNgos(response.data)
    } catch (err) {
      setError("couldn't load NGOs. please try again 💜")
    }
    setLoading(false)
  }

  // Search on Enter key
  function handleSearchKey(e) {
    if (e.key === "Enter") fetchNGOs(search)
  }

  return (
    <AppLayout>
      <div className="p-8 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            ngo directory 🏢
          </h1>
          <p className="text-purple-400 text-sm">
            find verified organisations that can help you
          </p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearchKey}
            placeholder="search by name, city, or service..."
            className="flex-1 px-4 py-2.5 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200 text-purple-800"
          />
          <button
            onClick={() => fetchNGOs(search)}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
            search
          </button>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                category === cat
                  ? "text-white border-transparent"
                  : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
              }`}
              style={category === cat
                ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                : {}}>
              {cat}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-pink-50 text-pink-600 text-sm p-4 rounded-xl mb-6 border border-pink-100">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100 p-5 animate-pulse">
                <div className="h-4 bg-purple-100 rounded mb-3 w-3/4" />
                <div className="h-3 bg-purple-50 rounded mb-2 w-1/2" />
                <div className="h-16 bg-purple-50 rounded mb-3" />
                <div className="h-8 bg-purple-50 rounded" />
              </div>
            ))}
          </div>
        ) : ngos.length === 0 ? (
          /* Empty state */
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-purple-400 text-sm">no ngos found matching your search</p>
            <button onClick={() => { setSearch(""); setCategory("all"); fetchNGOs("") }}
              className="mt-4 text-xs text-purple-500 underline">
              clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <p className="text-xs text-purple-400 mb-4">
              showing {ngos.length} organisation{ngos.length !== 1 ? "s" : ""}
            </p>

            {/* NGO Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {ngos.map((ngo) => (
                <NGOCard key={ngo._id} ngo={ngo} />
              ))}
            </div>
          </>
        )}

      </div>
    </AppLayout>
  )
}

export default NGODirectory