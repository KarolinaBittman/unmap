import { useNavigate } from 'react-router-dom'
import StageCard from './StageCard'
import { STAGES } from '@/lib/prompts'
import { useUserStore } from '@/store/userStore'

const STAGE_ROUTES = {
  1: '/wheel',
  2: '/blocks',
  3: '/identity',
  4: '/pointb',
  5: '/vehicle',
  6: '/location',
}

export default function JourneyStages() {
  const { profile } = useUserStore()
  const navigate = useNavigate()
  const currentStage = profile.currentStage

  function getStatus(stageId) {
    if (stageId < currentStage) return 'completed'
    if (stageId === currentStage) return 'current'
    return 'locked'
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-brand-text">
          Your Journey
        </h3>
        <span className="text-xs text-brand-muted">
          {currentStage - 1} of 6 complete
        </span>
      </div>

      {/* 2 cols on mobile → 3 on sm → 6 on xl */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 xl:grid-cols-6">
        {STAGES.map((stage) => {
          const status = getStatus(stage.id)
          return (
            <StageCard
              key={stage.id}
              stage={stage}
              status={status}
              onClick={status !== 'locked' ? () => navigate(STAGE_ROUTES[stage.id]) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
