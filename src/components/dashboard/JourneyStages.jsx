import StageCard from './StageCard'
import { STAGES } from '@/lib/prompts'
import { useUserStore } from '@/store/userStore'

export default function JourneyStages() {
  const { profile } = useUserStore()
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

      {/* 2 rows of 3 below 1280px, single row of 6 at xl+ */}
      <div className="grid grid-cols-3 gap-3 xl:grid-cols-6">
        {STAGES.map((stage) => (
          <StageCard key={stage.id} stage={stage} status={getStatus(stage.id)} />
        ))}
      </div>
    </div>
  )
}
