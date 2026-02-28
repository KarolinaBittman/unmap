import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import QuestionCard from '@/components/onboarding/QuestionCard'
import BlocksReflectionCard from './BlocksReflectionCard'
import { useUserStore } from '@/store/userStore'
import { generateBlocksReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

const QUESTIONS = [
  {
    id: 'blocker',
    step: 1,
    label: 'Stage 2 · Question 1 of 5',
    question: "When you imagine making a big change, what's the first thing that stops you?",
    type: 'pills',
    options: [
      'Fear of failure',
      'Not enough money',
      "Don't know where to start",
      'What will people think',
      "I'm not ready yet",
      'Other',
    ],
  },
  {
    id: 'duration',
    step: 2,
    label: 'Stage 2 · Question 2 of 5',
    question: 'How long have you felt stuck in this area?',
    type: 'pills',
    options: ['A few months', 'About a year', 'A few years', 'Most of my life'],
  },
  {
    id: 'pastAttempts',
    step: 3,
    label: 'Stage 2 · Question 3 of 5',
    question: 'Have you tried to change this before? What happened?',
    subtitle: 'Be as specific as you like — or as brief.',
    type: 'text',
    placeholder: 'Write freely — even a sentence is enough…',
  },
  {
    id: 'innerVoice',
    step: 4,
    label: 'Stage 2 · Question 4 of 5',
    question: 'What does the voice in your head say when you think about going for what you want?',
    subtitle: 'Write the actual words — exactly as they sound.',
    type: 'text',
    placeholder: 'The voice says…',
  },
  {
    id: 'beliefScore',
    step: 5,
    label: 'Stage 2 · Question 5 of 5',
    question: 'How much do you actually believe you can change?',
    subtitle: "Be honest. There's no wrong answer.",
    type: 'slider',
    min: 1,
    max: 10,
    minLabel: 'Not really',
    maxLabel: 'Fully believe',
  },
]

const INITIAL_ANSWERS = {
  blocker: '',
  duration: '',
  pastAttempts: '',
  innerVoice: '',
  beliefScore: 5,
}

export default function BlocksDiagnostic() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, setBlocksAnswers, profile, setProfile, journeyProgress, setJourneyProgress } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
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
      const text = await generateBlocksReflection(latestAnswers.current)
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
      if (nextStep >= QUESTIONS.length) {
        setBlocksAnswers(latestAnswers.current)
        if (user?.id) syncStageAnswers(user.id, 2, latestAnswers.current)
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
    const nextStage = Math.max(profile.currentStage ?? 0, 3)
    const nextProgress = Math.max(journeyProgress ?? 0, 33)
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

          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 180ms ease, transform 180ms ease',
            }}
          >
            {isReflection ? (
              <BlocksReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onContinue={handleContinue}
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


        </div>
      </main>
    </div>
  )
}
