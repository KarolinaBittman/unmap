import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from '@/pages/Landing'
import Onboarding from '@/pages/Onboarding'
import DashboardPage from '@/pages/DashboardPage'
import JourneyPage from '@/pages/JourneyPage'
import BlocksPage from '@/pages/BlocksPage'
import IdentityPage from '@/pages/IdentityPage'
import CheckInPage from '@/pages/CheckInPage'
import ResourcesPage from '@/pages/ResourcesPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/welcome" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<DashboardPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/blocks" element={<BlocksPage />} />
        <Route path="/identity" element={<IdentityPage />} />
        <Route path="/checkin" element={<CheckInPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
      </Routes>
    </BrowserRouter>
  )
}
