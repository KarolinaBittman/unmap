import { useNavigate } from 'react-router-dom'
import { Globe2, RefreshCw, AlertCircle } from 'lucide-react'

const NEXT_STEPS = [
  { label: "You've found your top 3 location matches", active: true },
  { label: 'All 6 stages complete', active: true },
  { label: 'Review your full profile on the dashboard', active: false },
]

function ReflectionSkeleton() {
  return (
    <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-brand-primary/30 animate-pulse" />
        <span className="text-xs text-brand-muted">Finding your places…</span>
      </div>
      <div className="space-y-2.5 animate-pulse">
        <div className="h-3.5 bg-brand-border rounded-full w-full" />
        <div className="h-3.5 bg-brand-border rounded-full w-[88%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[94%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[76%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-full" />
        <div className="h-3.5 bg-brand-border rounded-full w-[83%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[70%]" />
      </div>
    </div>
  )
}

function ReflectionError({ onRetry }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-red-100 space-y-3 text-center">
      <AlertCircle size={22} className="text-red-400 mx-auto" />
      <p className="text-sm text-brand-muted">
        Couldn't generate your location matches right now.
      </p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
      >
        <RefreshCw size={14} />
        Try again
      </button>
    </div>
  )
}

export default function WorldReflectionCard({
  reflection,
  loading,
  error,
  onRetry,
  onContinue,
  topPriorities,
}) {
  const navigate = useNavigate()
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="text-center pb-2">
        <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border">
          <Globe2 size={20} className="text-brand-primary" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-brand-text">
          Here's where you could go.
        </h2>
        <p className="text-brand-muted text-sm mt-2">
          Your Stage 6 location match.
        </p>
      </div>

      {/* Top priorities preview */}
      {topPriorities?.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-brand-border space-y-2.5">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">
            Your top priorities
          </p>
          <div className="flex flex-wrap gap-2">
            {topPriorities.slice(0, 3).map((p, i) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-text bg-brand-surface border border-brand-border rounded-full px-3 py-1"
              >
                <span className="w-4 h-4 rounded-full bg-brand-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Reflection body */}
      {loading && <ReflectionSkeleton />}

      {error && !loading && <ReflectionError onRetry={onRetry} />}

      {reflection && !loading && (
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border">
          <p className="text-brand-text leading-[1.85] text-sm whitespace-pre-line">
            {reflection}
          </p>
        </div>
      )}

      {/* What's next */}
      {!loading && (
        <div className="bg-white rounded-2xl p-5 border border-brand-border">
          <p className="text-[11px] font-semibold text-brand-muted uppercase tracking-widest mb-3">
            What&rsquo;s next
          </p>
          <div className="space-y-3">
            {NEXT_STEPS.map(({ label, active }, i) => (
              <div key={i} className="flex items-start gap-3">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${
                    active ? 'bg-brand-primary text-white' : 'bg-brand-border text-brand-muted'
                  }`}
                >
                  {i + 1}
                </span>
                <p className={`text-sm leading-snug ${active ? 'text-brand-text' : 'text-brand-muted'}`}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={onContinue}
        disabled={loading || (!reflection && !error)}
        className="w-full bg-brand-primary text-white py-4 rounded-xl font-heading font-semibold text-base hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Go to my dashboard →
      </button>

      {reflection && !loading && (
        <button
          onClick={() => navigate('/reflections')}
          className="w-full text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors duration-150 py-1"
        >
          Read your reflection again →
        </button>
      )}

    </div>
  )
}
