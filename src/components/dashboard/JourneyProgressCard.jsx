import { useUserStore } from '@/store/userStore'
import { STAGE_NAMES } from '@/lib/prompts'

export default function JourneyProgressCard() {
  const { journeyProgress, profile } = useUserStore()
  const allDone = profile.currentStage > 6
  const displayStage = Math.min(profile.currentStage, 6)
  const remaining = 6 - displayStage

  return (
    <div className="bg-gradient-to-br from-pink-400 via-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-200">
      <p className="text-white/70 text-xs font-body uppercase tracking-wider">
        Journey Progress
      </p>
      <div className="flex items-end gap-2 mt-2">
        <h2 className="text-5xl font-heading font-bold leading-none">
          {journeyProgress}
        </h2>
        <span className="text-2xl font-heading font-semibold mb-1 text-white/80">
          %
        </span>
      </div>
      <p className="text-white/80 text-sm mt-2">
        {allDone
          ? 'All stages complete'
          : `Stage ${displayStage} · ${STAGE_NAMES[displayStage] ?? 'In Progress'}`}
      </p>

      {/* Progress bar */}
      <div className="mt-4 bg-white/20 rounded-full h-1.5">
        <div
          className="bg-white rounded-full h-1.5 transition-all duration-700"
          style={{ width: `${journeyProgress}%` }}
        />
      </div>

      <p className="text-white/60 text-xs mt-2">
        {allDone
          ? 'All complete'
          : `${remaining} stage${remaining !== 1 ? 's' : ''} remaining`}
      </p>
    </div>
  )
}
