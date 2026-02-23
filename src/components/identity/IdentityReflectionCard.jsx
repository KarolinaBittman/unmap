import { Gem, RefreshCw, AlertCircle } from 'lucide-react'

const NEXT_STEPS = [
  { label: "You've mapped your values, energy, identity, and strengths", active: true },
  { label: 'Design the life you actually want — Point B', active: false },
  { label: 'Build your action roadmap', active: false },
]

function ReflectionSkeleton() {
  return (
    <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-3 h-3 rounded-full bg-brand-primary/30 animate-pulse" />
        <span className="text-xs text-brand-muted">Synthesising who you are…</span>
      </div>
      <div className="space-y-2.5 animate-pulse">
        <div className="h-3.5 bg-brand-border rounded-full w-full" />
        <div className="h-3.5 bg-brand-border rounded-full w-[92%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[85%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[78%]" />
        <div className="h-3.5 bg-brand-border rounded-full w-[60%]" />
      </div>
    </div>
  )
}

function ReflectionError({ onRetry }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-red-100 space-y-3 text-center">
      <AlertCircle size={22} className="text-red-400 mx-auto" />
      <p className="text-sm text-brand-muted">
        Couldn't generate your reflection right now.
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

export default function IdentityReflectionCard({ reflection, loading, error, onRetry, onContinue, values, nonNegotiable }) {
  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="text-center pb-2">
        <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border">
          <Gem size={20} className="text-brand-primary" />
        </div>
        <h2 className="font-heading font-bold text-2xl text-brand-text">
          Here's who you are.
        </h2>
        <p className="text-brand-muted text-sm mt-2">
          This is your foundation.
        </p>
      </div>

      {/* Values summary — always visible */}
      {values && values.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-brand-border">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2.5">
            Your core values
          </p>
          <div className="flex flex-wrap gap-1.5">
            {values.map((v) => (
              <span
                key={v}
                className={`text-xs font-semibold px-3 py-1.5 rounded-xl ${
                  v === nonNegotiable
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-primary bg-brand-surface'
                }`}
              >
                {v === nonNegotiable ? `${v} ✦` : v}
              </span>
            ))}
          </div>
          {nonNegotiable && (
            <p className="text-[10px] text-brand-muted mt-2">
              ✦ non-negotiable
            </p>
          )}
        </div>
      )}

      {/* Reflection body */}
      {loading && <ReflectionSkeleton />}

      {error && !loading && <ReflectionError onRetry={onRetry} />}

      {reflection && !loading && (
        <div className="bg-brand-surface rounded-2xl p-6 border border-brand-border">
          <p className="font-emotional italic text-brand-text leading-[1.8] text-base whitespace-pre-line">
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
        Continue to Stage 4 →
      </button>

    </div>
  )
}
