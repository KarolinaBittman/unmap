import { useUserStore } from '@/store/userStore'

// Pastel sky → pastel mint mesh gradient — text stays dark since bg is light
const CARD_BG = {
  background:
    'radial-gradient(circle at 10% 10%, #BAE6FD 0%, transparent 55%), ' +
    'radial-gradient(circle at 90% 90%, #A7F3D0 0%, transparent 55%), ' +
    '#E0F7F4',
}

const clarityMessages = [
  { threshold: 80, message: 'Your vision is crystal clear.' },
  { threshold: 60, message: 'Your vision is getting clearer.' },
  { threshold: 40, message: 'The picture is starting to form.' },
  { threshold: 0,  message: 'Every step adds more clarity.' },
]

export default function PointBClarityCard() {
  const { pointBClarity } = useUserStore()
  const { message } = clarityMessages.find((m) => pointBClarity >= m.threshold)

  return (
    <div
      className="rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
      style={CARD_BG}
    >
      <p className="text-[#1a1a2e]/50 text-xs font-body uppercase tracking-wider">
        Point B Clarity
      </p>
      <div className="flex items-end gap-2 mt-2">
        <h2 className="text-5xl font-heading font-bold leading-none text-[#1a1a2e]">
          {pointBClarity}
        </h2>
        <span className="text-2xl font-heading font-semibold mb-1 text-[#1a1a2e]/60">
          %
        </span>
      </div>
      <p className="text-[#1a1a2e]/70 text-sm mt-2">{message}</p>

      {/* Progress bar */}
      <div className="mt-4 bg-[#1a1a2e]/10 rounded-full h-1.5">
        <div
          className="bg-[#1a1a2e]/30 rounded-full h-1.5 transition-all duration-700"
          style={{ width: `${pointBClarity}%` }}
        />
      </div>

      <p className="text-[#1a1a2e]/45 text-xs mt-2">
        Based on your journey conversations
      </p>
    </div>
  )
}
