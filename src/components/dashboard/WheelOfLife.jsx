import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'
import { useUserStore } from '@/store/userStore'

export default function WheelOfLife() {
  const { wheelScores } = useUserStore()

  const data = [
    { area: 'Career', score: wheelScores.career, fullMark: 10 },
    { area: 'Health', score: wheelScores.health, fullMark: 10 },
    { area: 'Relationships', score: wheelScores.relationships, fullMark: 10 },
    { area: 'Money', score: wheelScores.money, fullMark: 10 },
    { area: 'Growth', score: wheelScores.growth, fullMark: 10 },
    { area: 'Fun', score: wheelScores.fun, fullMark: 10 },
    { area: 'Environment', score: wheelScores.environment, fullMark: 10 },
    { area: 'Purpose', score: wheelScores.purpose, fullMark: 10 },
  ]

  const avg = (
    Object.values(wheelScores).reduce((a, b) => a + b, 0) /
    Object.values(wheelScores).length
  ).toFixed(1)

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-brand-border">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-heading font-semibold text-brand-text">
          Wheel of Life
        </h3>
        <span className="text-xs font-medium text-brand-primary bg-brand-surface px-2.5 py-1 rounded-full">
          Avg {avg}/10
        </span>
      </div>
      <p className="text-xs text-brand-muted mb-4">Stage 1 snapshot</p>
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data} margin={{ top: 0, right: 20, bottom: 0, left: 20 }}>
          <PolarGrid gridType="polygon" stroke="#E2DFF0" />
          <PolarAngleAxis
            dataKey="area"
            tick={{ fill: '#8B85A0', fontSize: 11, fontFamily: 'Inter' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 10]}
            tick={false}
            axisLine={false}
          />
          <Radar
            name="Life Score"
            dataKey="score"
            stroke="#0D9488"
            fill="#0D9488"
            fillOpacity={0.3}
            dot={{ fill: '#0D9488', r: 4, strokeWidth: 0 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
