import { cn } from '@/lib/utils'

// Renders the correct input UI for each question type.
// Calls onNext() for auto-advance types (pills, scale) after a short delay.
export default function QuestionCard({ question, answer, onChange, onNext }) {
  function handlePillSelect(value) {
    onChange(value)
    setTimeout(onNext, 160)
  }

  function handleScaleSelect(value) {
    onChange(value)
    setTimeout(onNext, 160)
  }

  const canContinue =
    question.type === 'slider'
      ? true
      : question.type === 'multi-pills'
        ? Array.isArray(answer) && answer.length > 0
        : typeof answer === 'string' && answer.trim().length > 0

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
      {/* Question header */}
      <div className="p-7 pb-5">
        <p className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest mb-3">
          Question {question.step} of 5
        </p>
        <h2 className="font-heading font-bold text-[1.4rem] leading-snug text-brand-text">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="text-brand-muted text-sm mt-2">{question.subtitle}</p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-brand-border mx-7" />

      {/* Input area */}
      <div className="p-7 pt-5 space-y-4">

        {/* ── Single-select pills ── */}
        {question.type === 'pills' && (
          <div className="grid grid-cols-2 gap-2.5">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handlePillSelect(option)}
                className={cn(
                  'py-3.5 px-4 rounded-xl text-sm font-medium border text-left transition-all duration-150',
                  answer === option
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60 hover:bg-brand-surface',
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* ── Life satisfaction slider ── */}
        {question.type === 'slider' && (
          <div className="space-y-5">
            <div className="text-center py-2">
              <span className="text-6xl font-heading font-bold text-brand-primary tabular-nums">
                {answer}
              </span>
              <span className="text-xl text-brand-muted font-heading"> / 10</span>
            </div>
            <div className="space-y-2">
              <input
                type="range"
                min={1}
                max={10}
                value={answer}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 rounded-full accent-[#7C6BAE] cursor-pointer"
              />
              <div className="flex justify-between text-xs text-brand-muted">
                <span>Not at all</span>
                <span>Completely</span>
              </div>
            </div>
            <button
              onClick={onNext}
              className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Multi-select pills ── */}
        {question.type === 'multi-pills' && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {question.options.map((option) => {
                const selected = Array.isArray(answer) && answer.includes(option)
                return (
                  <button
                    key={option}
                    onClick={() => {
                      const curr = Array.isArray(answer) ? answer : []
                      onChange(
                        selected
                          ? curr.filter((a) => a !== option)
                          : [...curr, option],
                      )
                    }}
                    className={cn(
                      'py-2 px-4 rounded-xl text-sm font-medium border transition-all duration-150',
                      selected
                        ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                        : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60',
                    )}
                  >
                    {option}
                  </button>
                )
              })}
            </div>
            <button
              onClick={onNext}
              disabled={!canContinue}
              className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Free text ── */}
        {question.type === 'text' && (
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.placeholder}
              rows={4}
              className="w-full bg-brand-surface rounded-xl p-4 text-brand-text placeholder:text-brand-muted/60 text-sm border border-brand-border focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 resize-none transition-all duration-200 font-emotional italic leading-relaxed"
            />
            <button
              onClick={onNext}
              disabled={!canContinue}
              className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ── Readiness scale ── */}
        {question.type === 'scale' && (
          <div className="space-y-2">
            {question.options.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleScaleSelect(value)}
                className={cn(
                  'w-full flex items-center gap-4 py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-150 text-left',
                  answer === value
                    ? 'bg-brand-primary text-white border-brand-primary shadow-sm'
                    : 'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60',
                )}
              >
                <span
                  className={cn(
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    answer === value
                      ? 'bg-white/25 text-white'
                      : 'bg-brand-border text-brand-muted',
                  )}
                >
                  {value}
                </span>
                {label}
              </button>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}
