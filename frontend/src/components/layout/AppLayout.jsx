import Sidebar from "./Sidebar"

export default function AppLayout({ children }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: "auto" }}>
        {children}
      </main>
    </div>
  )
}
