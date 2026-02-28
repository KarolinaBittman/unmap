import { useState } from 'react'
import {
  Wind, BookMarked, Waves, Heart, Eye, PenLine,
  Clock, RefreshCw, Focus, ArrowRight, ChevronUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { getStageResources } from '@/lib/resources'

// Map icon name string (from resources.js) → lucide component
const ICON_MAP = {
  Wind,
  BookMarked,
  Waves,
  Heart,
  Eye,
  PenLine,
  Clock,
  RefreshCw,
  Focus,
  // Footprints isn't in all lucide versions — fall back gracefully
  Footprints: Waves,
}

export default function WellnessTools() {
  const [expanded, setExpanded] = useState(null)
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const { tools } = getStageResources(profile?.currentStage)

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
        {tools.map(({ title, description, icon, duration, color, bg, instructions }) => {
          const Icon = ICON_MAP[icon] ?? Wind
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
