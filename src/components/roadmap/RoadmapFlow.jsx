import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import CurrencyAmountCard from './CurrencyAmountCard'
import RoadmapReflectionCard from './RoadmapReflectionCard'
import QuestionCard from '@/components/onboarding/QuestionCard'
import { useUserStore } from '@/store/userStore'
import { generateRoadmapReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

// Step 0         : section break — Career Vehicle
// Steps 1–4      : career questions
// Step 5         : section break — Financial Runway
// Steps 6–8      : money questions (currency, pills, currency)
// Step 9         : section break — First Move
// Steps 10–11    : first move questions
// Step 12+       : reflection

const ITEMS = [
  // ── Career Vehicle ──
  {
    type: 'section-break',
    heading: 'Career Vehicle.',
    body: "Before you can build the path, you need to know what kind of work actually fits your life. What you have, what you want, and what the gap is.",
    cta: "Let's look →",
  },
  {
    id: 'currentWork',
    label: 'Stage 5 · Career · 1 of 4',
    question: 'What are you currently doing for money?',
    subtitle: 'Job title, freelance work, business — whatever pays right now.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'designedWork',
    label: 'Stage 5 · Career · 2 of 4',
    question: 'If you could design your work from scratch, what would it look like?',
    subtitle: 'Not a job title — the actual shape of the work. What you do, how you do it, who for.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'remoteSkills',
    label: 'Stage 5 · Career · 3 of 4',
    question: 'What skills do you already have that could earn remotely or independently?',
    subtitle: 'Things people would pay for. Skills you already have — not ones you plan to learn.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'workGap',
    label: 'Stage 5 · Career · 4 of 4',
    question: "What's the gap between where you are and that?",
    subtitle: 'Be specific — what exactly is missing or different?',
    type: 'text',
    placeholder: 'Write freely…',
  },
  // ── Financial Runway ──
  {
    type: 'section-break',
    heading: 'Financial Runway.',
    body: "Freedom isn't free — but it's probably closer than you think. Let's look at the actual numbers.",
    cta: 'Show me the numbers →',
  },
  {
    id: 'monthlyExpenses',
    label: 'Stage 5 · Money · 1 of 3',
    question: 'What are your monthly expenses?',
    subtitle: 'Total outgoings — rent, food, bills, everything.',
    type: 'currency',
  },
  {
    id: 'savingsRunway',
    label: 'Stage 5 · Money · 2 of 3',
    question: 'How many months of savings do you have right now?',
    type: 'pills',
    options: ['0 months', '1–3 months', '3–6 months', '6–12 months', '12+ months'],
  },
  {
    id: 'freedomIncome',
    label: 'Stage 5 · Money · 3 of 3',
    question: 'What monthly income would feel like freedom?',
    subtitle: 'Not survival — the number where you feel genuinely free.',
    type: 'currency',
  },
  // ── First Move ──
  {
    type: 'section-break',
    heading: 'The first move.',
    body: "The gap closes one step at a time. Let's find yours.",
    cta: 'Find my step →',
  },
  {
    id: 'firstStep',
    label: 'Stage 5 · First Move · 1 of 2',
    question: "What's the smallest possible step you could take this week toward your Point B?",
    subtitle: 'Not the whole plan. Just the one thing that would make this real.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'firstMoveBlocker',
    label: 'Stage 5 · First Move · 2 of 2',
    question: "What's been stopping you from taking it?",
    subtitle: 'The real reason, not the polished one.',
    type: 'text',
    placeholder: 'Write freely…',
  },
]

const TOTAL_STEPS = ITEMS.length // 12

// Map step index → question number (1-based, skipping section breaks)
const QUESTION_NUMBER = {}
let _qn = 0
ITEMS.forEach((item, i) => {
  if (item.type !== 'section-break') QUESTION_NUMBER[i] = ++_qn
})
const TOTAL_QUESTIONS = _qn // 9

const ANSWER_FIELDS = [
  'currentWork', 'designedWork', 'remoteSkills', 'workGap',
  'monthlyExpenses', 'savingsRunway', 'freedomIncome',
  'firstStep', 'firstMoveBlocker',
]

const INITIAL_ANSWERS = {
  ...Object.fromEntries(ANSWER_FIELDS.map((f) => [f, ''])),
  currency: 'EUR',
}

export default function RoadmapFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setRoadmapAnswers, journeyProgress, setJourneyProgress } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isReflection = step >= TOTAL_STEPS
  const currentItem = !isReflection ? ITEMS[step] : null
  const isSectionBreak = currentItem?.type === 'section-break'
  const isCurrency = currentItem?.type === 'currency'
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
      const text = await generateRoadmapReflection(latestAnswers.current)
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
        setRoadmapAnswers(latestAnswers.current)
        if (user?.id) syncStageAnswers(user.id, 5, latestAnswers.current)
        fetchReflection()
      }
    })
  }

  function goBack() {
    if (step === 0) {
      navigate('/')
    } else {
      animateAndRun(() => setStep((s) => s - 1))
    }
  }

  function setAnswer(id, value) {
    setAnswers((prev) => ({ ...prev, [id]: value }))
  }

  function handleContinue() {
    const nextStage = Math.max(profile.currentStage ?? 0, 6)
    const nextProgress = Math.max(journeyProgress ?? 0, 83)
    const updatedProfile = { ...profile, currentStage: nextStage }
    setProfile(updatedProfile)
    setJourneyProgress(nextProgress)
    if (user?.id) syncProfile(user.id, { ...updatedProfile, journeyProgress: nextProgress })
    navigate('/')
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
              <RoadmapReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onContinue={handleContinue}
                firstStep={latestAnswers.current.firstStep}
                firstMoveBlocker={latestAnswers.current.firstMoveBlocker}
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
