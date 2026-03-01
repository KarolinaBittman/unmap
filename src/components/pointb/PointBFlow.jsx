import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import PointBReflectionCard from './PointBReflectionCard'
import QuestionCard from '@/components/onboarding/QuestionCard'
import { useUserStore } from '@/store/userStore'
import { generatePointBReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

// ── Section metadata ─────────────────────────────────────────────────────────
const SECTIONS = [
  { label: 'One Year',     maxStep: 4 },
  { label: 'Three Years',  maxStep: 9 },
  { label: 'Uncensored',   maxStep: 12 },
]

function getActiveSection(step) {
  if (step <= 4)  return 0
  if (step <= 9)  return 1
  return 2
}

// Within-section question progress (null on section break steps)
function getQuestionProgress(step) {
  if (step === 0 || step === 5 || step === 10) return null
  if (step <= 4)  return { current: step,      total: 4 }
  if (step <= 9)  return { current: step - 5,  total: 4 }
  return           { current: step - 10, total: 2 }
}

// ── Content ──────────────────────────────────────────────────────────────────
// 13 items total: 3 section breaks + 10 questions. Reflection at step 13+.
// Step 0   : section break — One Year
// Steps 1–4 : 1-year questions
// Step 5   : section break — Three Years
// Steps 6–9 : 3-year questions
// Step 10  : section break — Uncensored
// Steps 11–12 : uncensored questions

const ITEMS = [
  // ── One Year ──
  {
    type: 'section-break',
    sectionIndex: 0,
    heading: 'One year from now.',
    body: "It's exactly one year from today. You made the moves, things shifted. Picture what your life actually looks like.",
    cta: "Let's see it →",
  },
  {
    id: 'year1_living',
    label: 'Stage 4 · 1 Year · 1 of 4',
    question: 'Where are you living?',
    subtitle: 'City, country, setting — or the kind of environment that feels right.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year1_tuesday',
    label: 'Stage 4 · 1 Year · 2 of 4',
    question: 'What does a typical Tuesday look like?',
    subtitle: 'Walk me through the day — morning, work, evening.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year1_working',
    label: 'Stage 4 · 1 Year · 3 of 4',
    question: 'What are you working on?',
    subtitle: 'Projects, work, side things — what fills your time.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year1_feeling',
    label: 'Stage 4 · 1 Year · 4 of 4',
    question: 'How do you feel when you wake up?',
    subtitle: 'The first emotion when you open your eyes.',
    type: 'text',
    placeholder: 'Write freely…',
  },

  // ── Three Years ──
  {
    type: 'section-break',
    sectionIndex: 1,
    heading: 'Three years from now.',
    subtitle: 'You mapped your first year. Now remove the ceiling.',
    body: "Same questions. But you've had three years. Things compounded. Go bigger.",
    cta: 'Go bigger →',
  },
  {
    id: 'year3_living',
    label: 'Stage 4 · 3 Years · 1 of 4',
    question: 'Where are you living?',
    subtitle: 'Same question, bigger lens. Where did you end up?',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year3_tuesday',
    label: 'Stage 4 · 3 Years · 2 of 4',
    question: 'What does a typical Tuesday look like?',
    subtitle: 'Go bigger than before.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year3_working',
    label: 'Stage 4 · 3 Years · 3 of 4',
    question: 'What are you working on?',
    subtitle: 'Bolder. What did you actually build?',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'year3_feeling',
    label: 'Stage 4 · 3 Years · 4 of 4',
    question: 'How do you feel when you wake up?',
    subtitle: 'The emotion that greets you three years from now.',
    type: 'text',
    placeholder: 'Write freely…',
  },

  // ── Uncensored ──
  {
    type: 'section-break',
    sectionIndex: 2,
    heading: 'Now, uncensored.',
    subtitle: 'Two questions. No editing allowed.',
    body: "No edits. No 'but that's not realistic.' No qualifiers. Just the truth — the version you usually talk yourself out of.",
    cta: 'Tell the truth →',
  },
  {
    id: 'uncensored_build',
    label: 'Stage 4 · Uncensored · 1 of 2',
    question: "If you knew you couldn't fail, what would you build or become?",
    subtitle: "No editing. No 'but.' Just say it.",
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'uncensored_truth',
    label: 'Stage 4 · Uncensored · 2 of 2',
    question: "What's the life you want but haven't let yourself say out loud yet?",
    subtitle: 'The one you edit before it reaches your mouth.',
    type: 'text',
    placeholder: 'Write freely…',
  },
]

const TOTAL_STEPS = ITEMS.length // 13

const ANSWER_FIELDS = [
  'year1_living', 'year1_tuesday', 'year1_working', 'year1_feeling',
  'year3_living', 'year3_tuesday', 'year3_working', 'year3_feeling',
  'uncensored_build', 'uncensored_truth',
]

const INITIAL_ANSWERS = Object.fromEntries(ANSWER_FIELDS.map((f) => [f, '']))

function calcPointBClarity(answers) {
  const total = ANSWER_FIELDS.reduce((sum, key) => {
    const len = (answers[key] || '').trim().length
    if (len === 0) return sum
    if (len <= 20) return sum + 1
    if (len <= 60) return sum + 2
    return sum + 3
  }, 0)
  return Math.round((total / (ANSWER_FIELDS.length * 3)) * 100)
}

// ── Section break card — full-screen moment with delayed CTA ─────────────────
function SectionBreakCard({ item, onAdvance }) {
  const [ctaReady, setCtaReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[58vh] space-y-6 px-2">
      <span className="text-[11px] font-semibold text-brand-muted uppercase tracking-widest">
        Chapter {item.sectionIndex + 1} of 3
      </span>

      <h2 className="font-heading font-bold text-4xl md:text-5xl text-brand-text leading-tight max-w-xs">
        {item.heading}
      </h2>

      {item.subtitle && (
        <p className="text-brand-primary text-sm font-semibold">{item.subtitle}</p>
      )}

      <p className="text-brand-muted text-base leading-relaxed max-w-sm">
        {item.body}
      </p>

      <div
        className="pt-2 transition-all duration-500 ease-out"
        style={{
          opacity:   ctaReady ? 1 : 0,
          transform: ctaReady ? 'translateY(0)' : 'translateY(10px)',
        }}
      >
        <button
          onClick={ctaReady ? onAdvance : undefined}
          className="bg-brand-primary text-white px-10 py-4 rounded-xl font-medium text-base hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
        >
          {item.cta}
        </button>
      </div>
    </div>
  )
}

// ── Main flow ─────────────────────────────────────────────────────────────────
export default function PointBFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setPointBAnswers, pointBClarity, setPointBClarity, journeyProgress, setJourneyProgress } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isReflection    = step >= TOTAL_STEPS
  const currentItem     = !isReflection ? ITEMS[step] : null
  const isSectionBreak  = currentItem?.type === 'section-break'
  const progress        = isReflection ? 100 : (step / TOTAL_STEPS) * 100
  const activeSection   = isReflection ? SECTIONS.length : getActiveSection(step)
  const questionProgress = !isReflection ? getQuestionProgress(step) : null

  function animateAndRun(fn) {
    setVisible(false)
    setTimeout(() => {
      fn()
      setVisible(true)
    }, 180)
  }

  async function fetchReflection() {
    setReflectionLoading(true)
    setReflectionError(null)
    try {
      const text = await generatePointBReflection(latestAnswers.current)
      setReflection(text)
    } catch {
      setReflectionError('Something went wrong. Please try again.')
    } finally {
      setReflectionLoading(false)
    }
  }

  function advance() {
    animateAndRun(() => {
      const nextStep = step + 1
      setStep(nextStep)
      if (nextStep >= TOTAL_STEPS) {
        const clarity = calcPointBClarity(latestAnswers.current)
        console.log('[PointB] advance — clarity calculated:', clarity)
        console.log('[PointB] advance — answers used:', latestAnswers.current)
        setPointBAnswers(latestAnswers.current)
        setPointBClarity(clarity)
        // Save answers to stage_answers — point_b_clarity goes to profiles via syncProfile in handleContinue
        if (user?.id) syncStageAnswers(user.id, 4, latestAnswers.current)
        fetchReflection()
      }
    })
  }

  function goBack() {
    if (step === 0) {
      navigate('/dashboard')
    } else {
      animateAndRun(() => setStep((s) => s - 1))
    }
  }

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleContinue() {
    const nextStage    = Math.max(profile.currentStage ?? 0, 5)
    const nextProgress = Math.max(journeyProgress ?? 0, 67)
    const updatedProfile = { ...profile, currentStage: nextStage }
    setProfile(updatedProfile)
    setJourneyProgress(nextProgress)
    console.log('[PointB] handleContinue — pointBClarity being synced:', pointBClarity)
    // Include pointBClarity so it persists to profiles.point_b_clarity in Supabase
    if (user?.id) syncProfile(user.id, { ...updatedProfile, journeyProgress: nextProgress, pointBClarity })
    navigate('/dashboard')
  }

  return (
    <div className="relative z-10 min-h-screen bg-transparent flex flex-col">

      {/* ── Top bar: logo + progress + section pills ── */}
      <header className="shrink-0 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto">

          {/* Row: back arrow | logo | step counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {!isReflection && (
                <button
                  onClick={goBack}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-muted hover:text-brand-text transition-colors duration-150 -ml-1"
                >
                  <ArrowLeft size={15} />
                  Back
                </button>
              )}
              <span className="font-heading font-bold text-brand-text tracking-tight">
                unmap
              </span>
            </div>
            {!isReflection && questionProgress && (
              <span className="text-xs text-brand-muted tabular-nums">
                {questionProgress.current} / {questionProgress.total}
              </span>
            )}
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Section pills */}
          {!isReflection && (
            <div className="flex items-center justify-center gap-2 mt-3">
              {SECTIONS.map((s, i) => (
                <div
                  key={s.label}
                  className={cn(
                    'px-3 py-1 rounded-full text-[11px] font-semibold transition-all duration-300',
                    i === activeSection
                      ? 'bg-brand-primary text-white'
                      : i < activeSection
                        ? 'bg-brand-primary/15 text-brand-primary'
                        : 'bg-brand-border text-brand-muted',
                  )}
                >
                  {s.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ── Card area ── */}
      <main className="flex-1 flex items-start justify-center px-6 pt-6 pb-10">
        <div className="w-full max-w-lg">

          <div
            style={{
              opacity:   visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
            }}
          >
            {isReflection ? (
              <PointBReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onContinue={handleContinue}
                uncensoredBuild={latestAnswers.current.uncensored_build}
                uncensoredTruth={latestAnswers.current.uncensored_truth}
              />
            ) : isSectionBreak ? (
              // key resets the fade-in timer each time we hit a new section break
              <SectionBreakCard key={step} item={currentItem} onAdvance={advance} />
            ) : (
              <QuestionCard
                question={currentItem}
                answer={answers[currentItem.id]}
                onChange={(value) => setAnswer(currentItem.id, value)}
                onNext={advance}
              />
            )}
          </div>


        </div>
      </main>
    </div>
  )
}
