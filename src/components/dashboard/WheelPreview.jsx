import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

const AREA_ORDER = [
  'career',
  'health',
  'relationships',
  'money',
  'growth',
  'fun',
  'environment',
  'purpose',
]

const LABELS = {
  career: 'Career',
  health: 'Health',
  relationships: 'Relationships',
  money: 'Money',
  growth: 'Growth',
  fun: 'Fun',
  environment: 'Environment',
  purpose: 'Purpose',
}

// Pure radar chart that accepts a scores object as a prop.
// Unscored areas (null) render as 0 so the polygon still draws.
export default function WheelPreview({ scores, height = 240 }) {
  const data = AREA_ORDER.map((id) => ({
    area: LABELS[id],
    score: scores[id] ?? 0,
    fullMark: 10,
  }))

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RadarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 20 }}>
        <PolarGrid gridType="polygon" stroke="#E2DFF0" />
        <PolarAngleAxis
          dataKey="area"
          tick={{ fill: '#8B85A0', fontSize: 10, fontFamily: 'Inter' }}
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
          dot={{ fill: '#0D9488', r: 3, strokeWidth: 0 }}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  )
}
