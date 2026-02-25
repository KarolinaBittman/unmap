// Custom SVG pie/donut wheel chart — 8 equal segments, fills from centre by score.
const AREAS = [
  { id: 'career',        label: 'Career',        color: '#93C5FD' },
  { id: 'health',        label: 'Health',         color: '#67E8F9' },
  { id: 'relationships', label: 'Relationships',  color: '#F9A8D4' },
  { id: 'money',         label: 'Money',          color: '#FDE68A' },
  { id: 'growth',        label: 'Growth',         color: '#86EFAC' },
  { id: 'fun',           label: 'Fun',            color: '#FED7AA' },
  { id: 'environment',   label: 'Environment',    color: '#C4B5FD' },
  { id: 'purpose',       label: 'Purpose',        color: '#FCA5A5' },
]

const CX = 150
const CY = 150
const R  = 90   // max outer radius
const INNER_R = 18  // donut hole
const GAP_DEG = 2   // gap between segments (degrees)
const LABEL_R = 116 // radius for label anchors

// Convert polar degrees (0 = top, clockwise) to SVG Cartesian x,y
function pt(r, deg) {
  const rad = ((deg - 90) * Math.PI) / 180
  return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)]
}

// Build filled wedge path from inner radius to score-based outer radius
function wedgePath(score, startDeg, endDeg) {
  const outerR = INNER_R + (score / 10) * (R - INNER_R)
  const [x1, y1] = pt(INNER_R, startDeg)
  const [x2, y2] = pt(outerR, startDeg)
  const [x3, y3] = pt(outerR, endDeg)
  const [x4, y4] = pt(INNER_R, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${x1} ${y1}`,
    'Z',
  ].join(' ')
}

// Build faint background wedge path (full radius)
function bgWedgePath(startDeg, endDeg) {
  const [x1, y1] = pt(INNER_R, startDeg)
  const [x2, y2] = pt(R, startDeg)
  const [x3, y3] = pt(R, endDeg)
  const [x4, y4] = pt(INNER_R, endDeg)
  const largeArc = endDeg - startDeg > 180 ? 1 : 0
  return [
    `M ${x1} ${y1}`,
    `L ${x2} ${y2}`,
    `A ${R} ${R} 0 ${largeArc} 1 ${x3} ${y3}`,
    `L ${x4} ${y4}`,
    `A ${INNER_R} ${INNER_R} 0 ${largeArc} 0 ${x1} ${y1}`,
    'Z',
  ].join(' ')
}

// Text anchor based on angular position
function textAnchor(midDeg) {
  const cos = Math.cos(((midDeg - 90) * Math.PI) / 180)
  if (cos > 0.15) return 'start'
  if (cos < -0.15) return 'end'
  return 'middle'
}

// Nudge label dy for top/bottom segments to avoid overlap with chart edge
function labelDy(midDeg) {
  const sin = Math.sin(((midDeg - 90) * Math.PI) / 180)
  if (sin < -0.7) return -4   // top
  if (sin > 0.7)  return 14   // bottom
  return 5
}

export default function WheelChart({ scores = {}, size }) {
  const segDeg = 360 / AREAS.length  // 45°

  const svgProps = size
    ? { width: size, height: size }
    : { width: '100%', height: '100%', viewBox: '0 0 300 300', style: { overflow: 'visible' } }

  return (
    <svg
      viewBox="0 0 300 300"
      style={{ overflow: 'visible' }}
      {...(size ? { width: size, height: size } : { width: '100%', height: '100%' })}
    >
      {/* Scale rings */}
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <circle
          key={f}
          cx={CX} cy={CY}
          r={INNER_R + f * (R - INNER_R)}
          fill="none"
          stroke="#E2DFF0"
          strokeWidth={f === 1 ? 1.5 : 0.8}
          strokeDasharray={f < 1 ? '3 3' : undefined}
        />
      ))}

      {AREAS.map(({ id, label, color }, i) => {
        const startDeg = i * segDeg + GAP_DEG / 2
        const endDeg   = (i + 1) * segDeg - GAP_DEG / 2
        const midDeg   = (startDeg + endDeg) / 2
        const score    = scores[id] ?? 0
        const [lx, ly] = pt(LABEL_R, midDeg)
        const anchor   = textAnchor(midDeg)
        const dy       = labelDy(midDeg)

        return (
          <g key={id}>
            {/* Background segment */}
            <path
              d={bgWedgePath(startDeg, endDeg)}
              fill={color}
              fillOpacity={0.15}
            />

            {/* Filled score segment */}
            {score > 0 && (
              <path
                d={wedgePath(score, startDeg, endDeg)}
                fill={color}
                fillOpacity={0.9}
              />
            )}

            {/* Score dot at outer edge of fill */}
            {score > 0 && (() => {
              const outerR = INNER_R + (score / 10) * (R - INNER_R)
              const [dx, dy2] = pt(outerR, midDeg)
              return (
                <circle
                  cx={dx} cy={dy2}
                  r={3}
                  fill={color}
                  stroke="white"
                  strokeWidth={1.5}
                />
              )
            })()}

            {/* Label: area name */}
            <text
              x={lx}
              y={ly + dy - 7}
              textAnchor={anchor}
              fontSize={9}
              fontFamily="Inter, sans-serif"
              fill="#8B85A0"
              fontWeight="500"
            >
              {label}
            </text>

            {/* Label: score */}
            <text
              x={lx}
              y={ly + dy + 4}
              textAnchor={anchor}
              fontSize={11}
              fontFamily="Inter, sans-serif"
              fill="#2C2840"
              fontWeight="700"
            >
              {score}
            </text>
          </g>
        )
      })}

      {/* Centre hole — white fill to clean up */}
      <circle cx={CX} cy={CY} r={INNER_R - 1} fill="white" />
    </svg>
  )
}
