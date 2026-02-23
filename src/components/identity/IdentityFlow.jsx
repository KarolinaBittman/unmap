import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import ValuesPicker from './ValuesPicker'
import SingleChoiceCard from './SingleChoiceCard'
import IdentityReflectionCard from './IdentityReflectionCard'
import QuestionCard from '@/components/onboarding/QuestionCard'
import { useUserStore } from '@/store/userStore'
import { generateIdentityReflection } from '@/lib/claude'
import { syncStageAnswers, syncProfile } from '@/lib/db'

// Step 0           = ValuesPicker (pick top 5)
// Steps 1–10       = QUESTIONS[step - 1]
//   Step 1         = nonNegotiable  (single-choice, options from chosen values)
//   Steps 2–5      = Energy (4 × text)
//   Steps 6–8      = Identity Ceiling (text, single-choice, text)
//   Steps 9–10     = Strengths Pattern (2 × text)
// Step 11+         = Reflection

const IDENTITY_FIT_OPTIONS = [
  "That's genuinely me",
  "It's partly me",
  "It's mostly a role I play",
]

const QUESTIONS = [
  // ── Values follow-up ──
  {
    id: 'nonNegotiable',
    label: 'Stage 3 · Values',
    question: "Which of these is the one you'd never compromise on?",
    subtitle: 'The value that, if violated, would feel like a betrayal of yourself.',
    type: 'single-choice',
    // options injected dynamically from answers.values
  },
  // ── Energy ──
  {
    id: 'feelsAlive',
    label: 'Stage 3 · Energy · 1 of 4',
    question: 'What makes you feel most alive?',
    subtitle: 'Activities, moments, environments — when you feel lit up from the inside.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'flowState',
    label: 'Stage 3 · Energy · 2 of 4',
    question: 'When do you lose track of time?',
    subtitle: 'The kind of work or activity where hours disappear without you noticing.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'peopleAskFor',
    label: 'Stage 3 · Energy · 3 of 4',
    question: 'What do people always come to you for?',
    subtitle: 'The thing friends, colleagues, or family ask your help with — again and again.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'drainsYou',
    label: 'Stage 3 · Energy · 4 of 4',
    question: "What consistently drains you — even when you're good at it?",
    subtitle: 'Tasks or situations that leave you feeling flat, even if you perform them well.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  // ── Identity Ceiling ──
  {
    id: 'selfDescription',
    label: 'Stage 3 · Identity · 1 of 3',
    question: 'How do you usually describe yourself?',
    subtitle: 'Job title, role, the labels you reach for when introducing yourself.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'identityFit',
    label: 'Stage 3 · Identity · 2 of 3',
    question: "Is that actually who you are — or who you've learned to be?",
    subtitle: 'Be honest. No answer is wrong.',
    type: 'single-choice',
    options: IDENTITY_FIT_OPTIONS,
  },
  {
    id: 'withoutJudgment',
    label: 'Stage 3 · Identity · 3 of 3',
    question: 'If no one was watching and nothing was at stake, what would you do?',
    subtitle: 'No judgment, no practicality required.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  // ── Strengths Pattern ──
  {
    id: 'naturalTalent',
    label: 'Stage 3 · Strengths · 1 of 2',
    question: 'What comes so naturally to you that you assume everyone can do it?',
    subtitle: 'The thing that feels obvious to you but genuinely impresses others.',
    type: 'text',
    placeholder: 'Write freely…',
  },
  {
    id: 'beforeWorld',
    label: 'Stage 3 · Strengths · 2 of 2',
    question: 'What were you good at before the world told you what to be good at?',
    subtitle: 'Think back — childhood, early teens, before school or work shaped your path.',
    type: 'text',
    placeholder: 'Write freely…',
  },
]

const TOTAL_STEPS = 1 + QUESTIONS.length // ValuesPicker + 10 questions = 11

const INITIAL_ANSWERS = {
  values: [],
  nonNegotiable: '',
  feelsAlive: '',
  flowState: '',
  peopleAskFor: '',
  drainsYou: '',
  selfDescription: '',
  identityFit: '',
  withoutJudgment: '',
  naturalTalent: '',
  beforeWorld: '',
}

export default function IdentityFlow() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState(INITIAL_ANSWERS)
  const [visible, setVisible] = useState(true)
  const [reflection, setReflection] = useState(null)
  const [reflectionLoading, setReflectionLoading] = useState(false)
  const [reflectionError, setReflectionError] = useState(null)

  const navigate = useNavigate()
  const { user, profile, setProfile, setIdentityAnswers } = useUserStore()

  // Ref always holds the latest answers — avoids stale closures in async callbacks
  const latestAnswers = useRef(answers)
  latestAnswers.current = answers

  const isValues = step === 0
  const isReflection = step >= TOTAL_STEPS
  const currentQ = !isValues && !isReflection ? QUESTIONS[step - 1] : null
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
      const text = await generateIdentityReflection(latestAnswers.current)
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
        setIdentityAnswers(latestAnswers.current)
        if (user?.id) syncStageAnswers(user.id, 3, latestAnswers.current)
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
    const updatedProfile = { ...profile, currentStage: Math.max(profile.currentStage ?? 0, 4) }
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
                {step + 1} / {TOTAL_STEPS}
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
              <IdentityReflectionCard
                reflection={reflection}
                loading={reflectionLoading}
                error={reflectionError}
                onRetry={fetchReflection}
                onContinue={handleContinue}
                values={latestAnswers.current.values}
                nonNegotiable={latestAnswers.current.nonNegotiable}
              />
            ) : isValues ? (
              <ValuesPicker
                selected={answers.values}
                onChange={(v) => setAnswer('values', v)}
                onNext={advance}
              />
            ) : currentQ.type === 'single-choice' ? (
              <SingleChoiceCard
                question={currentQ}
                options={currentQ.id === 'nonNegotiable' ? answers.values : currentQ.options}
                selected={answers[currentQ.id]}
                onChange={(v) => setAnswer(currentQ.id, v)}
                onNext={advance}
              />
            ) : (
              <QuestionCard
                question={currentQ}
                answer={answers[currentQ.id]}
                onChange={(value) => setAnswer(currentQ.id, value)}
                onNext={advance}
              />
            )}
          </div>

          {/* Back button — step 1+ only, not on reflection */}
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
