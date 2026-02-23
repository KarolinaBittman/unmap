import { useUserStore } from '@/store/userStore'

const clarityMessages = [
  { threshold: 80, message: 'Your vision is crystal clear.' },
  { threshold: 60, message: 'Your vision is getting clearer.' },
  { threshold: 40, message: 'The picture is starting to form.' },
  { threshold: 0, message: 'Every step adds more clarity.' },
]

export default function PointBClarityCard() {
  const { pointBClarity } = useUserStore()
  const { message } = clarityMessages.find((m) => pointBClarity >= m.threshold)

  return (
    <div className="bg-gradient-to-br from-blue-400 via-teal-300 to-yellow-300 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-all duration-200">
      <p className="text-white/70 text-xs font-body uppercase tracking-wider">
        Point B Clarity
      </p>
      <div className="flex items-end gap-2 mt-2">
        <h2 className="text-5xl font-heading font-bold leading-none">
          {pointBClarity}
        </h2>
        <span className="text-2xl font-heading font-semibold mb-1 text-white/80">
          %
        </span>
      </div>
      <p className="text-white/80 text-sm mt-2">{message}</p>

      {/* Progress bar */}
      <div className="mt-4 bg-white/20 rounded-full h-1.5">
        <div
          className="bg-white rounded-full h-1.5 transition-all duration-700"
          style={{ width: `${pointBClarity}%` }}
        />
      </div>

      <p className="text-white/60 text-xs mt-2">
        Based on your journey conversations
      </p>
    </div>
  )
}
