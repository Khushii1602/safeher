import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { evidenceAPI } from "@/lib/api"
import { Upload, FileImage, FileAudio, FileVideo, File, Download, Trash2, X, Lock, Eye } from "lucide-react"

function getIcon(type) {
  if(type?.startsWith("image/")) return FileImage
  if(type?.startsWith("audio/")) return FileAudio
  if(type?.startsWith("video/")) return FileVideo
  return File
}

function getColor(type) {
  if(type?.startsWith("image/")) return { bg:"#f5f3ff", color:"#6d28d9" }
  if(type?.startsWith("audio/")) return { bg:"#f0fdf4", color:"#059669" }
  if(type?.startsWith("video/")) return { bg:"#eff6ff", color:"#2563eb" }
  if(type?.includes("pdf"))      return { bg:"#fef2f2", color:"#dc2626" }
  return { bg:"#f9fafb", color:"#374151" }
}

function formatBytes(b) {
  if(b<1024) return b+" B"
  if(b<1024*1024) return (b/1024).toFixed(1)+" KB"
  return (b/(1024*1024)).toFixed(1)+" MB"
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN",{ day:"numeric", month:"short", year:"numeric" })
}

function ViewModal({ fileId, fileName, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    evidenceAPI.getFile(fileId).then(r=>{ setData(r.data); setLoading(false) }).catch(onClose)
  },[fileId])

  function download() {
    const a = document.createElement("a")
    a.href = `data:${data.fileType};base64,${data.fileData}`
    a.download = data.name; a.click()
  }

  return (
    <div style={{ position:"fixed", inset:0, zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:24, background:"rgba(0,0,0,0.5)", backdropFilter:"blur(4px)" }}>
      <div className="card" style={{ width:"100%", maxWidth:520, padding:28 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
          <h3 style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", flex:1, marginRight:16, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{fileName}</h3>
          <button onClick={onClose} style={{ background:"none", border:"none", cursor:"pointer", color:"var(--text-3)", flexShrink:0 }}><X size={20}/></button>
        </div>
        {loading ? (
          <div style={{ height:200, borderRadius:12, background:"var(--bg-muted)", animation:"pulse 1.5s infinite" }} />
        ) : data && (
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {data.fileType?.startsWith("image/") && <img src={`data:${data.fileType};base64,${data.fileData}`} alt={data.name} style={{ width:"100%", borderRadius:12, maxHeight:300, objectFit:"contain" }} />}
            {data.fileType?.startsWith("audio/") && <audio controls style={{ width:"100%" }}><source src={`data:${data.fileType};base64,${data.fileData}`}/></audio>}
            {data.fileType?.startsWith("video/") && <video controls style={{ width:"100%", borderRadius:12, maxHeight:300 }}><source src={`data:${data.fileType};base64,${data.fileData}`}/></video>}
            {!data.fileType?.startsWith("image/") && !data.fileType?.startsWith("audio/") && !data.fileType?.startsWith("video/") && (
              <div style={{ textAlign:"center", padding:"32px 0", background:"var(--bg-muted)", borderRadius:12 }}>
                <File size={32} color="var(--text-3)" style={{ margin:"0 auto 8px" }}/>
                <p style={{ fontSize:13, color:"var(--text-3)" }}>Preview not available</p>
              </div>
            )}
            {data.description && <p style={{ fontSize:13, color:"var(--text-2)", fontStyle:"italic", padding:"10px 14px", background:"var(--bg-muted)", borderRadius:8 }}>"{data.description}"</p>}
            <button onClick={download} className="btn btn-purple" style={{ width:"100%" }}>
              <Download size={16}/> Download File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FileCard({ file, onDelete, onView }) {
  const c = getColor(file.fileType)
  const Icon = getIcon(file.fileType)
  const [del, setDel] = useState(false)

  return (
    <div className="card" style={{ padding:20 }}>
      <div style={{ display:"flex", gap:14, marginBottom:14 }}>
        <div style={{ width:44, height:44, borderRadius:12, background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <Icon size={20} color={c.color} />
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"var(--text-1)", marginBottom:2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{file.name}</p>
          <p style={{ fontSize:11, color:"var(--text-3)" }}>{formatBytes(file.fileSize)} · {formatDate(file.createdAt)}</p>
        </div>
      </div>
      {file.description && <p style={{ fontSize:12, color:"var(--text-2)", fontStyle:"italic", marginBottom:14, padding:"8px 12px", background:"var(--bg-muted)", borderRadius:8 }}>"{file.description}"</p>}
      <div style={{ display:"flex", gap:8 }}>
        <button onClick={()=>onView(file._id, file.name)} className="btn btn-outline btn-sm" style={{ flex:1 }}>
          <Eye size={13}/> View
        </button>
        <button onClick={async()=>{ if(!confirm(`Delete "${file.name}"?`)) return; setDel(true); await onDelete(file._id); setDel(false) }} disabled={del} style={{ padding:"8px 12px", borderRadius:8, border:"1.5px solid var(--border)", background:"var(--white)", cursor:"pointer", color:"var(--text-3)", transition:"all 0.15s" }}
          onMouseEnter={e=>{ e.currentTarget.style.background="#fef2f2"; e.currentTarget.style.color="var(--red)" }}
          onMouseLeave={e=>{ e.currentTarget.style.background="var(--white)"; e.currentTarget.style.color="var(--text-3)" }}>
          <Trash2 size={14}/>
        </button>
      </div>
    </div>
  )
}

export default function EvidenceVault() {
  const { currentUser } = useAuth()
  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [desc, setDesc]         = useState("")
  const [error, setError]       = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter]     = useState("all")
  const [viewing, setViewing]   = useState(null)
  const fileInputRef = useRef(null)

  useEffect(()=>{ if(currentUser?.uid) load() },[currentUser])

  async function load() {
    setLoading(true)
    try { const r=await evidenceAPI.getAll(currentUser.uid); setFiles(r.data) } catch { setFiles([]) }
    setLoading(false)
  }

  async function upload(file) {
    if(!file) return
    if(file.size>5*1024*1024) { setError("File too large — maximum 5MB"); return }
    setUploading(true); setProgress(30); setError("")
    try {
      const base64 = await new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file) })
      setProgress(70)
      await evidenceAPI.upload({ userId:currentUser.uid, name:file.name, description:desc||"", fileType:file.type, fileSize:file.size, fileData:base64 })
      setProgress(100); setDesc(""); await load()
    } catch(err) { setError(err.message||"Upload failed. Please try again.") }
    setUploading(false); setProgress(0)
  }

  const filtered = files.filter(f=>{
    if(filter==="all") return true
    if(filter==="images") return f.fileType?.startsWith("image/")
    if(filter==="audio")  return f.fileType?.startsWith("audio/")
    if(filter==="docs")   return f.fileType?.includes("pdf")||f.fileType?.includes("word")||f.fileType?.includes("text")
    return true
  })

  return (
    <AppLayout>
      <div style={{ padding:"40px 48px", maxWidth:1000, margin:"0 auto" }}>

        <div style={{ marginBottom:36 }}>
          <h1 style={{ fontSize:30, fontWeight:800, letterSpacing:"-1px", marginBottom:6 }}>Evidence Vault</h1>
          <p style={{ fontSize:14, color:"var(--text-3)" }}>Securely store photos, audio and documents — only you can access these.</p>
        </div>

        {/* Upload */}
        <div className="card" style={{ padding:28, marginBottom:24 }}>
          <h2 style={{ fontSize:15, fontWeight:700, color:"var(--text-1)", marginBottom:20 }}>Upload Evidence</h2>

          <input type="text" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Add a description (optional)..." className="input" style={{ marginBottom:16 }} />

          <div
            onDragOver={e=>{ e.preventDefault(); setDragOver(true) }}
            onDragLeave={()=>setDragOver(false)}
            onDrop={e=>{ e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]) }}
            onClick={()=>!uploading&&fileInputRef.current?.click()}
            style={{
              border:`2px dashed ${dragOver ? "var(--purple)" : "var(--border)"}`,
              borderRadius:16, padding:40, textAlign:"center",
              cursor:"pointer", transition:"all 0.2s",
              background: dragOver ? "var(--purple-light)" : "var(--bg)",
            }}>
            {uploading ? (
              <div>
                <Upload size={28} color="var(--purple)" style={{ margin:"0 auto 12px" }}/>
                <p style={{ fontSize:14, fontWeight:600, color:"var(--text-1)", marginBottom:12 }}>Uploading... {progress}%</p>
                <div style={{ height:4, borderRadius:99, background:"var(--border)", maxWidth:240, margin:"0 auto" }}>
                  <div style={{ height:4, borderRadius:99, background:"var(--purple)", width:`${progress}%`, transition:"width 0.3s" }}/>
                </div>
              </div>
            ) : (
              <>
                <Upload size={28} color="var(--text-3)" style={{ margin:"0 auto 12px" }}/>
                <p style={{ fontSize:14, fontWeight:600, color:"var(--text-1)", marginBottom:4 }}>Drag and drop a file here</p>
                <p style={{ fontSize:13, color:"var(--text-3)", marginBottom:16 }}>or click to browse — images, audio, video, PDF</p>
                <div className="btn btn-outline btn-sm" style={{ display:"inline-flex", pointerEvents:"none" }}>
                  Choose File
                </div>
                <p style={{ fontSize:11, color:"var(--text-3)", marginTop:12 }}>Maximum 5MB per file</p>
              </>
            )}
          </div>
          <input ref={fileInputRef} type="file" onChange={e=>{ upload(e.target.files[0]); e.target.value="" }} accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" style={{ display:"none" }}/>
          {error && <p style={{ fontSize:13, color:"var(--red)", marginTop:12, padding:"10px 14px", background:"#fef2f2", borderRadius:8 }}>{error}</p>}
        </div>

        {/* Files */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <div style={{ display:"flex", gap:8 }}>
            {["all","images","audio","docs"].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} style={{
                padding:"7px 16px", borderRadius:100, fontSize:12, fontWeight:600,
                border:"1.5px solid", cursor:"pointer", transition:"all 0.15s",
                background: filter===f ? "var(--black)" : "var(--white)",
                color: filter===f ? "white" : "var(--text-2)",
                borderColor: filter===f ? "var(--black)" : "var(--border)",
              }}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </button>
            ))}
          </div>
          <p style={{ fontSize:12, color:"var(--text-3)" }}>{filtered.length} file{filtered.length!==1?"s":""}</p>
        </div>

        {loading ? (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {[...Array(3)].map((_,i)=><div key={i} style={{ height:160, borderRadius:16, background:"var(--border)", opacity:0.4 }}/>)}
          </div>
        ) : filtered.length===0 ? (
          <div style={{ textAlign:"center", padding:"64px 0", background:"var(--white)", borderRadius:20, border:"1px solid var(--border)" }}>
            <Lock size={32} color="var(--text-3)" style={{ margin:"0 auto 12px" }}/>
            <p style={{ fontSize:15, fontWeight:600, color:"var(--text-1)", marginBottom:4 }}>Your vault is empty</p>
            <p style={{ fontSize:13, color:"var(--text-3)" }}>Upload files to keep them safe and private</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {filtered.map(f=><FileCard key={f._id} file={f} onDelete={async id=>{ await evidenceAPI.delete(id); setFiles(p=>p.filter(f=>f._id!==id)) }} onView={(id,name)=>setViewing({id,name})}/>)}
          </div>
        )}

        {/* Privacy note */}
        <div style={{ display:"flex", gap:14, padding:"18px 22px", borderRadius:14, background:"var(--purple-light)", border:"1px solid #ddd6fe", marginTop:24 }}>
          <Lock size={18} color="var(--purple)" style={{ flexShrink:0, marginTop:2 }}/>
          <p style={{ fontSize:13, color:"#5b21b6", lineHeight:1.6 }}>
            Files are stored securely in your private database. Only you can access your vault — not even SafeHer administrators can view your files.
          </p>
        </div>

      </div>
      {viewing && <ViewModal fileId={viewing.id} fileName={viewing.name} onClose={()=>setViewing(null)}/>}
    </AppLayout>
  )
}