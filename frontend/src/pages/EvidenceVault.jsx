import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { evidenceAPI } from "@/lib/api"
import {
  Upload, FileImage, FileAudio, FileVideo, File,
  Download, Trash2, X, Lock, Eye, ShieldCheck,
  HardDrive, AlertCircle
} from "lucide-react"

function getIcon(type) {
  if (type?.startsWith("image/")) return FileImage
  if (type?.startsWith("audio/")) return FileAudio
  if (type?.startsWith("video/")) return FileVideo
  return File
}

function getCategory(type) {
  if (type?.startsWith("image/")) return "Image"
  if (type?.startsWith("audio/")) return "Audio"
  if (type?.startsWith("video/")) return "Video"
  if (type?.includes("pdf"))      return "PDF"
  if (type?.includes("word"))     return "Document"
  return "File"
}

function getCategoryColor(type) {
  if (type?.startsWith("image/")) return { bg: "#f5f3ff", text: "#6d28d9" }
  if (type?.startsWith("audio/")) return { bg: "#f0fdf4", text: "#059669" }
  if (type?.startsWith("video/")) return { bg: "#eff6ff", text: "#2563eb" }
  if (type?.includes("pdf"))      return { bg: "#fef2f2", text: "#dc2626" }
  return { bg: "#f9fafb", text: "#374151" }
}

function formatBytes(b) {
  if (b < 1024) return b + " B"
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB"
  return (b / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
}

function ViewModal({ fileId, fileName, onClose }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    evidenceAPI.getFile(fileId).then(r => { setData(r.data); setLoading(false) }).catch(onClose)
  }, [fileId])

  function download() {
    const a = document.createElement("a")
    a.href = `data:${data.fileType};base64,${data.fileData}`
    a.download = data.name; a.click()
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}>
      <div style={{ width: "100%", maxWidth: 560, background: "var(--white)", borderRadius: 24, padding: 32, boxShadow: "var(--shadow-lg)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", flex: 1, marginRight: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>
            {fileName}
          </h3>
          <button onClick={onClose} style={{ background: "var(--bg-muted)", border: "none", cursor: "pointer", color: "var(--text-2)", padding: 8, borderRadius: 8 }}>
            <X size={18} />
          </button>
        </div>
        {loading ? (
          <div style={{ height: 220, borderRadius: 14, background: "var(--bg-muted)", animation: "pulse 1.5s infinite" }} />
        ) : data && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {data.fileType?.startsWith("image/") && (
              <img src={`data:${data.fileType};base64,${data.fileData}`} alt={data.name} style={{ width: "100%", borderRadius: 14, maxHeight: 320, objectFit: "contain", background: "var(--bg-muted)" }} />
            )}
            {data.fileType?.startsWith("audio/") && (
              <audio controls style={{ width: "100%" }}>
                <source src={`data:${data.fileType};base64,${data.fileData}`} />
              </audio>
            )}
            {data.fileType?.startsWith("video/") && (
              <video controls style={{ width: "100%", borderRadius: 14, maxHeight: 320 }}>
                <source src={`data:${data.fileType};base64,${data.fileData}`} />
              </video>
            )}
            {!data.fileType?.startsWith("image/") && !data.fileType?.startsWith("audio/") && !data.fileType?.startsWith("video/") && (
              <div style={{ textAlign: "center", padding: "40px 0", background: "var(--bg-muted)", borderRadius: 14 }}>
                <File size={40} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, color: "var(--text-3)" }}>Preview not available for this file type</p>
              </div>
            )}
            {data.description && (
              <div style={{ padding: "12px 16px", background: "var(--bg-muted)", borderRadius: 10, border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Description</p>
                <p style={{ fontSize: 13, color: "var(--text-2)", fontStyle: "italic" }}>{data.description}</p>
              </div>
            )}
            <button onClick={download} className="btn btn-purple" style={{ width: "100%" }}>
              <Download size={16} /> Download File
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function EvidenceVault() {
  const { currentUser } = useAuth()
  const [files, setFiles]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress]   = useState(0)
  const [desc, setDesc]           = useState("")
  const [error, setError]         = useState("")
  const [dragOver, setDragOver]   = useState(false)
  const [filter, setFilter]       = useState("all")
  const [viewing, setViewing]     = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => { if (currentUser?.uid) loadFiles() }, [currentUser])

  async function loadFiles() {
    setLoading(true)
    try { const r = await evidenceAPI.getAll(currentUser.uid); setFiles(r.data) } catch { setFiles([]) }
    setLoading(false)
  }

  async function upload(file) {
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError("File too large — maximum size is 5MB per file"); return }
    setUploading(true); setProgress(30); setError("")
    try {
      const base64 = await new Promise((res, rej) => {
        const r = new FileReader(); r.onload = () => res(r.result.split(",")[1]); r.onerror = rej; r.readAsDataURL(file)
      })
      setProgress(70)
      await evidenceAPI.upload({ userId: currentUser.uid, name: file.name, description: desc || "", fileType: file.type, fileSize: file.size, fileData: base64 })
      setProgress(100); setDesc(""); await loadFiles()
    } catch (err) { setError(err.message || "Upload failed. Please try again.") }
    setUploading(false); setProgress(0)
  }

  const filtered = files.filter(f => {
    if (filter === "all")    return true
    if (filter === "images") return f.fileType?.startsWith("image/")
    if (filter === "audio")  return f.fileType?.startsWith("audio/")
    if (filter === "docs")   return f.fileType?.includes("pdf") || f.fileType?.includes("word") || f.fileType?.includes("text")
    return true
  })

  const totalSize = files.reduce((a, f) => a + f.fileSize, 0)

  return (
    <AppLayout>
      <div style={{ padding: "48px 48px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "flex-start", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--purple)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10 }}>
              Secure Storage
            </p>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "-1.5px", color: "var(--text-1)", marginBottom: 8 }}>
              Evidence Vault
            </h1>
            <p style={{ fontSize: 16, color: "var(--text-3)" }}>
              Securely store important files and documents. Only you can access them.
            </p>
          </div>
          {/* Storage indicator */}
          <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 16, padding: "20px 24px", minWidth: 200 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <HardDrive size={16} color="var(--purple)" />
              <span style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)" }}>Storage Used</span>
            </div>
            <p style={{ fontSize: 22, fontWeight: 900, color: "var(--text-1)", letterSpacing: "-0.5px", marginBottom: 4 }}>
              {formatBytes(totalSize)}
            </p>
            <p style={{ fontSize: 11, color: "var(--text-3)" }}>{files.length} files stored</p>
          </div>
        </div>

        {/* Security notice */}
        <div style={{ display: "flex", gap: 14, padding: "16px 22px", borderRadius: 14, background: "var(--purple-light)", border: "1.5px solid #ddd6fe", marginBottom: 32 }}>
          <ShieldCheck size={20} color="var(--purple)" style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--purple)", marginBottom: 2 }}>End-to-End Security</p>
            <p style={{ fontSize: 13, color: "#5b21b6", lineHeight: 1.6 }}>
              Files are encrypted and stored in a private database. Only you can access your vault — not even SafeHer administrators can view your files.
            </p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24 }}>

          {/* Left — file list */}
          <div>
            {/* Filter + count */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 8 }}>
                {["all", "images", "audio", "docs"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: "7px 16px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                    border: "1.5px solid", cursor: "pointer", transition: "all 0.15s",
                    background: filter === f ? "var(--black)" : "var(--white)",
                    color: filter === f ? "white" : "var(--text-2)",
                    borderColor: filter === f ? "var(--black)" : "var(--border)",
                  }}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-3)" }}>
                {filtered.length} file{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* File table */}
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[...Array(4)].map((_, i) => <div key={i} style={{ height: 64, borderRadius: 12, background: "var(--border)", opacity: 0.3 }} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 0", background: "var(--white)", borderRadius: 20, border: "1.5px solid var(--border)" }}>
                <Lock size={40} color="var(--text-3)" style={{ margin: "0 auto 16px" }} />
                <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-1)", marginBottom: 8 }}>Your vault is empty</p>
                <p style={{ fontSize: 14, color: "var(--text-3)" }}>Upload files to keep them safe and private</p>
              </div>
            ) : (
              <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, overflow: "hidden" }}>
                {/* Table header */}
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto", gap: 16, padding: "14px 20px", borderBottom: "1px solid var(--border)", background: "var(--bg-muted)" }}>
                  {["File Name", "Category", "Date Added", "Size", ""].map(h => (
                    <p key={h} style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</p>
                  ))}
                </div>
                {/* Table rows */}
                {filtered.map((file, i) => {
                  const Icon = getIcon(file.fileType)
                  const cc = getCategoryColor(file.fileType)
                  return (
                    <div key={file._id} style={{
                      display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr auto",
                      gap: 16, padding: "16px 20px", alignItems: "center",
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "background 0.15s"
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-muted)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: cc.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <Icon size={18} color={cc.text} />
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {file.name}
                          </p>
                          {file.description && (
                            <p style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>
                              {file.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: cc.bg, color: cc.text, display: "inline-block" }}>
                        {getCategory(file.fileType)}
                      </span>
                      <p style={{ fontSize: 13, color: "var(--text-3)" }}>{formatDate(file.createdAt)}</p>
                      <p style={{ fontSize: 13, color: "var(--text-3)" }}>{formatBytes(file.fileSize)}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setViewing({ id: file._id, name: file.name })} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--purple)"; e.currentTarget.style.color = "var(--purple)" }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)" }}>
                          <Eye size={14} />
                        </button>
                        <button onClick={async () => { if (!confirm(`Delete "${file.name}"?`)) return; await evidenceAPI.delete(file._id); setFiles(p => p.filter(f => f._id !== file._id)) }} style={{ width: 32, height: 32, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--white)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
                          onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "var(--red)" }}
                          onMouseLeave={e => { e.currentTarget.style.background = "var(--white)"; e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-2)" }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Right — upload */}
          <div>
            <div style={{ background: "var(--white)", border: "1.5px solid var(--border)", borderRadius: 20, padding: "28px", position: "sticky", top: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-1)", marginBottom: 20, letterSpacing: "-0.3px" }}>
                Upload Evidence
              </h2>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 8 }}>
                  Description
                </label>
                <input type="text" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Add context or notes..."
                  style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: "1.5px solid var(--border)", fontSize: 13, fontFamily: "inherit", outline: "none", color: "var(--text-1)", transition: "border-color 0.2s" }}
                  onFocus={e => e.target.style.borderColor = "var(--purple)"}
                  onBlur={e => e.target.style.borderColor = "var(--border)"} />
              </div>

              {/* Drop zone */}
              <div
                onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); upload(e.dataTransfer.files[0]) }}
                onClick={() => !uploading && fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${dragOver ? "var(--purple)" : "var(--border)"}`,
                  borderRadius: 16, padding: "32px 24px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s",
                  background: dragOver ? "var(--purple-light)" : "var(--bg)",
                  marginBottom: 16
                }}>
                {uploading ? (
                  <div>
                    <Upload size={28} color="var(--purple)" style={{ margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 12 }}>
                      Uploading... {progress}%
                    </p>
                    <div style={{ height: 4, borderRadius: 99, background: "var(--border)" }}>
                      <div style={{ height: 4, borderRadius: 99, background: "var(--purple)", width: `${progress}%`, transition: "width 0.3s" }} />
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload size={28} color="var(--text-3)" style={{ margin: "0 auto 12px" }} />
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-1)", marginBottom: 6 }}>
                      Drag and drop here
                    </p>
                    <p style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 16 }}>
                      or click to browse files
                    </p>
                    <div className="btn btn-outline btn-sm" style={{ display: "inline-flex", pointerEvents: "none" }}>
                      Choose File
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 12 }}>
                      Images, audio, video, PDF · Max 5MB
                    </p>
                  </>
                )}
              </div>

              <input ref={fileInputRef} type="file" onChange={e => { upload(e.target.files[0]); e.target.value = "" }} accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" style={{ display: "none" }} />

              {error && (
                <div style={{ display: "flex", gap: 8, padding: "10px 14px", borderRadius: 10, background: "#fef2f2", border: "1px solid #fecaca", marginTop: 12 }}>
                  <AlertCircle size={15} color="var(--red)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 12, color: "#991b1b" }}>{error}</p>
                </div>
              )}

              {/* Accepted types */}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
                  Accepted File Types
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    { icon: FileImage, label: "Images",    types: "JPG, PNG, GIF" },
                    { icon: FileAudio, label: "Audio",     types: "MP3, WAV, M4A" },
                    { icon: FileVideo, label: "Video",     types: "MP4, MOV, AVI" },
                    { icon: File,      label: "Documents", types: "PDF, DOC, TXT" },
                  ].map(t => {
                    const Icon = t.icon
                    return (
                      <div key={t.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 8, background: "var(--bg-muted)" }}>
                        <Icon size={14} color="var(--text-3)" />
                        <div>
                          <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-2)" }}>{t.label}</p>
                          <p style={{ fontSize: 10, color: "var(--text-3)" }}>{t.types}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {viewing && <ViewModal fileId={viewing.id} fileName={viewing.name} onClose={() => setViewing(null)} />}
    </AppLayout>
  )
}