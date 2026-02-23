import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PointBReflectionCard from './PointBReflectionCard'
import QuestionCard from '@/components/onboarding/QuestionCard'
import { useUserStore } from '@/store/userStore'
import { generatePointBReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

// 13 items total (3 section breaks + 10 questions). Reflection at step 13+.
// Step 0  : section break — 1 Year
// Steps 1–4 : 1-year questions
// Step 5  : section break — 3 Years
// Steps 6–9 : 3-year questions
// Step 10 : section break — Uncensored
// Steps 11–12 : uncensored questions

const ITEMS = [
  // ── 1 Year ──
  {
    type: 'section-break',
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
  // ── 3 Years ──
  {
    type: 'section-break',
    heading: 'Three years from now.',
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
    heading: 'Now, uncensored.',
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

export default function PointBFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setPointBAnswers, setPointBClarity } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isReflection = step >= TOTAL_STEPS
  const currentItem = !isReflection ? ITEMS[step] : null
  const isSectionBreak = currentItem?.type === 'section-break'
  const progress = isReflection ? 100 : (step / TOTAL_STEPS) * 100

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
        setPointBAnswers(latestAnswers.current)
        setPointBClarity(clarity)
        if (user?.id) syncStageAnswers(user.id, 4, latestAnswers.current, { point_b_clarity: clarity })
        fetchReflection()
      }
    })
  }

  function goBack() {
    animateAndRun(() => setStep((s) => s - 1))
  }

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleContinue() {
    const updatedProfile = { ...profile, currentStage: Math.max(profile.currentStage ?? 0, 5) }
    setProfile(updatedProfile)
    if (user?.id) syncProfile(user.id, updatedProfile)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* ── Top bar: logo + progress ── */}
      <header className="shrink-0 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <span className="font-heading font-bold text-brand-text tracking-tight">
              unmap
            </span>
            {!isReflection && !isSectionBreak && (
              <span className="text-xs text-brand-muted tabular-nums">
                {step} / {TOTAL_STEPS - 3}
              </span>
            )}
          </div>
          <div className="h-1 bg-brand-border rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── Card area ── */}
      <main className="flex-1 flex items-start justify-center px-6 pt-6 pb-10">
        <div className="w-full max-w-lg">

          <div
            style={{
              opacity: visible ? 1 : 0,
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
              <div className="bg-white rounded-2xl border border-brand-border shadow-sm p-8 space-y-5">
                <h2 className="font-heading font-bold text-2xl text-brand-text">
                  {currentItem.heading}
                </h2>
                <p className="text-brand-muted text-sm leading-relaxed">
                  {currentItem.body}
                </p>
                <button
                  onClick={advance}
                  className="w-full bg-brand-primary text-white py-3.5 rounded-xl font-medium hover:bg-brand-primary/90 transition-all duration-200"
                >
                  {currentItem.cta}
                </button>
              </div>
            ) : (
              <QuestionCard
                question={currentItem}
                answer={answers[currentItem.id]}
                onChange={(value) => setAnswer(currentItem.id, value)}
                onNext={advance}
              />
            )}
          </div>

          {/* Back button — step 1+ only, not on reflection or first section break */}
          {!isReflection && step > 0 && (
            <button
              onClick={goBack}
              className="mt-4 flex items-center gap-1.5 text-xs text-brand-muted hover:text-brand-text transition-colors duration-150 mx-auto"
            >
              <ArrowLeft size={13} />
              Back
            </button>
          )}

        </div>
      </main>
    </div>
  )
}
