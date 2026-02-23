import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/userStore'
import { registerDebugSync } from '@/lib/db'
import Landing from '@/pages/Landing'
import AuthPage from '@/pages/AuthPage'
import Onboarding from '@/pages/Onboarding'
import DashboardPage from '@/pages/DashboardPage'
import JourneyPage from '@/pages/JourneyPage'
import BlocksPage from '@/pages/BlocksPage'
import IdentityPage from '@/pages/IdentityPage'
import CheckInPage from '@/pages/CheckInPage'
import ResourcesPage from '@/pages/ResourcesPage'
import PointBPage from '@/pages/PointBPage'
import RoadmapPage from '@/pages/RoadmapPage'
import WorldPage from '@/pages/WorldPage'

// Redirects unauthenticated users to /auth.
// Renders nothing until the session check has resolved (prevents flash).
function ProtectedRoute({ children }) {
  const { user, authChecked } = useUserStore()
  if (!authChecked) return null
  if (!user) return <Navigate to="/auth" replace />
  return children
}

// Redirects already-authenticated users away from /auth.
function AuthRoute({ children }) {
  const { user, authChecked } = useUserStore()
  if (!authChecked) return null
  if (user) return <Navigate to="/" replace />
  return children
}

export default function App() {
  const { setUser, setAuthChecked, loadFromSupabase } = useUserStore()

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION immediately on subscribe,
    // so getSession() is only needed to unblock the ProtectedRoute check quickly.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setAuthChecked(true)
    })

    // Single source of truth for auth state + data loading.
    // Fires: INITIAL_SESSION (on mount), SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null
      setUser(u)
      setAuthChecked(true)
      if (u) {
        loadFromSupabase(u.id)
        registerDebugSync(u.id, useUserStore.getState())
      }
    })

    return () => subscription.unsubscribe()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/auth" element={<AuthRoute><AuthPage /></AuthRoute>} />
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><JourneyPage /></ProtectedRoute>} />
        <Route path="/blocks" element={<ProtectedRoute><BlocksPage /></ProtectedRoute>} />
        <Route path="/identity" element={<ProtectedRoute><IdentityPage /></ProtectedRoute>} />
        <Route path="/pointb" element={<ProtectedRoute><PointBPage /></ProtectedRoute>} />
        <Route path="/roadmap" element={<ProtectedRoute><RoadmapPage /></ProtectedRoute>} />
        <Route path="/world" element={<ProtectedRoute><WorldPage /></ProtectedRoute>} />
        <Route path="/checkin" element={<ProtectedRoute><CheckInPage /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
