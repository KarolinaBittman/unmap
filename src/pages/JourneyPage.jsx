import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import WheelOfLifeSetup from '@/components/onboarding/WheelOfLifeSetup'

export default function JourneyPage() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <WheelOfLifeSetup />
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
