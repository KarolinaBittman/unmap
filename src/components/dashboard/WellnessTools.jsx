import { useState } from 'react'
import { Wind, BookMarked, Waves, ArrowRight, ChevronUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const tools = [
  {
    title: 'Box Breathing',
    description: '4-4-4-4 technique for nervous system reset',
    Icon: Wind,
    duration: '5 min',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
    instructions: [
      'Breathe in through your nose for 4 counts.',
      'Hold for 4 counts.',
      'Exhale through your mouth for 4 counts.',
      'Hold for 4 counts.',
      'Repeat for 4 cycles. Slows the nervous system fast.',
    ],
  },
  {
    title: 'Morning Pages',
    description: 'Stream-of-consciousness journaling',
    Icon: BookMarked,
    duration: '20 min',
    color: 'text-brand-secondary',
    bg: 'bg-pink-50',
    instructions: [
      'First thing in the morning, before coffee or your phone.',
      "Write 3 pages of whatever comes. Don't edit. Don't stop.",
      "When you're done, close the notebook. You don't have to read it.",
      'Do it every morning for one week.',
    ],
  },
  {
    title: 'Body Scan',
    description: 'Grounding through somatic awareness',
    Icon: Waves,
    duration: '10 min',
    color: 'text-brand-primary',
    bg: 'bg-brand-surface',
    instructions: [
      'Sit or lie down somewhere quiet.',
      'Start at the crown of your head. Notice sensation without judging.',
      'Slowly move attention down — face, neck, shoulders, chest, belly, legs, feet.',
      'If you find tension, breathe into it. Then let it go.',
      'Use a timer. 10 minutes is enough.',
    ],
  },
]

export default function WellnessTools() {
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()

  function toggle(title) {
    setExpanded((prev) => (prev === title ? null : title))
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-brand-text">
          Wellness Tools
        </h3>
        <button
          onClick={() => navigate('/tools')}
          className="text-xs text-brand-primary font-medium hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {tools.map(({ title, description, Icon, duration, color, bg, instructions }) => {
          const isOpen = expanded === title
          return (
            <div
              key={title}
              className="rounded-xl border border-brand-border overflow-hidden transition-all duration-200"
            >
              {/* Tool row */}
              <button
                onClick={() => toggle(title)}
                className="w-full flex items-center gap-3 p-3 bg-brand-surface hover:bg-brand-border/20 transition-colors duration-150 text-left"
              >
                <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon size={15} className={color} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-brand-text">{title}</p>
                    <span className="text-xs text-brand-muted">{duration}</span>
                  </div>
                  <p className="text-xs text-brand-muted mt-0.5 leading-snug">{description}</p>
                </div>
                {isOpen
                  ? <ChevronUp size={14} className="text-brand-muted shrink-0" />
                  : <ArrowRight size={14} className="text-brand-muted shrink-0" />
                }
              </button>

              {/* Expanded instructions */}
              {isOpen && (
                <div className="px-4 pb-4 pt-3 bg-white border-t border-brand-border">
                  <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">
                    How to do it
                  </p>
                  <ol className="space-y-1.5">
                    {instructions.map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs text-brand-text leading-snug">
                        <span className="text-brand-primary font-semibold shrink-0">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
