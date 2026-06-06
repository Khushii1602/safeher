import { useState, useEffect, useRef } from "react"
import AppLayout from "@/components/layout/AppLayout"
import { useAuth } from "@/context/AuthContext"
import { evidenceAPI } from "@/lib/api"

function getFileIcon(type) {
  if (type?.startsWith("image/")) return "🖼️"
  if (type?.startsWith("audio/")) return "🎵"
  if (type?.startsWith("video/")) return "🎥"
  if (type?.includes("pdf"))      return "📄"
  return "📎"
}

function getFileColor(type) {
  if (type?.startsWith("image/"))
    return { bg: "#fdf4ff", border: "#e9d5ff", text: "#7e22ce" }
  if (type?.startsWith("audio/"))
    return { bg: "#f0fdf4", border: "#bbf7d0", text: "#15803d" }
  if (type?.startsWith("video/"))
    return { bg: "#eff6ff", border: "#bfdbfe", text: "#1d4ed8" }
  if (type?.includes("pdf"))
    return { bg: "#fce7f3", border: "#fbcfe8", text: "#be185d" }
  return { bg: "#f5f3ff", border: "#ddd6fe", text: "#6d28d9" }
}

function formatBytes(bytes) {
  if (bytes < 1024)         return bytes + " B"
  if (bytes < 1024 * 1024)  return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// View/Download modal
function ViewModal({ fileId, fileName, onClose }) {
  const [fileData, setFileData] = useState(null)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await evidenceAPI.getFile(fileId)
        setFileData(res.data)
      } catch {
        onClose()
      }
      setLoading(false)
    }
    load()
  }, [fileId])

  function handleDownload() {
    const link    = document.createElement("a")
    link.href     = `data:${fileData.fileType};base64,${fileData.fileData}`
    link.download = fileData.name
    link.click()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(88,28,135,0.4)" }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg border border-purple-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-purple-800 truncate pr-4">
            {fileName}
          </h3>
          <button onClick={onClose}
            className="text-purple-400 hover:text-purple-600 text-2xl flex-shrink-0">
            ×
          </button>
        </div>

        {loading ? (
          <div className="h-48 bg-purple-50 rounded-xl animate-pulse" />
        ) : fileData ? (
          <div className="space-y-4">
            {/* Preview */}
            {fileData.fileType?.startsWith("image/") && (
              <img
                src={`data:${fileData.fileType};base64,${fileData.fileData}`}
                alt={fileData.name}
                className="w-full rounded-xl object-contain max-h-64"
              />
            )}
            {fileData.fileType?.startsWith("audio/") && (
              <audio controls className="w-full">
                <source src={`data:${fileData.fileType};base64,${fileData.fileData}`} />
              </audio>
            )}
            {fileData.fileType?.startsWith("video/") && (
              <video controls className="w-full rounded-xl max-h-64">
                <source src={`data:${fileData.fileType};base64,${fileData.fileData}`} />
              </video>
            )}
            {!fileData.fileType?.startsWith("image/") &&
             !fileData.fileType?.startsWith("audio/") &&
             !fileData.fileType?.startsWith("video/") && (
              <div className="text-center py-8 bg-purple-50 rounded-xl">
                <p className="text-4xl mb-2">📄</p>
                <p className="text-sm text-purple-500">preview not available</p>
              </div>
            )}

            {fileData.description && (
              <p className="text-xs text-purple-500 italic">
                "{fileData.description}"
              </p>
            )}

            <button onClick={handleDownload}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
              ⬇️ download file
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

// File card
function FileCard({ file, onDelete, onView }) {
  const colors   = getFileColor(file.fileType)
  const [del, setDel] = useState(false)

  async function handleDelete() {
    if (!confirm(`delete "${file.name}"?`)) return
    setDel(true)
    await onDelete(file._id)
    setDel(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-purple-100 p-4 hover:shadow-md transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: colors.bg, border: `1px solid ${colors.border}` }}>
          {getFileIcon(file.fileType)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-purple-800 truncate">{file.name}</p>
          <p className="text-xs text-purple-400 mt-0.5">
            {formatBytes(file.fileSize)} · {formatDate(file.createdAt)}
          </p>
        </div>
      </div>

      {file.description && (
        <p className="text-xs text-purple-500 italic mb-3">"{file.description}"</p>
      )}

      <span className="inline-block text-xs px-2.5 py-1 rounded-full border mb-3"
        style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
        {file.fileType?.split("/")[0] || "file"}
      </span>

      <div className="flex gap-2">
        <button onClick={() => onView(file._id, file.name)}
          className="flex-1 text-xs py-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100 transition-all">
          view 👁️
        </button>
        <button onClick={handleDelete} disabled={del}
          className="px-3 py-2 rounded-xl text-xs text-pink-500 border border-pink-100 hover:bg-pink-50 transition-all disabled:opacity-40">
          {del ? "..." : "delete"}
        </button>
      </div>
    </div>
  )
}

function EvidenceVault() {
  const { currentUser } = useAuth()

  const [files, setFiles]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [description, setDesc]  = useState("")
  const [error, setError]       = useState("")
  const [dragOver, setDragOver] = useState(false)
  const [filter, setFilter]     = useState("all")
  const [viewing, setViewing]   = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    if (currentUser?.uid) loadFiles()
  }, [currentUser])

  async function loadFiles() {
    setLoading(true)
    try {
      const res = await evidenceAPI.getAll(currentUser.uid)
      setFiles(res.data)
    } catch {
      setFiles([])
    }
    setLoading(false)
  }

  // Convert file to Base64 and upload
  async function uploadFile(file) {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("file too large — maximum 5MB 💜")
      return
    }

    setUploading(true)
    setProgress(30)
    setError("")

    try {
      // Read file as Base64
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload  = () => resolve(reader.result.split(",")[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setProgress(70)

      await evidenceAPI.upload({
        userId:      currentUser.uid,
        name:        file.name,
        description: description || "",
        fileType:    file.type,
        fileSize:    file.size,
        fileData:    base64,
      })

      setProgress(100)
      setDesc("")
      await loadFiles()
    } catch (err) {
      setError(err.message || "upload failed 💜 please try again")
    }

    setUploading(false)
    setProgress(0)
  }

  async function handleDelete(id) {
    try {
      await evidenceAPI.delete(id)
      setFiles((prev) => prev.filter((f) => f._id !== id))
    } catch {
      setError("couldn't delete file 💜")
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) uploadFile(file)
    e.target.value = ""
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) uploadFile(file)
  }

  const filteredFiles = files.filter((f) => {
    if (filter === "all")    return true
    if (filter === "images") return f.fileType?.startsWith("image/")
    if (filter === "audio")  return f.fileType?.startsWith("audio/")
    if (filter === "docs")   return (
      f.fileType?.includes("pdf") ||
      f.fileType?.includes("word") ||
      f.fileType?.includes("text")
    )
    return true
  })

  return (
    <AppLayout>
      <div className="p-8 max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-purple-800 mb-1">
            evidence vault 🔒
          </h1>
          <p className="text-purple-400 text-sm">
            securely store photos, audio and documents — only you can access these 💜
          </p>
        </div>

        {/* Upload */}
        <div className="bg-white rounded-2xl border border-purple-100 p-6 mb-6">
          <h2 className="text-sm font-semibold text-purple-700 mb-4">
            upload evidence
          </h2>

          <div className="mb-4">
            <label className="block text-xs font-medium text-purple-600 mb-1.5">
              description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="e.g. photo from incident on 5th June..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border-2 border-purple-100 bg-purple-50 focus:outline-none focus:border-purple-400 focus:bg-white transition-all placeholder:text-purple-200 text-purple-800"
            />
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-purple-400 bg-purple-50"
                : "border-purple-200 hover:border-purple-300 hover:bg-purple-50"
            }`}>

            {uploading ? (
              <div className="space-y-3">
                <div className="text-2xl animate-bounce">⬆️</div>
                <p className="text-sm font-medium text-purple-600">
                  uploading... {progress}%
                </p>
                <div className="w-full bg-purple-100 rounded-full h-2 max-w-xs mx-auto">
                  <div className="h-2 rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      background: "linear-gradient(135deg, #a855f7, #ec4899)"
                    }} />
                </div>
              </div>
            ) : (
              <>
                <div className="text-3xl mb-3">📎</div>
                <p className="text-sm font-medium text-purple-600 mb-1">
                  drag and drop or click to browse
                </p>
                <p className="text-xs text-purple-400 mb-4">
                  images, audio, video, PDF, documents
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-white pointer-events-none"
                  style={{ background: "linear-gradient(135deg, #a855f7, #ec4899)" }}>
                  choose file
                </div>
                <p className="text-xs text-purple-300 mt-3">max 5MB per file</p>
              </>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
            className="hidden"
          />

          {error && (
            <p className="text-sm text-pink-500 mt-3 bg-pink-50 p-3 rounded-xl border border-pink-100">
              {error}
            </p>
          )}
        </div>

        {/* Files */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {["all", "images", "audio", "docs"].map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  filter === f
                    ? "text-white border-transparent"
                    : "text-purple-400 border-purple-100 bg-white hover:border-purple-300"
                }`}
                style={filter === f
                  ? { background: "linear-gradient(135deg, #a855f7, #ec4899)" }
                  : {}}>
                {f}
              </button>
            ))}
          </div>
          <p className="text-xs text-purple-400">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-purple-100 p-4 animate-pulse h-36" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-purple-100">
            <p className="text-4xl mb-3">🔒</p>
            <p className="text-sm font-medium text-purple-600 mb-1">vault is empty</p>
            <p className="text-xs text-purple-400">upload files to keep them safe</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFiles.map((file) => (
              <FileCard
                key={file._id}
                file={file}
                onDelete={handleDelete}
                onView={(id, name) => setViewing({ id, name })}
              />
            ))}
          </div>
        )}

        {/* Privacy note */}
        <div className="mt-8 p-4 rounded-2xl bg-purple-50 border border-purple-100 flex items-start gap-3">
          <span className="text-lg">🔒</span>
          <p className="text-xs text-purple-400 leading-relaxed">
            files are encrypted and stored securely in your private database.
            only you can access your vault 💜
          </p>
        </div>

      </div>

      {viewing && (
        <ViewModal
          fileId={viewing.id}
          fileName={viewing.name}
          onClose={() => setViewing(null)}
        />
      )}

    </AppLayout>
  )
}

export default EvidenceVault