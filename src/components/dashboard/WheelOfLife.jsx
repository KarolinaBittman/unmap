import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import WheelChart from './WheelChart'

export default function WheelOfLife() {
  const { wheelScores } = useUserStore()
  const navigate = useNavigate()

  const avg = (
    Object.values(wheelScores).reduce((a, b) => a + b, 0) /
    Object.values(wheelScores).length
  ).toFixed(1)

  return (
    <div
      onClick={() => navigate('/wheel')}
      className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border cursor-pointer hover:border-brand-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading font-semibold text-brand-text">
          Wheel of Life
        </h3>
        <span className="text-xs font-medium text-brand-primary bg-brand-surface px-2.5 py-1 rounded-full">
          Avg {avg}/10
        </span>
      </div>
      <p className="text-xs text-brand-muted mb-4">Stage 1 snapshot</p>
      <div className="w-full aspect-square max-w-[280px] mx-auto">
        <WheelChart scores={wheelScores} />
      </div>
    </div>
  )
}
