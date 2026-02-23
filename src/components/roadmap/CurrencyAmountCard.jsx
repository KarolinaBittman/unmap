const CURRENCIES = ['CHF', 'EUR', 'USD']

export default function CurrencyAmountCard({
  question,
  amount,
  currency,
  onAmountChange,
  onCurrencyChange,
  onNext,
}) {
  const canAdvance = amount !== '' && Number(amount) > 0

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

        {/* Currency picker */}
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => onCurrencyChange(c)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-150 ${
                currency === c
                  ? 'bg-brand-primary text-white border-brand-primary'
                  : 'bg-brand-surface text-brand-muted border-brand-border hover:border-brand-primary/60 hover:text-brand-text'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Amount input */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted text-sm font-medium select-none pointer-events-none">
            {currency}
          </span>
          <input
            type="number"
            min={0}
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="0"
            className="w-full pl-14 pr-5 py-3.5 rounded-xl border border-brand-border bg-brand-surface text-brand-text text-sm placeholder:text-brand-muted/60 focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition-all"
          />
        </div>

        <button
          onClick={onNext}
          disabled={!canAdvance}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          Continue →
        </button>

      </div>
    </div>
  )
}
