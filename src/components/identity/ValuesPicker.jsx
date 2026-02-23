import { cn } from '@/lib/utils'

const ALL_VALUES = [
  'Freedom',    'Creativity',  'Security',    'Adventure',
  'Family',     'Autonomy',    'Impact',      'Growth',
  'Authenticity','Stability',  'Connection',  'Wealth',
  'Purpose',    'Health',      'Fun',         'Leadership',
  'Learning',   'Simplicity',  'Courage',     'Love',
]

const MAX = 5

export default function ValuesPicker({ selected, onChange, onNext }) {
  const canAdd = selected.length < MAX

  function toggle(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value))
    } else if (canAdd) {
      onChange([...selected, value])
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-7 pb-5">
        <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest mb-3">
          Stage 3 · Part 1 of 3
        </p>
        <h2 className="font-heading font-bold text-[1.4rem] leading-snug text-brand-text">
          What are your core values?
        </h2>
        <p className="text-brand-muted text-sm mt-2">
          Pick exactly 5 — the ones that feel most true to who you are right now.
        </p>
      </div>

      <div className="h-px bg-brand-border mx-7" />

      <div className="p-7 pt-5 space-y-4">
        {/* Counter */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-brand-muted">
            {selected.length} of {MAX} selected
          </span>
          {selected.length === MAX && (
            <span className="text-xs font-medium text-brand-primary">
              Those are your 5 ✓
            </span>
          )}
        </div>

        {/* Value pills */}
        <div className="flex flex-wrap gap-2">
          {ALL_VALUES.map((value) => {
            const isSelected = selected.includes(value)
            const isDisabled = !isSelected && !canAdd
            return (
              <button
                key={value}
                disabled={isDisabled}
                onClick={() => toggle(value)}
                className={cn(
                  'py-2 px-4 rounded-xl text-sm font-medium border transition-all duration-150',
                  isSelected
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : isDisabled
                      ? 'bg-brand-surface text-brand-muted/50 border-brand-border/40 cursor-not-allowed'
                      : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60 hover:bg-brand-surface',
                )}
              >
                {value}
              </button>
            )
          })}
        </div>

        {/* Selected values in order — visible while choosing */}
        {selected.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-brand-border/50">
            <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest self-center mr-1">
              Your 5:
            </span>
            {selected.map((v) => (
              <span
                key={v}
                className="text-xs font-medium text-brand-primary bg-brand-surface px-2.5 py-1 rounded-lg"
              >
                {v}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={onNext}
          disabled={selected.length < MAX}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
