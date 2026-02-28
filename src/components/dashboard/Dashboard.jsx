import JourneyProgressCard from './JourneyProgressCard'
import PointBClarityCard from './PointBClarityCard'
import YourNextMoveCard from './YourNextMoveCard'
import WheelOfLife from './WheelOfLife'
import EmotionalBaseline from './EmotionalBaseline'
import JourneyStages from './JourneyStages'
import TodaysResources from './TodaysResources'
import WellnessTools from './WellnessTools'
import { useUserStore } from '@/store/userStore'
import { STAGE_NAMES } from '@/lib/prompts'

function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { profile } = useUserStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading font-bold text-2xl text-brand-text">
          {greeting()}, {profile.name}
        </h1>
        <p className="text-brand-muted text-sm mt-1">
          {profile.currentStage > 6 ? (
            <span className="text-brand-primary font-medium">All stages complete</span>
          ) : (
            <>
              Stage {profile.currentStage} of 6 ·{' '}
              <span className="text-brand-primary font-medium">
                {STAGE_NAMES[profile.currentStage]}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Progress cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <JourneyProgressCard />
        <PointBClarityCard />
        <YourNextMoveCard />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <WheelOfLife />
        <EmotionalBaseline />
      </div>

      {/* Journey stages */}
      <JourneyStages />

      {/* Resources + Wellness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-20 md:pb-0">
        <TodaysResources />
        <WellnessTools />
      </div>
    </div>
  )
}
