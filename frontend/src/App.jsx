// App.jsx - Defines all the routes (URLs) for our application
// App.jsx - All routes with protection applied
import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "@/components/shared/ProtectedRoute"

// Pages
import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Dashboard from "@/pages/Dashboard"
import NGODirectory from "@/pages/NGODirectory"
import MentorDirectory from "@/pages/MentorDirectory"
import SOS from "@/pages/SOS"
import SafetyCheckin from "@/pages/SafetyCheckin"
import NearbyHelp from "@/pages/NearbyHelp"
import EvidenceVault from "@/pages/EvidenceVault"
import Community from "@/pages/Community"
import AIAssistant from "@/pages/AIAssistant"
import NotFound from "@/pages/NotFound"

function App() {
  return (
    <Routes>

      {/* ── Public routes (anyone can visit) ── */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />

      {/* ── Protected routes (must be logged in) ── */}
      {/* Every page wrapped in ProtectedRoute is now secured */}

      <Route path="/dashboard" element={
        <ProtectedRoute><Dashboard /></ProtectedRoute>
      } />

      <Route path="/ngos" element={
        <ProtectedRoute><NGODirectory /></ProtectedRoute>
      } />

      <Route path="/mentors" element={
        <ProtectedRoute><MentorDirectory /></ProtectedRoute>
      } />

      <Route path="/sos" element={
        <ProtectedRoute><SOS /></ProtectedRoute>
      } />

      <Route path="/checkin" element={
        <ProtectedRoute><SafetyCheckin /></ProtectedRoute>
      } />

      <Route path="/nearby" element={
        <ProtectedRoute><NearbyHelp /></ProtectedRoute>
      } />

      <Route path="/vault" element={
        <ProtectedRoute><EvidenceVault /></ProtectedRoute>
      } />

      <Route path="/community" element={
        <ProtectedRoute><Community /></ProtectedRoute>
      } />

      <Route path="/assistant" element={
        <ProtectedRoute><AIAssistant /></ProtectedRoute>
      } />

      {/* 404 catch-all */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  )
}

export default App