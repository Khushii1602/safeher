// ProtectedRoute.jsx
// Acts as a security guard for pages that require login
// If user is not logged in, redirects them to /login automatically

import { Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"

function ProtectedRoute({ children }) {
  // Get the current logged-in user from our AuthContext
  const { currentUser } = useAuth()

  // If no user is logged in, redirect to login page
  // 'replace' means the /login page replaces the current history entry
  // so pressing Back won't loop them back to the protected page
  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  // User is logged in — render the actual page
  return children
}

export default ProtectedRoute