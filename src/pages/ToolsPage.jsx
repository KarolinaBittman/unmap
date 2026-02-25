import { useState } from 'react'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { cn } from '@/lib/utils'

// ── Tool data ──────────────────────────────────────────────────────────────────
const TOOLS = [
  // ── Breathwork ──
  {
    id: 1,
    name: 'Box Breathing (4-4-4-4)',
    category: 'Breathwork',
    description: 'Equal count breath cycle for rapid nervous system regulation. Used by Navy SEALs and first responders.',
    duration: '5 min',
    instructions: [
      'Sit upright with your shoulders relaxed.',
      'Inhale through your nose for 4 counts.',
      'Hold for 4 counts.',
      'Exhale through your mouth for 4 counts.',
      'Hold for 4 counts. That is one cycle.',
      'Repeat 4–6 times. One full round takes about 90 seconds.',
    ],
  },
  {
    id: 2,
    name: '4-7-8 Breathing',
    category: 'Breathwork',
    description: 'Extended exhale activates the parasympathetic nervous system. One of the fastest known anxiety reducers.',
    duration: '4 min',
    instructions: [
      'Exhale completely through your mouth, making an audible sound.',
      'Close your mouth. Inhale quietly through your nose for 4 counts.',
      'Hold your breath for 7 counts.',
      'Exhale completely through your mouth for 8 counts.',
      'That is one cycle. Repeat 3 more times (4 total).',
      'Do not exceed 4 cycles in a single session when starting out.',
    ],
  },
  {
    id: 3,
    name: 'Wim Hof Basic',
    category: 'Breathwork',
    description: 'Controlled hyperventilation followed by breath retention. Energising and immune-activating.',
    duration: '15 min',
    instructions: [
      'Lie down in a safe space. Never do this in water or while driving.',
      'Take 30 deep, rapid breaths — deep inhale through nose, let exhale go naturally.',
      'After the 30th breath, exhale fully and hold as long as comfortable.',
      'When you feel the urge to breathe, take one deep inhale and hold for 15 seconds.',
      'Exhale. That completes 1 round.',
      'Repeat for 3 rounds total. You may feel tingling or lightheadedness — this is normal.',
    ],
  },
  {
    id: 4,
    name: 'Physiological Sigh',
    category: 'Breathwork',
    description: 'The fastest single-breath stress reset. Proven to reduce anxiety in under 90 seconds.',
    duration: '1 min',
    instructions: [
      'Take a full, deep inhale through your nose.',
      'At the top of the inhale, take one short extra sniff to fully inflate the lungs.',
      'Exhale slowly and completely through your mouth — longer than the inhale.',
      'That is one physiological sigh.',
      'Repeat 2–3 times. You will notice a shift almost immediately.',
      'This works because the extended exhale activates the vagus nerve.',
    ],
  },

  // ── Movement ──
  {
    id: 5,
    name: 'Body Scan',
    category: 'Movement',
    description: 'Move slow attention through the body to release stored tension and return to the present moment.',
    duration: '10 min',
    instructions: [
      'Lie on your back or sit somewhere comfortable.',
      'Close your eyes. Take three slow, deep breaths.',
      'Bring attention to the crown of your head. Notice any sensation without judging.',
      'Slowly move down — forehead, eyes, jaw (is it clenched?), neck, shoulders.',
      'Continue down through chest, arms, hands, belly, lower back, hips, legs, feet.',
      'If you notice tension anywhere, breathe into it and let it soften on the exhale.',
      'Use a timer. 10 minutes is enough.',
    ],
  },
  {
    id: 6,
    name: 'Progressive Muscle Relaxation',
    category: 'Movement',
    description: 'Systematically tense and release each muscle group to break the physical stress cycle.',
    duration: '15 min',
    instructions: [
      'Lie on your back in a quiet space.',
      'Start at your feet. Curl your toes tightly for 5 seconds, then release completely.',
      'Notice the contrast between tension and release — that difference is the point.',
      'Move up: calves, thighs, glutes, stomach, fists (squeeze hard), biceps, shoulders (shrug to ears), face (scrunch everything).',
      'Tense each group for 5 seconds. Release for 10 seconds. Breathe.',
      'End with three slow, deep breaths. Your body should feel significantly heavier.',
    ],
  },
  {
    id: 7,
    name: 'Cold Exposure',
    category: 'Movement',
    description: 'Cold water triggers a norepinephrine surge. Improves mood, focus, energy, and stress resilience over time.',
    duration: '2–5 min',
    instructions: [
      'Finish your normal shower, then switch to cold — as cold as it goes.',
      'Stay under for a minimum of 30 seconds. The target is 2–3 minutes.',
      'Focus on slow, controlled breathing. Do not hold your breath.',
      'The discomfort peaks in the first 20 seconds and then eases. Stay past the peak.',
      'Start with 30 seconds daily. Build to 2 minutes over 2 weeks.',
      'Do not do this if you have heart conditions. Consult your doctor first.',
    ],
  },

  // ── Journaling ──
  {
    id: 8,
    name: 'Morning Pages',
    category: 'Journaling',
    description: 'Longhand stream-of-consciousness writing first thing. Drains cognitive noise before the day begins.',
    duration: '20 min',
    instructions: [
      'Before coffee, before your phone — first thing in the morning.',
      'Open a physical notebook (not a screen) and write 3 full pages.',
      'Write whatever comes. Do not edit, do not stop, do not reread.',
      "If you have nothing to say, write \"I have nothing to say\" until something arrives.",
      'Close the notebook when you are done. You do not have to read it ever.',
      'Do this every morning for 7 consecutive days before evaluating the practice.',
    ],
  },
  {
    id: 9,
    name: 'Gratitude Journal',
    category: 'Journaling',
    description: 'Rewires the brain toward positive pattern recognition. Measurably improves wellbeing in 21 days.',
    duration: '5 min',
    instructions: [
      'At the end of each day, write 3 specific things you are grateful for.',
      "Be specific — not \"my health\" but \"the walk I took at lunch and how the light hit the trees.\"",
      'Write one sentence about why each thing matters to you.',
      'Do not repeat the same entries — novelty is what activates the reward system.',
      'Do this for 21 consecutive days before deciding if it works.',
      'The effect builds slowly. Week 3 is different from Week 1.',
    ],
  },
  {
    id: 10,
    name: 'Unsent Letter',
    category: 'Journaling',
    description: 'Write a letter you will never send. Surfaces and processes buried emotion with zero social risk.',
    duration: '20–30 min',
    instructions: [
      'Choose a person, a past version of yourself, or a situation you need to say something to.',
      'Write a letter as if you will send it — raw, unfiltered, completely honest.',
      'Say the things you never said. Express anger, grief, love, fear — all of it.',
      'Do not edit. Do not censor. The point is to move it from your body onto the page.',
      'When done, read it once. Then: burn it, shred it, or keep it somewhere private.',
      'Notice how your body feels before and after. That difference is the work.',
    ],
  },
  {
    id: 11,
    name: 'Stream of Consciousness',
    category: 'Journaling',
    description: 'Write without stopping for a set time. Bypasses the editorial mind and surfaces what is actually there.',
    duration: '10–15 min',
    instructions: [
      'Set a timer for 10–15 minutes.',
      'Start writing and do not stop until the timer ends.',
      'No topic needed — let the pen follow whatever arises.',
      "If you get stuck, write \"stuck\" repeatedly until the next thing comes.",
      'Do not lift the pen. Do not reread while writing. Do not judge.',
      'When the timer ends, you are done. Close the notebook.',
    ],
  },

  // ── Therapy ──
  {
    id: 12,
    name: 'Rapid Transformational Therapy (RTT)',
    category: 'Therapy',
    description: 'Hypnotherapy-based approach that targets root cause beliefs formed in childhood and rewrites them in session. Created by Marisa Peer.',
    duration: '1–2 sessions',
    link: 'https://marisapeer.com/find-a-therapist',
    linkLabel: 'Find an RTT therapist',
  },
  {
    id: 13,
    name: 'EMDR',
    category: 'Therapy',
    description: 'Eye Movement Desensitisation and Reprocessing. Bilateral stimulation helps the brain reprocess traumatic memories that are stuck. Clinically proven for PTSD.',
    duration: 'Varies by case',
    link: 'https://emdria.org/find-a-therapist',
    linkLabel: 'Find an EMDR therapist',
  },
  {
    id: 14,
    name: 'Internal Family Systems (IFS)',
    category: 'Therapy',
    description: 'The mind contains multiple parts — Managers, Exiles, Firefighters. The Self can lead when all parts are heard and healed. No bad parts, only protecting parts.',
    duration: 'Ongoing',
    link: 'https://ifs-institute.com/practitioners',
    linkLabel: 'Find an IFS practitioner',
  },
  {
    id: 15,
    name: 'Somatic Experiencing (SE)',
    category: 'Therapy',
    description: 'Trauma lives in the body, not just the mind. SE helps discharge stored tension by completing the incomplete stress response cycle. Created by Peter Levine.',
    duration: 'Ongoing',
    link: 'https://traumahealing.org/se-practitioners',
    linkLabel: 'Find an SE practitioner',
  },
]

// ── Category config ────────────────────────────────────────────────────────────
const CATEGORY_META = {
  Breathwork: { badge: 'bg-teal-50 text-teal-600',    dot: 'bg-teal-400' },
  Movement:   { badge: 'bg-blue-50 text-blue-600',    dot: 'bg-blue-400' },
  Journaling: { badge: 'bg-pink-50 text-pink-600',    dot: 'bg-pink-400' },
  Therapy:    { badge: 'bg-purple-50 text-purple-600', dot: 'bg-purple-400' },
}

const CATEGORIES = ['All', 'Breathwork', 'Movement', 'Journaling', 'Therapy']

// ── Tool card ──────────────────────────────────────────────────────────────────
function ToolCard({ tool }) {
  const [expanded, setExpanded] = useState(false)
  const meta = CATEGORY_META[tool.category]
  const isExternal = !!tool.link

  return (
    <div className="bg-white rounded-2xl border border-brand-border overflow-hidden">
      {/* Header row */}
      <div
        onClick={() => !isExternal && setExpanded((e) => !e)}
        className={cn(
          'p-5',
          !isExternal && 'cursor-pointer hover:bg-brand-surface/30 transition-colors duration-150',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <h3 className="font-heading font-semibold text-sm text-brand-text leading-snug">
                {tool.name}
              </h3>
              <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', meta.badge)}>
                {tool.category}
              </span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">{tool.description}</p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0 ml-2">
            <span className="text-[10px] text-brand-muted whitespace-nowrap">{tool.duration}</span>
            {!isExternal && (
              expanded
                ? <ChevronUp size={15} className="text-brand-muted" />
                : <ChevronDown size={15} className="text-brand-muted" />
            )}
          </div>
        </div>

        {/* External link for therapy tools */}
        {isExternal && (
          <a
            href={tool.link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/70 transition-colors"
          >
            <ExternalLink size={12} />
            {tool.linkLabel}
          </a>
        )}
      </div>

      {/* Expanded instructions */}
      {expanded && tool.instructions && (
        <div className="px-5 pb-5 border-t border-brand-border bg-brand-surface/40">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest pt-4 mb-3">
            How to do it
          </p>
          <ol className="space-y-2">
            {tool.instructions.map((step, i) => (
              <li key={i} className="flex gap-2.5 text-xs text-brand-text leading-snug">
                <span className="text-brand-primary font-bold shrink-0 tabular-nums">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function ToolsPage() {
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleTools = activeCategory === 'All'
    ? TOOLS
    : TOOLS.filter((t) => t.category === activeCategory)

  // Group by category preserving order
  const sections = ['Breathwork', 'Movement', 'Journaling', 'Therapy']
    .map((cat) => ({ cat, tools: visibleTools.filter((t) => t.category === cat) }))
    .filter(({ tools }) => tools.length > 0)

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-2xl">
            <h1 className="font-heading font-bold text-2xl text-brand-text mb-1">
              Wellness Tools
            </h1>
            <p className="text-brand-muted text-sm mb-6">
              Practical techniques for nervous system regulation, reflection, and healing.
              Use these alongside your journey stages.
            </p>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200',
                    activeCategory === cat
                      ? 'bg-brand-primary text-white shadow-sm'
                      : 'bg-white border border-brand-border text-brand-muted hover:text-brand-text hover:border-brand-primary/30',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tool sections */}
            <div className="space-y-10">
              {sections.map(({ cat, tools }) => (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${CATEGORY_META[cat].dot}`} />
                    <h2 className="font-heading font-semibold text-brand-text text-sm">{cat}</h2>
                    <span className="text-xs text-brand-muted">{tools.length} tools</span>
                  </div>
                  <div className="space-y-3">
                    {tools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
