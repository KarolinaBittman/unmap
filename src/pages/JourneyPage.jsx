import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import WheelOfLifeSetup from '@/components/onboarding/WheelOfLifeSetup'
import PathBackground from '@/components/PathBackground'

export default function JourneyPage() {
  return (
    <div className="relative flex min-h-screen overflow-hidden bg-brand-bg">
      <PathBackground />
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="relative z-10 flex-1 p-4 md:p-8">
          <WheelOfLifeSetup />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
