// AuthContext.jsx - Tracks who is logged in across the whole app
import { createContext, useContext, useEffect, useState } from "react"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

// Step 1: Create the context object
const AuthContext = createContext()

// Step 2: Create the Provider component
// This wraps our whole app and makes auth data available everywhere
export function AuthProvider({ children }) {
  // currentUser = the logged-in user object, or null if not logged in
  const [currentUser, setCurrentUser] = useState(null)

  // loading = true while Firebase checks if user is already logged in
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // onAuthStateChanged fires whenever login state changes
    // Firebase automatically checks localStorage for existing sessions
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)  // user is null if logged out
      setLoading(false)     // done checking
    })

    // Cleanup: stop listening when component unmounts
    return unsubscribe
  }, [])

  // Logout function available to any component
  const logout = () => signOut(auth)

  const value = {
    currentUser,  // The user object (has .email, .displayName, .uid etc)
    loading,      // Boolean - still checking auth state?
    logout,       // Function to log out
  }

  return (
    <AuthContext.Provider value={value}>
      {/* Don't render children until Firebase has checked auth state */}
      {!loading && children}
    </AuthContext.Provider>
  )
}

// Step 3: Custom hook so any component can easily access auth
// Usage: const { currentUser, logout } = useAuth()
export function useAuth() {
  return useContext(AuthContext)
}