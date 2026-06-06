// AppLayout.jsx
// A wrapper that adds the Sidebar to every protected page
// Instead of adding Sidebar to each page individually,
// we wrap all protected pages with this layout once

import Sidebar from "./Sidebar"

function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen"
      style={{ background: "linear-gradient(135deg, #fdf2f8 0%, #faf5ff 100%)" }}>

      {/* Sidebar — always visible on the left */}
      <Sidebar />

      {/* Page content — fills remaining space */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

    </div>
  )
}

export default AppLayout