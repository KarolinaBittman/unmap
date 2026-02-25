import { BookOpen, FileText, Pencil, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const resources = [
  {
    title: 'Ikigai: The Japanese Secret to a Long Life',
    type: 'Book',
    framework: 'Ikigai',
    Icon: BookOpen,
  },
  {
    title: 'How to Design Your Life',
    type: 'Article',
    framework: 'Design Your Life',
    Icon: FileText,
  },
  {
    title: 'Values Clarification Exercise',
    type: 'Exercise',
    framework: 'VIA Strengths',
    Icon: Pencil,
  },
]

export default function TodaysResources() {
  const navigate = useNavigate()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-brand-text">
          Today's Resources
        </h3>
        <button
          onClick={() => navigate('/resources')}
          className="text-xs text-brand-primary font-medium hover:underline"
        >
          View all
        </button>
      </div>

      <div className="space-y-3">
        {resources.map(({ title, type, framework, Icon }) => (
          <div
            key={title}
            onClick={() => navigate('/resources')}
            className="flex items-start gap-3 p-3 bg-brand-surface rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
          >
            <div className="w-8 h-8 bg-brand-primary/10 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <Icon size={15} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-text leading-snug">
                {title}
              </p>
              <p className="text-xs text-brand-muted mt-0.5">
                {type} · {framework}
              </p>
            </div>
            <ExternalLink
              size={14}
              className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
