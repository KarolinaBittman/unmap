import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { Heart } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'

// Dot coloured by mood score: green >6, amber 4-6, rose <4
function MoodDot(props) {
  const { cx, cy, payload } = props
  const score = payload?.score ?? 5
  const color =
    score > 6 ? '#9FC4B7' : score >= 4 ? '#E8A598' : '#F87171'

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill={color}
      stroke="white"
      strokeWidth={2}
    />
  )
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const score = payload[0].value
  return (
    <div className="bg-white border border-brand-border rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-brand-text">
        Mood: {score}/10
      </p>
    </div>
  )
}

function EmptyState() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-center">
      <div className="w-10 h-10 bg-brand-surface rounded-full flex items-center justify-center border border-brand-border">
        <Heart size={18} className="text-brand-secondary" />
      </div>
      <div>
        <p className="text-sm font-semibold text-brand-text">No check-ins yet</p>
        <p className="text-xs text-brand-muted mt-1 max-w-[200px]">
          Track your mood daily to see your emotional baseline grow.
        </p>
      </div>
      <button
        onClick={() => navigate('/checkin')}
        className="text-sm font-semibold text-brand-primary bg-brand-primary/10 px-4 py-2 rounded-xl hover:bg-brand-primary/20 transition-all duration-200"
      >
        Check in now →
      </button>
    </div>
  )
}

export default function EmotionalBaseline() {
  const { checkins } = useUserStore()
  const navigate = useNavigate()
  const hasData = checkins.length > 0

  return (
    <div
      onClick={() => navigate('/checkin')}
      className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border cursor-pointer hover:border-brand-primary/40 hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading font-semibold text-brand-text">
          Emotional Baseline
        </h3>
        <span className="text-xs text-brand-muted">This week</span>
      </div>
      <p className="text-xs text-brand-muted mb-4">Daily mood check-ins</p>

      {!hasData ? (
        <EmptyState />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <LineChart
            data={checkins}
            margin={{ top: 10, right: 10, bottom: 0, left: -20 }}
          >
            <XAxis
              dataKey="day"
              tick={{ fill: '#8B85A0', fontSize: 11, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 10]}
              ticks={[0, 2, 4, 6, 8, 10]}
              tick={{ fill: '#8B85A0', fontSize: 10, fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#7C6BAE"
              strokeWidth={2.5}
              dot={<MoodDot />}
              activeDot={{ r: 7, fill: '#7C6BAE', stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
