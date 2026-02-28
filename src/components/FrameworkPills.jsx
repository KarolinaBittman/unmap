/**
 * Renders a "Informed by:" footnote row of soft teal framework pill badges.
 * Used below every Claude-generated reflection wherever frameworks are cited.
 * Renders nothing when the frameworks array is empty (old reflections, errors).
 */
export default function FrameworkPills({ frameworks }) {
  if (!frameworks || frameworks.length === 0) return null

  return (
    <div className="pt-4 mt-1 border-t border-brand-border">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-brand-muted font-medium shrink-0">
          Informed by:
        </span>
        {frameworks.map((name) => (
          <span
            key={name}
            className="text-[10px] font-medium text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  )
}
