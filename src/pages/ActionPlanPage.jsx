import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import ActionPlanView from '@/components/roadmap/ActionPlanView'

export default function ActionPlanPage() {
  const navigate = useNavigate()
  const { user, roadmapPlan, setRoadmapPlan } = useUserStore()
  const [loading, setLoading] = useState(!roadmapPlan)

  // If the plan isn't in the store yet (e.g. user navigated directly to this URL),
  // fetch it from Supabase profiles.roadmap_plan.
  useEffect(() => {
    if (roadmapPlan) {
      setLoading(false)
      return
    }
    if (!user?.id) return

    supabase
      .from('profiles')
      .select('roadmap_plan')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (data?.roadmap_plan) {
          setRoadmapPlan(data.roadmap_plan)
        }
        setLoading(false)
      })
  }, [user?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen bg-brand-bg">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-1 p-4 md:p-8">
          <div className="max-w-2xl mx-auto">

            {loading && (
              <div className="space-y-4 animate-pulse">
                <div className="h-8 bg-brand-border rounded-full w-48 mx-auto" />
                <div className="h-4 bg-brand-border rounded-full w-32 mx-auto" />
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white rounded-2xl border border-brand-border p-5 space-y-3">
                    <div className="h-4 bg-brand-border rounded-full w-16" />
                    <div className="h-3.5 bg-brand-border rounded-full w-full" />
                    <div className="h-3.5 bg-brand-border rounded-full w-[85%]" />
                  </div>
                ))}
              </div>
            )}

            {!loading && !roadmapPlan && (
              <div className="text-center py-16">
                <p className="font-heading font-semibold text-brand-text text-lg">
                  No action plan yet.
                </p>
                <p className="text-brand-muted text-sm mt-2 max-w-xs mx-auto">
                  Complete Stage 5 and build your plan from the reflection screen.
                </p>
                <button
                  onClick={() => navigate('/vehicle')}
                  className="mt-6 text-sm font-semibold text-brand-primary bg-brand-primary/10 px-5 py-2.5 rounded-xl hover:bg-brand-primary/20 transition-all duration-200"
                >
                  Go to Stage 5 →
                </button>
              </div>
            )}

            {!loading && roadmapPlan && (
              <ActionPlanView plan={roadmapPlan} />
            )}

          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
