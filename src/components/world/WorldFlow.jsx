import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CurrencyAmountCard from '@/components/roadmap/CurrencyAmountCard'
import RankCard from './RankCard'
import WorldReflectionCard from './WorldReflectionCard'
import QuestionCard from '@/components/onboarding/QuestionCard'
import { useUserStore } from '@/store/userStore'
import { generateWorldReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

// Step 0        : section break — Lifestyle Needs
// Steps 1–3     : lifestyle questions (climate, environment, pace)
// Step 4        : section break — Practical Requirements
// Steps 5–8     : practical questions (budget, euTravel, languages, countriesList)
// Step 9        : section break — Freedom Priorities
// Step 10       : rank question (priorities)
// Step 11+      : reflection

const ITEMS = [
  // ── Lifestyle Needs ──
  {
    type: 'section-break',
    heading: 'Lifestyle Needs.',
    body: "The right place fits your actual life — not an Instagram fantasy. Let's figure out what kind of environment you actually thrive in.",
    cta: "Let's look →",
  },
  {
    id: 'climate',
    label: 'Stage 6 · Lifestyle · 1 of 3',
    question: 'What climate do you prefer?',
    type: 'pills',
    options: ['Warm / Mediterranean', 'Four seasons', 'Tropical', 'Cold / Nordic', "Don't care"],
  },
  {
    id: 'environment',
    label: 'Stage 6 · Lifestyle · 2 of 3',
    question: 'What environment feels most like home?',
    type: 'pills',
    options: ['Big city', 'Mid-size city', 'Small town', 'Nature / rural', 'Beach', 'Mountains'],
  },
  {
    id: 'pace',
    label: 'Stage 6 · Lifestyle · 3 of 3',
    question: "What's your ideal pace of life?",
    type: 'pills',
    options: ['Fast and stimulating', 'Balanced', 'Slow and peaceful'],
  },
  // ── Practical Requirements ──
  {
    type: 'section-break',
    heading: 'Practical Requirements.',
    body: "Freedom has a budget. Let's look at the real constraints so we can find places that actually work.",
    cta: 'Show me the numbers →',
  },
  {
    id: 'monthlyBudget',
    label: 'Stage 6 · Practical · 1 of 4',
    question: "What's your monthly budget for living?",
    subtitle: 'All in — rent, food, lifestyle.',
    type: 'currency',
  },
  {
    id: 'euTravel',
    label: 'Stage 6 · Practical · 2 of 4',
    question: 'Do you need visa-free EU travel?',
    type: 'pills',
    options: ['Yes', 'No'],
  },
  {
    id: 'languages',
    label: 'Stage 6 · Practical · 3 of 4',
    question: 'What languages do you speak?',
    subtitle: 'Include any level — basic counts.',
    type: 'text',
    placeholder: 'English, Spanish, French…',
  },
  {
    id: 'countriesList',
    label: 'Stage 6 · Practical · 4 of 4',
    question: 'Any countries already on your list?',
    subtitle: "Leave blank if you're fully open.",
    type: 'text',
    placeholder: 'Portugal, Thailand, Georgia…',
    optional: true,
  },
  // ── Freedom Priorities ──
  {
    type: 'section-break',
    heading: 'Freedom Priorities.',
    body: "Different places do different things well. What you care about most shapes where you should go.",
    cta: 'Set my priorities →',
  },
  {
    id: 'priorities',
    label: 'Stage 6 · Priorities · 1 of 1',
    question: 'What matters most to you in a place to live?',
    subtitle: 'Tap in order of importance — most important first.',
    type: 'rank',
    options: ['Cost of living', 'Safety', 'Community', 'Nature', 'Culture', 'Nightlife', 'Healthcare', 'Internet speed'],
  },
]

const TOTAL_STEPS = ITEMS.length // 11

// Map step index → question number (1-based, skipping section breaks)
const QUESTION_NUMBER = {}
let _qn = 0
ITEMS.forEach((item, i) => {
  if (item.type !== 'section-break') QUESTION_NUMBER[i] = ++_qn
})
const TOTAL_QUESTIONS = _qn // 8

const INITIAL_ANSWERS = {
  climate: '',
  environment: '',
  pace: '',
  monthlyBudget: '',
  euTravel: '',
  languages: '',
  countriesList: '',
  priorities: [],
  currency: 'EUR',
}

export default function WorldFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setWorldAnswers, journeyProgress, setJourneyProgress } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isReflection = step >= TOTAL_STEPS
  const currentItem = !isReflection ? ITEMS[step] : null
  const isSectionBreak = currentItem?.type === 'section-break'
  const isCurrency = currentItem?.type === 'currency'
  const isRank = currentItem?.type === 'rank'
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
      const text = await generateWorldReflection(latestAnswers.current)
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
        setWorldAnswers(latestAnswers.current)
        if (user?.id) syncStageAnswers(user.id, 6, latestAnswers.current)
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
    const nextStage = Math.max(profile.currentStage ?? 0, 7)
    const nextProgress = Math.max(journeyProgress ?? 0, 100)
    const updatedProfile = { ...profile, currentStage: nextStage }
    setProfile(updatedProfile)
    setJourneyProgress(nextProgress)
    if (user?.id) syncProfile(user.id, { ...updatedProfile, journeyProgress: nextProgress })
    navigate('/dashboard')
  }

  return (
    <div className="relative z-10 min-h-screen bg-transparent flex flex-col">

      {/* ── Top bar: logo + progress ── */}
      <header className="shrink-0 px-6 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
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
            {!isReflection && !isSectionBreak && (
              <span className="text-xs text-brand-muted tabular-nums">
                {QUESTION_NUMBER[step]} / {TOTAL_QUESTIONS}
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
              <WorldReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onContinue={handleContinue}
                topPriorities={latestAnswers.current.priorities}
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
            ) : isCurrency ? (
              <CurrencyAmountCard
                question={currentItem}
                amount={answers[currentItem.id]}
                currency={answers.currency}
                onAmountChange={(val) => setAnswer(currentItem.id, val)}
                onCurrencyChange={(c) => setAnswer('currency', c)}
                onNext={advance}
              />
            ) : isRank ? (
              <RankCard
                question={currentItem}
                ranked={answers.priorities}
                onRankChange={(val) => setAnswer('priorities', val)}
                onNext={advance}
              />
            ) : (
              <QuestionCard
                question={currentItem}
                answer={answers[currentItem.id]}
                onChange={(value) => setAnswer(currentItem.id, value)}
                onNext={advance}
              />
            )}
          </div>

          {/* Skip link for optional questions */}
          {!isReflection && currentItem?.optional && (
            <button
              onClick={advance}
              className="mt-2 block mx-auto text-xs text-brand-muted hover:text-brand-text transition-colors duration-150"
            >
              Skip →
            </button>
          )}


        </div>
      </main>
    </div>
  )
}
