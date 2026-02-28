import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'

const LS_KEY = 'unmap-next-move-done'

// Returns midnight on the most recent Monday (local time)
function getThisMonday() {
  const d = new Date()
  const dayOfWeek = d.getDay() // 0 = Sun, 1 = Mon …
  const daysBack = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - daysBack)
  return d
}

function isDoneThisWeek() {
  const raw = localStorage.getItem(LS_KEY)
  if (!raw) return false
  return new Date(raw) >= getThisMonday()
}

export default function YourNextMoveCard() {
  const { roadmapAnswers, roadmapPlan } = useUserStore()
  const [done, setDone] = useState(() => isDoneThisWeek())

  const firstStep      = roadmapAnswers?.firstStep?.trim()       || ''
  const firstMoveBlocker = roadmapAnswers?.firstMoveBlocker?.trim() || ''
  const hasStage5 = Boolean(firstStep)
  const week1 = roadmapPlan?.weeks?.[0]

  function markDone() {
    localStorage.setItem(LS_KEY, new Date().toISOString())
    setDone(true)
  }

  // ── Stage 5 not yet completed ────────────────────────────────────────────
  if (!hasStage5) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
        <p className="text-[11px] font-semibold tracking-widest text-brand-primary uppercase">
          Your Next Move
        </p>
        <p className="text-brand-muted text-sm leading-relaxed">
          Complete Stage 5 to unlock your next move.
        </p>
        <Link
          to="/vehicle"
          className="text-sm font-semibold text-brand-primary hover:underline"
        >
          Go to Stage 5 →
        </Link>
      </div>
    )
  }

  // ── Done this week ───────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <p className="text-[11px] font-semibold tracking-widest text-brand-primary uppercase">
          Your Next Move
        </p>
        <div className="flex flex-col items-center justify-center gap-3 py-4">
          <CheckCircle size={40} className="text-emerald-400" strokeWidth={1.5} />
          <p className="text-brand-text font-medium text-sm text-center">
            Done this week. What's next?
          </p>
        </div>
        {roadmapPlan && (
          <Link
            to="/roadmap"
            className="text-center text-xs font-medium text-brand-muted hover:text-brand-primary transition-colors duration-150"
          >
            View full roadmap →
          </Link>
        )}
      </div>
    )
  }

  // ── Active step ──────────────────────────────────────────────────────────
  // If a full roadmap plan exists, show Week 1's goal as the headline action.
  // Otherwise fall back to the raw firstStep answer.
  const headline = week1?.goal || firstStep
  const focusBadge = week1?.focus || null

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold tracking-widest text-brand-primary uppercase">
          Your Next Move
        </p>
        {focusBadge && (
          <span className="text-[10px] font-semibold text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-full">
            {focusBadge}
          </span>
        )}
      </div>

      {/* The step — Lora italic quote */}
      <p className="font-emotional italic text-brand-text text-lg leading-snug">
        "{headline}"
      </p>

      {/* What's been stopping you — only show when no roadmap plan */}
      {!week1 && firstMoveBlocker && (
        <div className="space-y-1">
          <p className="text-[11px] text-brand-muted uppercase tracking-wide font-semibold">
            What's been stopping you:
          </p>
          <p className="text-brand-text text-sm leading-relaxed">
            {firstMoveBlocker}
          </p>
        </div>
      )}

      {/* Mark as done + roadmap link */}
      <div className="mt-auto pt-2 flex flex-col gap-2">
        <button
          onClick={markDone}
          className="w-full bg-brand-primary/10 text-brand-primary text-sm font-semibold py-2.5 rounded-xl hover:bg-brand-primary/20 transition-all duration-200"
        >
          Mark as done ✓
        </button>
        {week1 && (
          <Link
            to="/roadmap"
            className="text-center text-xs font-medium text-brand-muted hover:text-brand-primary transition-colors duration-150"
          >
            View full roadmap →
          </Link>
        )}
      </div>
    </div>
  )
}
