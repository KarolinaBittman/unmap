import { useState, useEffect } from 'react'
import { ChevronDown, BookOpen } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { loadReflections } from '@/lib/db'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { cn } from '@/lib/utils'

// Stage labels including stage 0 (onboarding reflection)
const STAGE_LABELS = {
  0: 'Starting Point',
  1: 'Where Are You',
  2: 'What Happened',
  3: 'Who Are You',
  4: 'Where Do You Want To Be',
  5: 'How Do You Get There',
  6: 'Where In The World',
}

const STAGE_ORDER = [0, 1, 2, 3, 4, 5, 6]

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function ReflectionEntry({ reflection, isLatest }) {
  return (
    <div
      className={cn(
        'rounded-2xl p-6 border',
        isLatest
          ? 'bg-brand-surface border-brand-border'
          : 'bg-white border-brand-border',
      )}
    >
      <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-3">
        {formatDate(reflection.created_at)}
        {reflection.cycle > 1 && ` · Cycle ${reflection.cycle}`}
      </p>
      <p className="font-emotional italic text-brand-text leading-[1.85] text-base whitespace-pre-line">
        {reflection.content}
      </p>
    </div>
  )
}

function StageGroup({ stage, reflections }) {
  const [expanded, setExpanded] = useState(false)
  const latest = reflections[0]
  const older = reflections.slice(1)

  return (
    <div className="space-y-3">
      {/* Stage heading */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-brand-primary/15 flex items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-brand-primary">
            {stage === 0 ? '0' : stage}
          </span>
        </div>
        <h3 className="font-heading font-semibold text-brand-text text-sm">
          {STAGE_LABELS[stage] ?? `Stage ${stage}`}
        </h3>
      </div>

      {/* Most recent reflection */}
      <ReflectionEntry reflection={latest} isLatest />

      {/* Older reflections — collapsible */}
      {older.length > 0 && (
        <div>
          <button
            onClick={() => setExpanded((e) => !e)}
            className="flex items-center gap-1.5 text-xs font-medium text-brand-muted hover:text-brand-primary transition-colors duration-150 ml-1"
          >
            <ChevronDown
              size={14}
              className={cn('transition-transform duration-200', expanded && 'rotate-180')}
            />
            {expanded ? 'Hide' : `${older.length} earlier reflection${older.length > 1 ? 's' : ''}`}
          </button>

          {expanded && (
            <div className="mt-3 space-y-3">
              {older.map((r) => (
                <ReflectionEntry key={r.id} reflection={r} isLatest={false} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ReflectionsPage() {
  const { user } = useUserStore()
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    loadReflections(user.id).then((data) => {
      setReflections(data)
      setLoading(false)
    })
  }, [user?.id])

  // Group by stage, preserving newest-first order within each group
  const grouped = STAGE_ORDER.reduce((acc, stage) => {
    const entries = reflections.filter((r) => r.stage === stage)
    if (entries.length > 0) acc[stage] = entries
    return acc
  }, {})

  const hasReflections = Object.keys(grouped).length > 0

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
          <div className="max-w-2xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="font-heading font-bold text-2xl text-brand-text">
                My Reflections
              </h1>
              <p className="text-brand-muted text-sm mt-1">
                Everything unmap has reflected back to you.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-brand-surface rounded-2xl p-6 border border-brand-border animate-pulse">
                    <div className="h-3 bg-brand-border rounded-full w-24 mb-4" />
                    <div className="space-y-2.5">
                      <div className="h-3.5 bg-brand-border rounded-full w-full" />
                      <div className="h-3.5 bg-brand-border rounded-full w-[92%]" />
                      <div className="h-3.5 bg-brand-border rounded-full w-[80%]" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty state */}
            {!loading && !hasReflections && (
              <div className="bg-white rounded-2xl p-10 border border-brand-border text-center">
                <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border">
                  <BookOpen size={20} className="text-brand-muted" />
                </div>
                <p className="font-heading font-semibold text-brand-text text-lg">
                  No reflections yet.
                </p>
                <p className="text-brand-muted text-sm mt-2 max-w-xs mx-auto">
                  Complete a stage and unmap will write a personalised reflection just for you.
                </p>
              </div>
            )}

            {/* Reflection groups */}
            {!loading && hasReflections && (
              <div className="space-y-8 pb-20 md:pb-0">
                {STAGE_ORDER.filter((s) => grouped[s]).map((stage) => (
                  <StageGroup key={stage} stage={stage} reflections={grouped[stage]} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
