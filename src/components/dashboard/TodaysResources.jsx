import { BookOpen, FileText, Pencil, Globe, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { getPersonalisedResources } from '@/lib/resources'

// Map type string → icon component
const TYPE_ICONS = {
  Book: BookOpen,
  Article: FileText,
  Exercise: Pencil,
  Tool: Globe,
}

export default function TodaysResources() {
  const navigate = useNavigate()
  const { profile, checkins } = useUserStore()
  const today = new Date().toISOString().slice(0, 10)
  const todayMood = checkins.find((c) => c.date === today)?.score ?? null
  const { resources } = getPersonalisedResources(profile?.currentStage, todayMood)

  function handleClick(url) {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    } else {
      navigate('/resources')
    }
  }

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
        {resources.map(({ title, type, framework, description, url }) => {
          const Icon = TYPE_ICONS[type] ?? FileText
          return (
            <div
              key={title}
              onClick={() => handleClick(url)}
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
                {description && (
                  <p className="text-xs text-brand-muted/80 mt-1 leading-snug">
                    {description}
                  </p>
                )}
              </div>
              <ExternalLink
                size={14}
                className="text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
