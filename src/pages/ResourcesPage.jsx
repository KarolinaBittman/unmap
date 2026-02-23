import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'

export default function ResourcesPage() {
  return (
    <div className="flex min-h-screen bg-brand-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8">
          <h1 className="font-heading font-bold text-2xl text-brand-text mb-2">
            Resources
          </h1>
          <p className="text-brand-muted text-sm mb-8">
            Frameworks, books, and exercises for your journey.
          </p>
          <div className="bg-white rounded-2xl p-8 border border-brand-border text-center">
            <p className="text-brand-muted">
              Resource library coming in Milestone 4.
            </p>
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
