import { Wind, BookMarked, Waves, ArrowRight } from 'lucide-react'

const tools = [
  {
    title: 'Box Breathing',
    description: '4-7-8 technique for nervous system reset',
    Icon: Wind,
    duration: '5 min',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    title: 'Morning Pages',
    description: 'Stream-of-consciousness journaling',
    Icon: BookMarked,
    duration: '20 min',
    color: 'text-brand-secondary',
    bg: 'bg-pink-50',
  },
  {
    title: 'Body Scan',
    description: 'Grounding through somatic awareness',
    Icon: Waves,
    duration: '10 min',
    color: 'text-brand-primary',
    bg: 'bg-brand-surface',
  },
]

export default function WellnessTools() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-brand-text">
          Wellness Tools
        </h3>
        <button className="text-xs text-brand-primary font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-3">
        {tools.map(({ title, description, Icon, duration, color, bg }) => (
          <div
            key={title}
            className="flex items-center gap-3 p-3 bg-brand-surface rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div
              className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}
            >
              <Icon size={15} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-brand-text">{title}</p>
                <span className="text-xs text-brand-muted">{duration}</span>
              </div>
              <p className="text-xs text-brand-muted mt-0.5 leading-snug">
                {description}
              </p>
            </div>
            <ArrowRight
              size={14}
              className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
