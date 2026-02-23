import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/userStore'
import WheelPreview from '@/components/dashboard/WheelPreview'
import { syncWheelScores } from '@/lib/db'

const AREAS = [
  { id: 'career',        label: 'Career',        hint: 'Work, growth, income, satisfaction' },
  { id: 'health',        label: 'Health',        hint: 'Energy, fitness, sleep, nourishment' },
  { id: 'relationships', label: 'Relationships', hint: 'Connection, love, community' },
  { id: 'money',         label: 'Money',         hint: 'Security, savings, financial freedom' },
  { id: 'growth',        label: 'Growth',        hint: 'Learning, creativity, wisdom' },
  { id: 'fun',           label: 'Fun',           hint: 'Joy, hobbies, play, adventure' },
  { id: 'environment',   label: 'Environment',   hint: 'Home, city, nature, safety' },
  { id: 'purpose',       label: 'Purpose',       hint: 'Meaning, direction, contribution' },
]

// Gradient: coral → orange → amber → lime → green
const SCORED_GRADIENT =
  'linear-gradient(to right, #fb7185 0%, #f97316 28%, #fbbf24 55%, #a3e635 78%, #4ade80 100%)'
const UNSCORED_TRACK = '#E2DFF0'
const THUMB_W = 22 // px — must match CSS (.wheel-slider thumb width)

function badgeClass(score) {
  if (score === null) return 'bg-brand-surface text-brand-muted'
  if (score <= 3)     return 'bg-rose-50 text-rose-500'
  if (score <= 6)     return 'bg-amber-50 text-amber-600'
  return 'bg-brand-success/15 text-brand-success'
}

function dotColor(score) {
  if (score === null || score <= 3) return 'text-rose-400'
  if (score <= 6)                   return 'text-amber-500'
  return 'text-brand-success'
}

// Returns the CSS `left` value that places an element (with translateX(-50%))
// exactly over the centre of the range thumb.
// Formula: thumbCentre = pct% of track + (thumbW/2 - pct * thumbW/100)
function thumbCentreLeft(pct) {
  return `calc(${pct}% + ${THUMB_W / 2 - pct * (THUMB_W / 100)}px)`
}

function AreaSlider({ id, score, onScore }) {
  const pct = score !== null ? ((score - 1) / 9) * 100 : 0

  return (
    <div className="relative pt-9">
      {/* Floating score badge — only visible once scored */}
      {score !== null && (
        <div
          className="absolute top-0 -translate-x-1/2 bg-brand-primary text-white text-sm font-bold rounded-lg px-2.5 py-1 leading-none pointer-events-none select-none shadow-sm"
          style={{ left: thumbCentreLeft(pct) }}
        >
          {score}
        </div>
      )}

      <input
        type="range"
        min={1}
        max={10}
        step={1}
        value={score ?? 1}
        onChange={(e) => onScore(id, Number(e.target.value))}
        className="wheel-slider w-full"
        style={{ '--track-bg': score !== null ? SCORED_GRADIENT : UNSCORED_TRACK }}
      />

      {/* Min / max labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-brand-muted">1</span>
        <span className="text-[10px] text-brand-muted">10</span>
      </div>
    </div>
  )
}

export default function WheelOfLifeSetup() {
  const navigate = useNavigate()
  const { user, wheelScores, setWheelScores } = useUserStore()

  // Seed sliders from the persisted store on first mount.
  // Values >0 mean the area was previously scored; 0/undefined means unscored (null).
  const [scores, setScores] = useState(() =>
    Object.fromEntries(
      AREAS.map(({ id }) => [id, wheelScores[id] > 0 ? wheelScores[id] : null]),
    ),
  )

  const scoredCount = Object.values(scores).filter((v) => v !== null).length
  const allScored   = scoredCount === AREAS.length

  const liveAvg = scoredCount > 0
    ? (Object.values(scores).filter((v) => v !== null).reduce((a, b) => a + b, 0) / scoredCount).toFixed(1)
    : null

  function score(id, value) {
    setScores((prev) => ({ ...prev, [id]: value }))
  }

  function handleSave() {
    const finalScores = Object.fromEntries(
      AREAS.map(({ id }) => [id, scores[id] ?? 0]),
    )
    setWheelScores(finalScores)
    if (user?.id) syncWheelScores(user.id, finalScores)
    navigate('/')
  }

  return (
    <div className="space-y-6 pb-20 md:pb-0">

      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">
            Stage 1
          </span>
          <span className="text-brand-border text-xs">·</span>
          <span className="text-xs text-brand-muted">Where Are You</span>
        </div>
        <h1 className="font-heading font-bold text-2xl text-brand-text">
          Wheel of Life
        </h1>
        <p className="text-brand-muted text-sm mt-1 max-w-lg">
          Score each area 1–10. Be honest — this is your private snapshot,
          not a grade. 1 = really struggling, 10 = fully thriving.
        </p>
      </div>

      {/* ── Two-column layout ── */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* Scoring rows */}
        <div className="flex-1 min-w-0 space-y-3">
          {AREAS.map(({ id, label, hint }) => (
            <div
              key={id}
              className={cn(
                'bg-white rounded-2xl p-5 border transition-all duration-200',
                scores[id] !== null
                  ? 'border-brand-border shadow-sm'
                  : 'border-brand-border/50',
              )}
            >
              {/* Area name + score badge */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p className="font-heading font-semibold text-brand-text text-sm">
                    {label}
                  </p>
                  <p className="text-xs text-brand-muted mt-0.5">{hint}</p>
                </div>
                <span
                  className={cn(
                    'text-sm font-bold px-2.5 py-1 rounded-xl min-w-[3.2rem] text-center tabular-nums transition-all duration-200 shrink-0 ml-3',
                    badgeClass(scores[id]),
                  )}
                >
                  {scores[id] !== null ? `${scores[id]}/10` : '—'}
                </span>
              </div>

              <AreaSlider id={id} score={scores[id]} onScore={score} />
            </div>
          ))}

          {/* ── Save / skip ── */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSave}
              disabled={!allScored}
              className={cn(
                'w-full py-4 rounded-xl font-heading font-semibold text-base transition-all duration-200 shadow-sm',
                allScored
                  ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-md'
                  : 'bg-brand-primary/30 text-white/60 cursor-not-allowed',
              )}
            >
              {allScored
                ? 'Save my scores →'
                : `Score all 8 areas to continue (${scoredCount}/8)`}
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full text-xs text-brand-muted hover:text-brand-text transition-colors py-2"
            >
              Skip for now
            </button>
          </div>
        </div>

        {/* ── Live radar chart (sticky on desktop) ── */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 order-first lg:order-last">
          <div className="sticky top-8 space-y-3">

            {/* Chart card */}
            <div className="bg-white rounded-2xl p-5 border border-brand-border shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-heading font-semibold text-brand-text text-sm">
                  Your Wheel
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-muted tabular-nums">
                    {scoredCount}/8
                  </span>
                  {liveAvg && (
                    <span className="text-xs font-medium text-brand-primary bg-brand-surface px-2 py-0.5 rounded-full">
                      avg {liveAvg}
                    </span>
                  )}
                </div>
              </div>

              {/* Thin progress bar */}
              <div className="h-0.5 bg-brand-border rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-brand-primary rounded-full transition-all duration-500"
                  style={{ width: `${(scoredCount / AREAS.length) * 100}%` }}
                />
              </div>

              <WheelPreview scores={scores} height={230} />
            </div>

            {/* Score legend — shown once any area is scored */}
            {scoredCount > 0 && (
              <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-sm">
                <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">
                  Scores
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  {AREAS.map(({ id, label }) =>
                    scores[id] !== null ? (
                      <div key={id} className="flex items-center justify-between gap-2">
                        <span className="text-xs text-brand-muted truncate">{label}</span>
                        <span
                          className={cn(
                            'text-xs font-bold tabular-nums shrink-0',
                            dotColor(scores[id]),
                          )}
                        >
                          {scores[id]}
                        </span>
                      </div>
                    ) : null,
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  )
}
