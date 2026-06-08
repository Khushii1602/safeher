import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { MapPin, Phone, Navigation } from "lucide-react"

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY

const categories = [
  { key:"police",   label:"Police Stations", icon:"👮", query:"police station",        color:"#eff6ff", tc:"#1e40af" },
  { key:"hospital", label:"Hospitals",        icon:"🏥", query:"hospital",              color:"#f0fdf4", tc:"#166534" },
  { key:"ngo",      label:"Women's NGOs",     icon:"🏢", query:"women ngo support",     color:"#f5f3ff", tc:"#5b21b6" },
  { key:"pharmacy", label:"Pharmacies",       icon:"💊", query:"pharmacy",              color:"#fffbeb", tc:"#92400e" },
]

const helplines = [
  { name:"Women Helpline",    number:"1091", color:"#fef2f2", tc:"#991b1b" },
  { name:"Police",            number:"100",  color:"#eff6ff", tc:"#1e40af" },
  { name:"Ambulance",         number:"108",  color:"#f0fdf4", tc:"#166534" },
  { name:"Domestic Violence", number:"181",  color:"#f5f3ff", tc:"#5b21b6" },
]

export default function NearbyHelp() {
  const [location, setLocation]     = useState(null)
  const [locError, setLocError]     = useState("")
  const [locating, setLocating]     = useState(false)
  const [activeCategory, setCategory] = useState(categories[0])
  const [places, setPlaces]         = useState([])
  const [searching, setSearching]   = useState(false)
  const [mapLoaded, setMapLoaded]   = useState(false)
  const mapRef    = useRef(null)
  const mapObjRef = useRef(null)
  const serviceRef= useRef(null)
  const markersRef= useRef([])

  useEffect(()=>{
    if(!MAPS_KEY) return
    if(window.google){ setMapLoaded(true); return }
    const s=document.createElement("script")
    s.src=`https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places`
    s.async=true; s.onload=()=>setMapLoaded(true); s.onerror=()=>setLocError("Failed to load Google Maps")
    document.head.appendChild(s)
  },[])

  useEffect(()=>{
    if(!mapLoaded||!location||!mapRef.current) return
    mapObjRef.current=new window.google.maps.Map(mapRef.current,{ center:{lat:location.lat,lng:location.lng}, zoom:14 })
    new window.google.maps.Marker({ position:{lat:location.lat,lng:location.lng}, map:mapObjRef.current, title:"You are here" })
    serviceRef.current=new window.google.maps.places.PlacesService(mapObjRef.current)
    searchNearby(activeCategory)
  },[mapLoaded,location])

  function getLocation() {
    setLocating(true); setLocError("")
    if(!navigator.geolocation){ setLocError("Geolocation not supported"); setLocating(false); return }
    navigator.geolocation.getCurrentPosition(
      p=>{ setLocation({lat:p.coords.latitude,lng:p.coords.longitude}); setLocating(false) },
      ()=>{ setLocError("Could not get your location. Please enable location access."); setLocating(false) },
      {enableHighAccuracy:true,timeout:10000}
    )
  }

  function clearMarkers(){ markersRef.current.forEach(m=>m.setMap(null)); markersRef.current=[] }

  function searchNearby(cat) {
    if(!serviceRef.current||!location) return
    setSearching(true); setPlaces([]); clearMarkers()
    serviceRef.current.textSearch({ location:new window.google.maps.LatLng(location.lat,location.lng), radius:5000, query:cat.query },(results,status)=>{
      setSearching(false)
      if(status===window.google.maps.places.PlacesServiceStatus.OK){
        setPlaces(results.slice(0,8))
        results.slice(0,8).forEach((place,i)=>{
          const m=new window.google.maps.Marker({ position:place.geometry.location, map:mapObjRef.current, title:place.name, label:{text:String(i+1),color:"white",fontWeight:"bold",fontSize:"12px"} })
          markersRef.current.push(m)
        })
      }
    })
  }

  function handleCategory(cat){ setCategory(cat); if(location&&serviceRef.current) searchNearby(cat) }

  function getDirections(place) {
    const dest=encodeURIComponent(place.name+" "+(place.vicinity||""))
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${dest}`,"_blank")
  }

  return (
    <AppLayout>
      <div style={{ padding:"40px 48px", maxWidth:1000, margin:"0 auto" }}>

        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-1px", marginBottom:6 }}>Nearby Help</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}>Find police stations, hospitals and NGOs close to you.</p>
        </div>

        {/* Helplines */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:24 }}>
          {helplines.map(h=>(
            <a key={h.number} href={`tel:${h.number}`} style={{ display:"flex", alignItems:"center", gap:12, padding:"16px 18px", borderRadius:14, background:h.color, textDecoration:"none", transition:"all 0.15s" }}
              onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.currentTarget.style.transform=""}>
              <Phone size={16} color={h.tc}/>
              <div>
                <p style={{ fontSize:18, fontWeight:800, color:h.tc, letterSpacing:"-0.5px" }}>{h.number}</p>
                <p style={{ fontSize:11, color:h.tc, opacity:0.7 }}>{h.name}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Location */}
        {!location ? (
          <div className="card" style={{ padding:48, textAlign:"center" }}>
            <div style={{ width:64, height:64, borderRadius:20, background:"var(--purple-light)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <MapPin size={28} color="var(--purple)"/>
            </div>
            <h2 style={{ fontSize:18, fontWeight:800, color:"var(--text-1)", marginBottom:8 }}>Enable Location</h2>
            <p style={{ fontSize:14, color:"var(--text-3)", marginBottom:24, maxWidth:320, margin:"0 auto 24px" }}>
              We need your location to show nearby help options.
            </p>
            <button onClick={getLocation} disabled={locating} className="btn btn-purple">
              <Navigation size={16}/> {locating ? "Getting Location..." : "Share My Location"}
            </button>
            {locError && <p style={{ fontSize:13, color:"var(--red)", marginTop:16 }}>{locError}</p>}
          </div>
        ) : (
          <>
            {/* Location confirmed */}
            <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 18px", borderRadius:12, background:"var(--green-light)", border:"1px solid #a7f3d0", marginBottom:20 }}>
              <MapPin size={16} color="var(--green)"/>
              <p style={{ fontSize:13, fontWeight:600, color:"#065f46" }}>
                Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            </div>

            {/* Map or fallback */}
            {MAPS_KEY ? (
              <div ref={mapRef} style={{ width:"100%", height:320, borderRadius:20, border:"1px solid var(--border)", marginBottom:20, overflow:"hidden" }}/>
            ) : (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12, marginBottom:20 }}>
                {categories.map(cat=>(
                  <a key={cat.key} href={`https://www.google.com/maps/search/${encodeURIComponent(cat.query)}/@${location.lat},${location.lng},14z`} target="_blank" rel="noopener noreferrer"
                    style={{ display:"flex", alignItems:"center", gap:14, padding:"20px", borderRadius:16, background:cat.color, textDecoration:"none", transition:"all 0.15s", border:"1px solid transparent" }}
                    onMouseEnter={e=>{ e.currentTarget.style.transform="translateY(-2px)"; e.currentTarget.style.boxShadow="var(--shadow-sm)" }}
                    onMouseLeave={e=>{ e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="" }}>
                    <span style={{ fontSize:24 }}>{cat.icon}</span>
                    <div style={{ flex:1 }}>
                      <p style={{ fontSize:14, fontWeight:700, color:cat.tc, marginBottom:2 }}>Find {cat.label}</p>
                      <p style={{ fontSize:12, color:cat.tc, opacity:0.7 }}>Opens Google Maps nearby</p>
                    </div>
                    <Navigation size={16} color={cat.tc}/>
                  </a>
                ))}
              </div>
            )}

            {/* Category tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {categories.map(cat=>(
                <button key={cat.key} onClick={()=>handleCategory(cat)} style={{
                  padding:"8px 18px", borderRadius:100, fontSize:13, fontWeight:600,
                  border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
                  background: activeCategory.key===cat.key ? "var(--black)" : "var(--white)",
                  color: activeCategory.key===cat.key ? "white" : "var(--text-2)",
                  borderColor: activeCategory.key===cat.key ? "var(--black)" : "var(--border)",
                }}>
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Results */}
            {MAPS_KEY && (
              <div className="card" style={{ padding:24 }}>
                <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", marginBottom:16 }}>
                  Nearby {activeCategory.label}
                </h2>
                {searching ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {[...Array(4)].map((_,i)=><div key={i} style={{ height:64, borderRadius:12, background:"var(--border)", opacity:0.4 }}/>)}
                  </div>
                ) : places.length===0 ? (
                  <p style={{ fontSize:14, color:"var(--text-3)", textAlign:"center", padding:"32px 0" }}>No results found nearby</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {places.map((place,i)=>(
                      <div key={place.place_id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderRadius:12, border:"1px solid var(--border)", background:"var(--white)" }}>
                        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
                          <div style={{ width:28, height:28, borderRadius:8, background:"var(--black)", color:"white", display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, fontWeight:800, flexShrink:0 }}>
                            {i+1}
                          </div>
                          <div>
                            <p style={{ fontSize:14, fontWeight:600, color:"var(--text-1)" }}>{place.name}</p>
                            <p style={{ fontSize:12, color:"var(--text-3)" }}>{place.vicinity||place.formatted_address}</p>
                            {place.rating && <p style={{ fontSize:11, color:"#d97706", marginTop:2 }}>★ {place.rating}</p>}
                          </div>
                        </div>
                        <button onClick={()=>getDirections(place)} className="btn btn-outline btn-sm" style={{ flexShrink:0 }}>
                          <Navigation size={13}/> Directions
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