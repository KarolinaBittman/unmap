import { useUserStore } from '@/store/userStore'
import { STAGE_NAMES } from '@/lib/prompts'

// Pastel coral → soft purple mesh gradient — text stays dark since bg is light
const CARD_BG = {
  background:
    'radial-gradient(circle at 10% 10%, #FFBDAD 0%, transparent 55%), ' +
    'radial-gradient(circle at 90% 90%, #D4BBFF 0%, transparent 55%), ' +
    '#FDE8E0',
}

export default function JourneyProgressCard() {
  const { journeyProgress, profile } = useUserStore()
  const allDone = profile.currentStage > 6
  const displayStage = Math.min(profile.currentStage, 6)
  const remaining = 6 - displayStage

  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
      style={CARD_BG}
    >
      <p className="text-[#1a1a2e]/50 text-xs font-body uppercase tracking-wider">
        Journey Progress
      </p>
      <div className="flex items-end gap-2 mt-2">
        <h2 className="text-5xl font-heading font-bold leading-none text-[#1a1a2e]">
          {journeyProgress}
        </h2>
        <span className="text-2xl font-heading font-semibold mb-1 text-[#1a1a2e]/60">
          %
        </span>
      </div>
      <p className="text-[#1a1a2e]/70 text-sm mt-2">
        {allDone
          ? 'All stages complete'
          : `Stage ${displayStage} · ${STAGE_NAMES[displayStage] ?? 'In Progress'}`}
      </p>

      {/* Progress bar */}
      <div className="mt-4 bg-[#1a1a2e]/10 rounded-full h-1.5">
        <div
          className="bg-[#1a1a2e]/30 rounded-full h-1.5 transition-all duration-700"
          style={{ width: `${journeyProgress}%` }}
        />
      </div>

      <p className="text-[#1a1a2e]/45 text-xs mt-2">
        {allDone
          ? 'All complete'
          : `${remaining} stage${remaining !== 1 ? 's' : ''} remaining`}
      </p>
    </div>
  )
}
