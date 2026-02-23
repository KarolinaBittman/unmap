import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import Dashboard from '@/components/dashboard/Dashboard'

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top nav */}
        <Navbar />

        <main className="flex-1 p-4 md:p-8">
          <Dashboard />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />
    </div>
  )
}
