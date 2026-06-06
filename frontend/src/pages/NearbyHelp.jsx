// NearbyHelp.jsx - Find nearby police, hospitals and NGOs using Google Maps
import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

// Place types to search for
const categories = [
  {
    key: "police",
    label: "police stations",
    icon: "👮",
    color: "#eff6ff",
    border: "#bfdbfe",
    text: "#1d4ed8",
    query: "police station",
  },
  {
    key: "hospital",
    label: "hospitals",
    icon: "🏥",
    color: "#f0fdf4",
    border: "#bbf7d0",
    text: "#15803d",
    query: "hospital",
  },
  {
    key: "ngo",
    label: "women's ngos",
    icon: "🏢",
    color: "#f5f3ff",
    border: "#ddd6fe",
    text: "#6d28d9",
    query: "women ngo support centre",
  },
  {
    key: "pharmacy",
    label: "pharmacies",
    icon: "💊",
    color: "#fff7ed",
    border: "#fed7aa",
    text: "#c2410c",
    query: "pharmacy",
  },
]

// National helplines always visible
const helplines = [
  { name: "women helpline",    number: "1091", icon: "🆘" },
  { name: "police",            number: "100",  icon: "👮" },
  { name: "ambulance",         number: "108",  icon: "🚑" },
  { name: "domestic violence", number: "181",  icon: "💜" },
]

function NearbyHelp() {
  const [location, setLocation]       = useState(null)
  const [locError, setLocError]       = useState("")
  const [locating, setLocating]       = useState(false)
  const [activeCategory, setCategory] = useState(categories[0])
  const [places, setPlaces]           = useState([])
  const [searching, setSearching]     = useState(false)
  const [mapLoaded, setMapLoaded]     = useState(false)

  const mapRef     = useRef(null)
  const mapObjRef  = useRef(null)
  const serviceRef = useRef(null)
  const markersRef = useRef([])

  // Load Google Maps script dynamically
  useEffect(() => {
    if (!MAPS_KEY) return

    // Check if already loaded
    if (window.google) {
      setMapLoaded(true)
      return
    }

    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`
    script.async = true
    script.onload = () => setMapLoaded(true)
    script.onerror = () => setLocError("failed to load google maps")
    document.head.appendChild(script)
  }, [])

  // Initialize map once loaded and location is known
  useEffect(() => {
    if (!mapLoaded || !location || !mapRef.current) return

    mapObjRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: location.lat, lng: location.lng },
      zoom: 14,
      styles: [
        { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
      ],
    })

    // Add marker for user's location
    new window.google.maps.Marker({
      position: { lat: location.lat, lng: location.lng },
      map: mapObjRef.current,
      title: "you are here",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#a855f7",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    })

    serviceRef.current = new window.google.maps.places.PlacesService(
      mapObjRef.current
    )

    // Search for the default category
    searchNearby(activeCategory)
  }, [mapLoaded, location])

  // Get user location
  function getLocation() {
    setLocating(true)
    setLocError("")

    if (!navigator.geolocation) {
      setLocError("geolocation not supported on this device")
      setLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        })
        setLocating(false)
      },
      () => {
        setLocError("couldn't get your location 💜 please enable location access")
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // Clear existing markers from map
  function clearMarkers() {
    markersRef.current.forEach((m) => m.setMap(null))
    markersRef.current = []
  }

  // Search for nearby places using Google Places API
  function searchNearby(category) {
    if (!serviceRef.current || !location) return

    setSearching(true)
    setPlaces([])
    clearMarkers()

    const request = {
      location: new window.google.maps.LatLng(location.lat, location.lng),
      radius: 5000, // 5km radius
      query: category.query,
    }

    serviceRef.current.textSearch(request, (results, status) => {
      setSearching(false)

      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results.slice(0, 8)) // show top 8

        // Add markers for each result
        results.slice(0, 8).forEach((place, i) => {
          const marker = new window.google.maps.Marker({
            position: place.geometry.location,
            map: mapObjRef.current,
            title: place.name,
            label: {
              text: String(i + 1),
              color: "white",
              fontWeight: "bold",
              fontSize: "12px",
            },
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 14,
              fillColor: "#ec4899",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            },
          })
          markersRef.current.push(marker)
        })
      } else {
        setPlaces([])
      }
    })
  }

  function handleCategoryChange(cat) {
    setCategory(cat)
    if (location && serviceRef.current) {
      searchNearby(cat)
    }
  }

  // Open Google Maps directions
  function getDirections(place) {
    const dest = encodeURIComponent(place.name + " " + (place.vicinity || ""))
    window.open(
      `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${dest}`,
      "_blank"
    )
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            nearby help 📍
          </h1>
          <p className="text-purple-400 text-sm">
            find police stations, hospitals and ngos close to you 💜
          </p>
        </div>

        {/* Helplines strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {helplines.map((h) => (
            <a key={h.number} href={`tel:${h.number}`}
              className="flex items-center gap-2 p-3 rounded-xl bg-white border border-purple-100 hover:bg-purple-50 transition-all">
              <span className="text-xl">{h.icon}</span>
              <div>
                <p className="text-sm font-bold text-purple-700">{h.number}</p>
                <p className="text-xs text-purple-400">{h.name}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Location button */}
        {!location && (
          <div className="bg-white rounded-2xl border border-purple-100 p-8 text-center mb-6">
            <p className="text-4xl mb-3">📍</p>
            <h2 className="text-base font-semibold text-purple-700 mb-2">
              enable location to find nearby help
            </h2>
            <p className="text-sm text-purple-400 mb-6">
              we need your location to show places near you
            </p>
            <button
              onClick={getLocation}
              disabled={locating}
              className="px-6 py-3 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              {locating ? "getting location... 📍" : "share my location 📍"}
            </button>
            {locError && (
              <p className="text-sm text-pink-500 mt-3">{locError}</p>
            )}
          </div>
        )}

        {/* Map + Results */}
        {location && (
          <>
           {/* No Maps Key fallback */}
{!MAPS_KEY ? (
  <div className="mb-6 space-y-4">

    {/* Location confirmed */}
    <div className="bg-purple-50 rounded-2xl border border-purple-100 p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-lg flex-shrink-0">
        📍
      </div>
      <div>
        <p className="text-sm font-medium text-purple-700">
          location detected 💜
        </p>
        <p className="text-xs text-purple-400">
          {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
        </p>
      </div>
    </div>

    {/* One button per category */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {categories.map((cat) => (
        <a
          key={cat.key}
          href={`https://www.google.com/maps/search/${encodeURIComponent(
            cat.query
          )}/@${location.lat},${location.lng},14z`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-2xl border transition-all hover:scale-105"
          style={{
            background: cat.color,
            borderColor: cat.border,
          }}
        >
          <span className="text-2xl">{cat.icon}</span>

          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: cat.text }}
            >
              find {cat.label}
            </p>

            <p
              className="text-xs"
              style={{
                color: cat.text,
                opacity: 0.7,
              }}
            >
              opens google maps nearby
            </p>
          </div>

          <span
            className="ml-auto text-lg"
            style={{ color: cat.text }}
          >
            →
          </span>
        </a>
      ))}
    </div>

    {/* Directions from current location */}
    <div className="bg-white rounded-2xl border border-purple-100 p-4 text-center">
      <p className="text-xs text-purple-400 mb-3">
        or search everything around you at once
      </p>

      <a
        href={`https://www.google.com/maps/@${location.lat},${location.lng},15z`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
        style={{
          background:
            "linear-gradient(135deg, #a855f7, #ec4899)",
        }}
      >
        🗺️ open my location in google maps
      </a>
    </div>

  </div>
) : (
              /* Google Map */
              <div
                ref={mapRef}
                className="w-full rounded-2xl border border-purple-100 mb-6"
                style={{ height: "350px" }}
              />
            )}

            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 mb-5">
              {categories.map((cat) => (
                <button key={cat.key}
                  onClick={() => handleCategoryChange(cat)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                    activeCategory.key === cat.key
                      ? "text-white border-transparent"
                      : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
                  }`}
                  style={activeCategory.key === cat.key
                    ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                    : {}}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Results list */}
            {MAPS_KEY && (
              <div className="bg-white rounded-2xl border border-purple-100 p-5">
                <h2 className="text-sm font-semibold text-purple-700 mb-4">
                  {activeCategory.icon} nearby {activeCategory.label}
                </h2>

                {searching ? (
                  <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-16 bg-purple-50 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : places.length === 0 ? (
                  <p className="text-sm text-purple-400 text-center py-6">
                    no results found nearby 💜
                  </p>
                ) : (
                  <div className="space-y-3">
                    {places.map((place, i) => (
                      <div key={place.place_id}
                        className="flex items-center justify-between p-3 rounded-xl border border-purple-100 hover:bg-purple-50 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                            {i + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-purple-800">
                              {place.name}
                            </p>
                            <p className="text-xs text-purple-400">
                              {place.vicinity || place.formatted_address}
                            </p>
                            {place.rating && (
                              <p className="text-xs text-amber-500">
                                ⭐ {place.rating}
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => getDirections(place)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium text-purple-600 border border-purple-200 hover:bg-purple-100 transition-all flex-shrink-0">
                          directions 🗺️
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </AppLayout>
  )
}

export default NearbyHelp