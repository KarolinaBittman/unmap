import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import QuestionCard from './QuestionCard'
import ReflectionCard from './ReflectionCard'
import { useUserStore } from '@/store/userStore'
import { generateOnboardingReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

const QUESTIONS = [
  {
    id: 'reason',
    step: 1,
    question: 'What brought you here today?',
    type: 'pills',
    options: ['A big life change', 'Feeling stuck', 'Wanting more', 'Starting fresh'],
  },
  {
    id: 'satisfaction',
    step: 2,
    question: 'How satisfied are you with your life right now?',
    subtitle: 'Be honest — this is just for you.',
    type: 'slider',
    min: 1,
    max: 10,
  },
  {
    id: 'stuckArea',
    step: 3,
    question: 'Which area feels most stuck?',
    subtitle: 'Select all that apply.',
    type: 'multi-pills',
    options: ['Career', 'Relationships', 'Money', 'Health', 'Purpose', 'Freedom'],
  },
  {
    id: 'freedom',
    step: 4,
    question: 'What does freedom mean to you?',
    subtitle: "There's no wrong answer.",
    type: 'text',
    placeholder: 'Write freely — even a sentence is enough…',
  },
  {
    id: 'readiness',
    step: 5,
    question: 'How ready are you to make real changes?',
    type: 'scale',
    options: [
      { value: 1, label: 'Just exploring' },
      { value: 2, label: 'Thinking about it' },
      { value: 3, label: 'Ready to start' },
      { value: 4, label: 'Fully committed' },
      { value: 5, label: 'Already moving' },
    ],
  },
]

const INITIAL_ANSWERS = {
  reason: '',
  satisfaction: 5,
  stuckArea: [],
  freedom: '',
  readiness: 0,
}

export default function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setOnboardingAnswers } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures inside
  // setTimeout-chained callbacks (animateAndRun + QuestionCard's auto-advance).
  // Assigned directly on every render (no useEffect needed).
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isReflection = step >= QUESTIONS.length
  const currentQuestion = QUESTIONS[step]
  const progress = isReflection ? 100 : (step / QUESTIONS.length) * 100

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
      // latestAnswers.current is always up-to-date by this point
      const text = await generateOnboardingReflection(latestAnswers.current)
      setReflection(text)
    } catch (err) {
      setReflectionError('Something went wrong. Please try again.')
    } finally {
      setReflectionLoading(false)
    }
  }

  function advance() {
    animateAndRun(() => {
      const nextStep = step + 1
      setStep(nextStep)
      // Kick off Claude call as soon as we enter the reflection screen
      if (nextStep >= QUESTIONS.length) {
        setOnboardingAnswers(latestAnswers.current)
        if (user?.id) syncStageAnswers(user.id, 1, latestAnswers.current)
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

  function handleBegin() {
    const updatedProfile = { ...profile, onboardingComplete: true }
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
            {!isReflection && (
              <span className="text-xs text-brand-muted tabular-nums">
                {step + 1} / {QUESTIONS.length}
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

          {/* Fade + lift animation between steps */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
            }}
          >
            {isReflection ? (
              <ReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onBegin={handleBegin}
              />
            ) : (
              <QuestionCard
                question={currentQuestion}
                answer={answers[currentQuestion.id]}
                onChange={(value) => setAnswer(currentQuestion.id, value)}
                onNext={advance}
              />
            )}
          </div>

          {/* Back button — below card, Q2+ only */}
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
