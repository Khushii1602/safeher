import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "@/components/shared/ProtectedRoute"

import Home from "@/pages/Home"
import Login from "@/pages/Login"
import Onboarding from "@/pages/Onboarding"
import Dashboard from "@/pages/Dashboard"
import NGODirectory from "@/pages/NGODirectory"
import MentorDirectory from "@/pages/MentorDirectory"
import SOS from "@/pages/SOS"
import SafetyCheckin from "@/pages/SafetyCheckin"
import NearbyHelp from "@/pages/NearbyHelp"
import EvidenceVault from "@/pages/EvidenceVault"
import Community from "@/pages/Community"
import AIAssistant from "@/pages/AIAssistant"
import LegalAid from "@/pages/LegalAid"
import ChildSafety from "@/pages/ChildSafety"
import PoliceDirectory from "@/pages/PoliceDirectory"
import ResourceHub from "@/pages/ResourceHub"
import Profile from "@/pages/Profile"
import NotFound from "@/pages/NotFound"
import BecomeMentor from "@/pages/BecomeMentor"

const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>

export default function App() {
  return (
    <Routes>
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/onboarding"  element={<P><Onboarding /></P>} />
      <Route path="/dashboard"   element={<P><Dashboard /></P>} />
      <Route path="/ngos"        element={<P><NGODirectory /></P>} />
      <Route path="/mentors"     element={<P><MentorDirectory /></P>} />
      <Route path="/sos"         element={<P><SOS /></P>} />
      <Route path="/checkin"     element={<P><SafetyCheckin /></P>} />
      <Route path="/nearby"      element={<P><NearbyHelp /></P>} />
      <Route path="/vault"       element={<P><EvidenceVault /></P>} />
      <Route path="/community"   element={<P><Community /></P>} />
      <Route path="/assistant"   element={<P><AIAssistant /></P>} />
      <Route path="/legal-aid"   element={<P><LegalAid /></P>} />
      <Route path="/child-safety"element={<P><ChildSafety /></P>} />
      <Route path="/police"      element={<P><PoliceDirectory /></P>} />
      <Route path="/resources"   element={<P><ResourceHub /></P>} />
      <Route path="/profile"     element={<P><Profile /></P>} />
      <Route path="*"            element={<NotFound />} />
      <Route path="/become-mentor" element={<BecomeMentor />} />
    </Routes>
  )
}