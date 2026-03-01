import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'

// Winding path from bottom-left to top-right across a 1440×900 canvas.
// Each cubic bezier segment ends exactly on one of the 6 stage waypoints.
const PATH =
  'M 80,850 ' +
  'C 200,780 180,700 300,660 ' +
  'C 420,620 440,690 560,640 ' +
  'C 680,590 640,510 760,460 ' +
  'C 880,410 940,480 1060,420 ' +
  'C 1180,360 1140,270 1260,220 ' +
  'C 1320,195 1370,130 1400,80'

// (x, y) at each bezier segment endpoint — used for waypoint dots.
const WAYPOINTS = [
  [300, 660],
  [560, 640],
  [760, 460],
  [1060, 420],
  [1260, 220],
  [1400, 80],
]

// journeyProgress % at which each stage waypoint is considered "reached"
const STAGE_THRESHOLDS = [17, 33, 50, 67, 83, 100]

// ── 4-pointed sparkle — renders inside an <svg> context ──────────────────────
function Sparkle({ cx, cy, r, color, opacity }) {
  const d = r
  const s = d * 0.45
  return (
    <g opacity={opacity}>
      <line x1={cx} y1={cy - d} x2={cx} y2={cy + d}         stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1={cx - d} y1={cy} x2={cx + d} y2={cy}         stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <line x1={cx - s} y1={cy - s} x2={cx + s} y2={cy + s} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <line x1={cx + s} y1={cy - s} x2={cx - s} y2={cy + s} stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </g>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
// Renders a viewport-fixed SVG illustration on desktop, soft orb blobs on
// mobile. Uses `position: fixed` so it is always full-viewport and never
// clipped by a parent container — it shows correctly on both short and long
// pages. Content that should appear above it needs `relative z-10`.
//
// Props:
//   progress    – override journeyProgress from the store (optional).
//                 Pass 0 on auth/pre-journey pages.
//   scrollFill  – when true, the gradient stroke fills as the user scrolls
//                 down the page (used on the landing page). The filled stroke
//                 starts at the path origin and fills toward the end as
//                 scrollY increases from 0 to max scroll.
export default function PathBackground({ progress: progressProp, scrollFill = false }) {
  const { journeyProgress } = useUserStore()
  const pct = progressProp !== undefined ? progressProp : journeyProgress

  // stroke-dashoffset trick with pathLength="1000":
  //   dashoffset = 1000 → nothing shown; 0 → full path shown
  const dashOffset = 1000 - (pct / 100) * 1000

  // ── Scroll-driven fill (landing page only) ───────────────────────────────
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    if (!scrollFill) return

    function onScroll() {
      const maxScroll = document.body.scrollHeight - window.innerHeight
      if (maxScroll <= 0) return
      setScrollPct(Math.min(1, window.scrollY / maxScroll))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // set initial value
    return () => window.removeEventListener('scroll', onScroll)
  }, [scrollFill])

  // No CSS transition here — follows scroll in real-time
  const scrollDashOffset = 1000 - scrollPct * 1000

  return (
    <>
      {/* ── Desktop: full SVG illustration ───────────────────────────────── */}
      <svg
        className="fixed inset-0 w-full h-full hidden md:block pointer-events-none select-none"
        style={{ zIndex: 0 }}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* Journey progress gradient: coral → lavender → mint */}
          <linearGradient id="pathGradBg" x1="5%" y1="95%" x2="95%" y2="5%">
            <stop offset="0%"   stopColor="#FFBDAD" />
            <stop offset="45%"  stopColor="#D4BBFF" />
            <stop offset="100%" stopColor="#A7F3D0" />
          </linearGradient>

          {/* Scroll-fill gradient: coral → lavender → teal (landing page) */}
          {scrollFill && (
            <linearGradient id="scrollFillGrad" x1="5%" y1="95%" x2="95%" y2="5%">
              <stop offset="0%"   stopColor="#FFBDAD" />
              <stop offset="50%"  stopColor="#C4B5FD" />
              <stop offset="100%" stopColor="#2DD4BF" />
            </linearGradient>
          )}
        </defs>

        {/* ── Mountain ranges — always visible, positioned in margins ────── */}
        {/* Bottom-left cluster — behind path origin */}
        <polygon points="20,880 210,670 400,880"  fill="#EDE9FE" opacity="0.48" />
        <polygon points="70,880 230,715 390,880"  fill="#E9E3FF" opacity="0.38" />
        <polygon points="10,880 108,748 206,880"  fill="#D4BBFF" opacity="0.32" />

        {/* Top-right cluster — behind path destination */}
        <polygon points="1075,225 1232,48  1390,225" fill="#A7F3D0" opacity="0.44" />
        <polygon points="1185,225 1318,72  1440,225" fill="#BAE6FD" opacity="0.36" />
        <polygon points="1118,225 1215,112 1312,225" fill="#CCFBF1" opacity="0.46" />

        {/* Small mid-right accent range */}
        <polygon points="1308,490 1393,382 1440,490" fill="#FDE68A" opacity="0.28" />
        <polygon points="1342,490 1403,402 1440,490" fill="#FEF9C3" opacity="0.22" />

        {/* ── Sprouts / plants — lower margins ────────────────────────────── */}
        <line x1="338" y1="792" x2="338" y2="758" stroke="#6EE7B7" strokeWidth="2.5" strokeLinecap="round" opacity="0.52" />
        <ellipse cx="326" cy="756" rx="13" ry="7"  fill="#A7F3D0" opacity="0.48" />
        <ellipse cx="350" cy="760" rx="11" ry="6"  fill="#6EE7B7" opacity="0.38" />

        <line x1="390" y1="818" x2="390" y2="786" stroke="#9FC4B7" strokeWidth="2" strokeLinecap="round" opacity="0.46" />
        <ellipse cx="380" cy="784" rx="11" ry="6"  fill="#A7F3D0" opacity="0.42" />

        <line x1="1368" y1="725" x2="1368" y2="696" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round" opacity="0.38" />
        <ellipse cx="1358" cy="694" rx="10" ry="6"  fill="#A7F3D0" opacity="0.35" />
        <ellipse cx="1378" cy="698" rx="9"  ry="5"  fill="#6EE7B7" opacity="0.30" />

        {/* ── Sparkles — scattered in margin zones ────────────────────────── */}
        <Sparkle cx={158}  cy={568} r={9}  color="#D4BBFF" opacity={0.52} />
        <Sparkle cx={428}  cy={492} r={7}  color="#FFBDAD" opacity={0.48} />
        <Sparkle cx={1092} cy={348} r={8}  color="#A7F3D0" opacity={0.50} />
        <Sparkle cx={1322} cy={252} r={10} color="#BAE6FD" opacity={0.52} />
        <Sparkle cx={1392} cy={432} r={6}  color="#D4BBFF" opacity={0.40} />
        <Sparkle cx={198}  cy={742} r={6}  color="#FFBDAD" opacity={0.46} />
        <Sparkle cx={638}  cy={782} r={5}  color="#EDE9FE" opacity={0.38} />

        {/* ── Floating accent circles ──────────────────────────────────────── */}
        <circle cx="248"  cy="638" r="7"  fill="#FFBDAD" opacity="0.40" />
        <circle cx="1202" cy="502" r="5"  fill="#BAE6FD" opacity="0.46" />
        <circle cx="1082" cy="138" r="6"  fill="#A7F3D0" opacity="0.46" />
        <circle cx="1418" cy="558" r="7"  fill="#FDE68A" opacity="0.36" />
        <circle cx="98"   cy="458" r="4"  fill="#EDE9FE" opacity="0.38" />
        <circle cx="492"  cy="758" r="5"  fill="#E9E3FF" opacity="0.40" />

        {/*
          ── Path tracks — full viewport ───────────────────────────────────────
          Both tracks render across the entire screen. White-background content
          cards (z-10) sit visually above the path wherever they overlap. The
          path shows naturally in margins and gaps between content sections.
        */}
        {/* Grey track (full unlit path) */}
        <path
          d={PATH}
          fill="none"
          stroke="#DDD8EE"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.65"
        />

        {/* Journey progress fill — driven by journeyProgress store value */}
        <path
          d={PATH}
          fill="none"
          stroke="url(#pathGradBg)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength="1000"
          strokeDasharray="1000"
          strokeDashoffset={dashOffset}
          opacity="0.78"
          style={{ transition: 'stroke-dashoffset 1.4s ease-out' }}
        />

        {/* Scroll-fill overlay — only rendered on landing page (scrollFill=true).
            Fills from path start toward end as user scrolls down. No transition
            so it tracks scroll position in real time. */}
        {scrollFill && (
          <path
            d={PATH}
            fill="none"
            stroke="url(#scrollFillGrad)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength="1000"
            strokeDasharray="1000"
            strokeDashoffset={scrollDashOffset}
            opacity="0.85"
          />
        )}

        {/* ── Stage waypoint dots ──────────────────────────────────────────── */}
        {WAYPOINTS.map(([cx, cy], i) => {
          const reached = pct >= STAGE_THRESHOLDS[i]
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={8}
              fill={reached ? '#2DD4BF' : '#DDD8EE'}
              stroke="white"
              strokeWidth="2.5"
              opacity="0.88"
              style={{ transition: 'fill 0.8s ease' }}
            />
          )
        })}
      </svg>

      {/* ── Mobile: soft pastel orb blobs (no SVG path on small screens) ── */}
      <div
        className="fixed inset-0 md:hidden pointer-events-none select-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        <div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full orb-drift-1"
          style={{ background: 'radial-gradient(circle, rgba(248,181,160,0.26) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-24 -right-24 w-60 h-60 rounded-full orb-drift-2"
          style={{ background: 'radial-gradient(circle, rgba(196,181,253,0.22) 0%, transparent 65%)' }}
        />
        <div
          className="absolute top-1/2 -right-10 w-52 h-52 rounded-full orb-drift-3"
          style={{ background: 'radial-gradient(circle, rgba(167,243,208,0.16) 0%, transparent 70%)' }}
        />
      </div>
    </>
  )
}
