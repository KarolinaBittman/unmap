import { cn } from '@/lib/utils'

export default function RankCard({ question, ranked, onRankChange, onNext }) {
  const options = question.options ?? []
  const allRanked = ranked.length === options.length

  const rankedItems = ranked
  const unrankedItems = options.filter((item) => !ranked.includes(item))

  function handleClick(item) {
    if (ranked.includes(item)) {
      onRankChange(ranked.filter((r) => r !== item))
    } else {
      onRankChange([...ranked, item])
    }
  }

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

        {/* Ranked section */}
        {rankedItems.length > 0 && (
          <div className="space-y-2">
            {rankedItems.map((item, i) => (
              <button
                key={item}
                onClick={() => handleClick(item)}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium border bg-brand-primary text-white border-brand-primary shadow-sm transition-all duration-150 text-left"
              >
                <span className="w-6 h-6 rounded-full bg-white/25 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Divider between ranked / unranked */}
        {rankedItems.length > 0 && unrankedItems.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-brand-border" />
            <p className="text-[10px] text-brand-muted shrink-0">tap to add</p>
            <div className="flex-1 h-px bg-brand-border" />
          </div>
        )}

        {/* Unranked section */}
        {unrankedItems.length > 0 && (
          <div className="space-y-2">
            {unrankedItems.map((item) => (
              <button
                key={item}
                onClick={() => handleClick(item)}
                className={cn(
                  'w-full flex items-center gap-3 py-3 px-4 rounded-xl text-sm font-medium border transition-all duration-150 text-left',
                  'bg-brand-surface text-brand-text border-brand-border hover:border-brand-primary/60 hover:text-brand-text',
                )}
              >
                <span className="w-6 h-6 rounded-full bg-brand-border text-brand-muted flex items-center justify-center text-xs font-bold shrink-0">
                  ·
                </span>
                {item}
              </button>
            ))}
          </div>
        )}

        <p className="text-[11px] text-brand-muted text-center">
          {allRanked
            ? 'All ranked — tap any to remove'
            : `${ranked.length} of ${options.length} ranked`}
        </p>

        <button
          onClick={onNext}
          disabled={!allRanked}
          className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed"
        >
          Continue →
        </button>

      </div>
    </div>
  )
}
