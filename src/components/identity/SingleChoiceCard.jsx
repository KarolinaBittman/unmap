import { cn } from '@/lib/utils'

export default function SingleChoiceCard({ question, options = [], selected, onChange, onNext }) {
  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      <div className="p-7 pb-5">
        <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest mb-3">
          {question.label}
        </p>
        <h2 className="font-heading font-bold text-[1.4rem] leading-snug text-brand-text">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-brand-muted text-sm mt-2">{question.subtitle}</p>
        )}
      </div>

      <div className="h-px bg-brand-border mx-7" />

      <div className="p-7 pt-5 space-y-4">
        <div className="flex flex-col gap-2.5">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={cn(
                'w-full text-left px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-150',
                selected === opt
                  ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                  : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60 hover:bg-brand-surface',
              )}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={!selected}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
