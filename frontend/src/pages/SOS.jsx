// SOS.jsx - Emergency SOS system
// Designed for high-stress moments: large targets, clear actions, calm colours
import { useState, useEffect } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { emergencyAPI } from "@/lib/api"

// National helpline numbers
const helplines = [
  { name: "women helpline",        number: "1091", icon: "🆘" },
  { name: "police",                number: "100",  icon: "👮" },
  { name: "ambulance",             number: "108",  icon: "🚑" },
  { name: "domestic violence",     number: "181",  icon: "💜" },
  { name: "child helpline",        number: "1098", icon: "🧒" },
  { name: "mental health (vandrevala)", number: "1860-2662-345", icon: "🧠" },
]

const relationships = ["mother", "father", "sister", "brother", "friend", "partner", "other"]

function SOS() {
  const { currentUser } = useAuth()

  // SOS state
  const [sosActive, setSosActive]       = useState(false)
  const [location, setLocation]         = useState(null)
  const [locationError, setLocationError] = useState("")
  const [locating, setLocating]         = useState(false)

  // Contacts state
  const [contacts, setContacts]         = useState([])
  const [loadingContacts, setLoadingContacts] = useState(true)
  const [showAddForm, setShowAddForm]   = useState(false)
  const [saving, setSaving]             = useState(false)

  // New contact form
  const [newContact, setNewContact] = useState({
    name: "", phone: "", relationship: "friend"
  })

  // Load contacts on mount
  useEffect(() => {
    if (currentUser?.uid) loadContacts()
  }, [currentUser])

  async function loadContacts() {
    setLoadingContacts(true)
    try {
      const res = await emergencyAPI.getContacts(currentUser.uid)
      setContacts(res.data)
    } catch {
      // silently fail — contacts just won't show
    }
    setLoadingContacts(false)
  }

  // ── SOS Trigger ──
  function triggerSOS() {
    setSosActive(true)
    setLocating(true)
    setLocationError("")

    // Request GPS location from browser
    if (!navigator.geolocation) {
      setLocationError("location not supported on this device")
      setLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          accuracy: Math.round(pos.coords.accuracy),
        })
        setLocating(false)
      },
      (err) => {
        setLocationError("couldn't get location — please share manually 💜")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function cancelSOS() {
    setSosActive(false)
    setLocation(null)
    setLocationError("")
  }

  // ── Add Contact ──
  async function handleAddContact(e) {
    e.preventDefault()
    setSaving(true)
    try {
      await emergencyAPI.addContact({
        userId: currentUser.uid,
        ...newContact,
      })
      setNewContact({ name: "", phone: "", relationship: "friend" })
      setShowAddForm(false)
      await loadContacts()
    } catch (err) {
      alert(err.message)
    }
    setSaving(false)
  }

  // ── Delete Contact ──
  async function handleDelete(id) {
    if (!confirm("remove this contact?")) return
    try {
      await emergencyAPI.deleteContact(id)
      setContacts((prev) => prev.filter((c) => c._id !== id))
    } catch {
      alert("couldn't remove contact, please try again")
    }
  }

  // Google Maps link for current location
  const mapsLink = location
    ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
    : null

  return (
    <AppLayout>
      <div className="p-6 max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            sos emergency 🆘
          </h1>
          <p className="text-purple-400 text-sm">
            you are safe. help is one tap away 💜
          </p>
        </div>

        {/* ── SOS ACTIVE STATE ── */}
        {sosActive ? (
          <div className="space-y-5 mb-8">

            {/* Active alert banner */}
            <div className="p-5 rounded-2xl border-2 border-pink-300 text-center"
              style={{ background: "linear-gradient(135deg, #fce7f3, #fdf2f8)" }}>
              <div className="text-4xl mb-2 animate-pulse">🆘</div>
              <h2 className="text-lg font-bold text-pink-700 mb-1">
                sos activated
              </h2>
              <p className="text-sm text-pink-500">
                call your emergency contacts below or dial a helpline
              </p>
            </div>

            {/* Location card */}
            <div className="bg-white rounded-2xl border border-purple-100 p-5">
              <h3 className="text-sm font-semibold text-purple-700 mb-3">
                📍 your location
              </h3>
              {locating ? (
                <div className="flex items-center gap-2 text-purple-400 text-sm animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-purple-300 animate-ping" />
                  getting your location...
                </div>
              ) : location ? (
                <div className="space-y-2">
                  <p className="text-xs text-purple-500">
                    lat: {location.lat} · lng: {location.lng}
                  </p>
             <p className="text-xs text-purple-400">
  accuracy: ±{location.accuracy}m
</p>

<a
  href={mapsLink}
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-xl text-xs font-medium text-white"
  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}
>
  📍 open in google maps
</a>

<p className="text-xs text-purple-300 mt-1">
  share this link with someone you trust
</p>
                </div>
              ) : (
                <p className="text-sm text-pink-500">{locationError}</p>
              )}
            </div>

            {/* Emergency contacts to call */}
            {contacts.length > 0 && (
              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <h3 className="text-sm font-semibold text-purple-700 mb-3">
                  💜 call your trusted contacts
                </h3>
                <div className="space-y-2">
                  {contacts.map((c) => (
                    <a key={c._id} href={`tel:${c.phone}`}
                      className="flex items-center justify-between p-3 rounded-xl border border-purple-100 hover:bg-purple-50 transition-all">
                      <div>
                        <p className="text-sm font-medium text-purple-800">{c.name}</p>
                        <p className="text-xs text-purple-400">{c.relationship} · {c.phone}</p>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-base">
                        📞
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Cancel button */}
            <button onClick={cancelSOS}
              className="w-full py-3 rounded-xl text-sm font-medium text-purple-500 border-2 border-purple-200 hover:bg-purple-50 transition-all">
              i am safe now — cancel sos ✓
            </button>
          </div>

        ) : (

          /* ── NORMAL STATE ── */
          <div className="mb-8">
            {/* Big SOS button */}
            <div className="text-center py-10">
              <button
                onClick={triggerSOS}
                className="w-44 h-44 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 active:scale-95 transition-all border-4 border-pink-300 mx-auto flex flex-col items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #ec4899, #a855f7)" }}>
                <span className="text-4xl">🆘</span>
                <span>tap for sos</span>
              </button>
              <p className="text-xs text-purple-400 mt-6 max-w-xs mx-auto">
                pressing sos will capture your location and show your emergency contacts instantly
              </p>
            </div>
          </div>
        )}

        {/* ── National Helplines ── */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5 mb-6">
          <h2 className="text-sm font-semibold text-purple-700 mb-4">
            📞 national helplines — always available
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {helplines.map((h) => (
              <a key={h.number} href={`tel:${h.number}`}
                className="flex items-center gap-2 p-3 rounded-xl border border-purple-100 hover:bg-purple-50 transition-all">
                <span className="text-xl">{h.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-purple-700">{h.number}</p>
                  <p className="text-xs text-purple-400">{h.name}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Emergency Contacts Manager ── */}
        <div className="bg-white rounded-2xl border border-purple-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-purple-700">
                💜 my emergency contacts
              </h2>
              <p className="text-xs text-purple-400 mt-0.5">
                up to 5 trusted people
              </p>
            </div>
            {contacts.length < 5 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-3 py-1.5 rounded-xl text-xs font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                {showAddForm ? "cancel" : "+ add contact"}
              </button>
            )}
          </div>

          {/* Add Contact Form */}
          {showAddForm && (
            <form onSubmit={handleAddContact}
              className="mb-5 p-4 rounded-xl bg-purple-50 border border-purple-100 space-y-3">
              <div>
                <label className="block text-xs font-medium text-purple-600 mb-1">
                  name
                </label>
                <input
                  type="text"
                  required
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="e.g. mum, best friend"
                  className="w-full px-3 py-2 rounded-xl text-sm border-2 border-purple-100 bg-white focus:outline-none focus:border-purple-400 text-purple-800 placeholder:text-purple-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-600 mb-1">
                  phone number
                </label>
                <input
                  type="tel"
                  required
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl text-sm border-2 border-purple-100 bg-white focus:outline-none focus:border-purple-400 text-purple-800 placeholder:text-purple-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-600 mb-1">
                  relationship
                </label>
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl text-sm border-2 border-purple-100 bg-white focus:outline-none focus:border-purple-400 text-purple-800">
                  {relationships.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={saving}
                className="w-full py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                {saving ? "saving... 💜" : "save contact 💜"}
              </button>
            </form>
          )}

          {/* Contacts List */}
          {loadingContacts ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-purple-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">💜</p>
              <p className="text-sm text-purple-400">no emergency contacts yet</p>
              <p className="text-xs text-purple-300 mt-1">
                add trusted people who can help you in an emergency
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {contacts.map((c) => (
                <div key={c._id}
                  className="flex items-center justify-between p-3 rounded-xl border border-purple-100 hover:bg-purple-50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold text-white flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                      {c.name[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">{c.name}</p>
                      <p className="text-xs text-purple-400">{c.relationship} · {c.phone}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(c._id)}
                    className="text-xs text-pink-400 hover:text-pink-600 transition-colors px-2 py-1">
                    remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AppLayout>
  )
}

export default SOS