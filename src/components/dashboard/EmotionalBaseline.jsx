import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
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

export default function EmotionalBaseline() {
  const { checkins } = useUserStore()

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading font-semibold text-brand-text">
          Emotional Baseline
        </h3>
        <span className="text-xs text-brand-muted">This week</span>
      </div>
      <p className="text-xs text-brand-muted mb-4">Daily mood check-ins</p>
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
    </div>
  )
}
