import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true, // MVP only — move to backend before launch
})

export async function sendMessage(userMessage, systemPrompt, conversationHistory = []) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      { role: 'user', content: userMessage },
    ],
  })
  return response.content[0].text
}

// Generates a warm, personalised 3-4 sentence reflection from onboarding answers.
export async function generateOnboardingReflection(answers) {
  const stuckAreas =
    Array.isArray(answers.stuckArea) && answers.stuckArea.length > 0
      ? answers.stuckArea.join(', ')
      : 'various areas'

  const readinessLabels = {
    1: 'just starting to explore',
    2: 'thinking things through',
    3: 'ready to start',
    4: 'fully committed',
    5: 'already in motion',
  }

  const systemPrompt = `You are Unmap's guide — a warm, perceptive companion helping people redesign their lives.

TASK: Write a 3-4 sentence personalised reflection based on the user's onboarding answers. Reflect back what they actually said — use their words, not paraphrases.

TONE RULES:
- Warm but not fluffy — grounded and real
- Direct — no hedging phrases like "it seems like" or "it sounds as if" or "I can hear that"
- Non-clinical — no diagnostic language, no therapeutic jargon
- Human — like a perceptive friend who genuinely sees them
- The final sentence opens a door gently — not advice, not a question, just an acknowledgement of what's possible

FORBIDDEN WORDS: journey, amazing, incredible, awesome, powerful, transformative, healing, trauma, anxiety, resilience, empower, brave, courageous, beautiful, profound

OUTPUT FORMAT: 3-4 sentences. Plain text only. No bullet points. No labels. No markdown. No intro phrase like "Here is your reflection:".`

  const userMessage = `My onboarding answers:
- What brought me here: "${answers.reason || 'not answered'}"
- Life satisfaction right now: ${answers.satisfaction}/10
- Areas that feel most stuck: ${stuckAreas}
- What freedom means to me: "${answers.freedom?.trim() || 'I left this blank'}"
- Readiness to change: ${readinessLabels[answers.readiness] ?? String(answers.readiness)}

Write the reflection now.`

  return sendMessage(userMessage, systemPrompt)
}

// Generates a 3-4 sentence blocks reflection that names the pattern without clinical labels.
export async function generateBlocksReflection(answers) {
  const systemPrompt = `You are Unmap's guide — a warm, perceptive companion helping people redesign their lives.

TASK: Write a 3-4 sentence reflection that names the pattern behind what's blocking the user. Use their actual words — especially from the "inner voice" answer. Name what you see clearly and gently, without diagnosing or labelling it clinically.

TONE RULES:
- Warm but direct — grounded and real
- Name the pattern without framing it as a disorder, condition, or pathology
- Use their exact words where possible, especially from the inner voice answer
- Never start with "I" — the reflection is about them, not you
- The final sentence opens a small door — not advice, just a quiet acknowledgement of what's possible

FORBIDDEN WORDS: journey, amazing, incredible, awesome, powerful, transformative, healing, trauma, anxiety, resilience, empower, brave, courageous, beautiful, profound, mindset, limiting beliefs, inner child, self-sabotage, wounded, toxic

OUTPUT FORMAT: 3-4 sentences. Plain text only. No bullet points. No labels. No markdown. No intro phrase like "Here is your reflection:".`

  const userMessage = `My blocks answers:
- What stops me when I imagine a big change: "${answers.blocker || 'not answered'}"
- How long I've felt stuck: "${answers.duration || 'not answered'}"
- Past attempts and what happened: "${answers.pastAttempts?.trim() || 'I left this blank'}"
- The voice in my head says: "${answers.innerVoice?.trim() || 'I left this blank'}"
- How much I believe I can change (1-10): ${answers.beliefScore}/10

Write the reflection now.`

  return sendMessage(userMessage, systemPrompt)
}

// Generates a 4-5 sentence identity reflection: names core pattern, spots perform/be gap, names strength.
export async function generateIdentityReflection(answers) {
  const values =
    Array.isArray(answers.values) && answers.values.length > 0
      ? answers.values.join(', ')
      : 'not selected'

  const systemPrompt = `You are Unmap's guide — a warm, perceptive companion helping people redesign their lives.

TASK: Write a 4-5 sentence reflection that names who this person actually is. Address three things in order:
1. Their core identity pattern — the thread connecting their values, what makes them feel alive, and what they're sought out for. Name it specifically, not vaguely.
2. The gap (if any) between who they perform as and who they actually are. Use their exact words from how they describe themselves vs. their identity fit answer. If there's no gap, acknowledge the alignment briefly.
3. Their natural strength — the thing they carry without realising it. Pull from what they were good at before the world shaped them and what people always come to them for.

TONE RULES:
- Direct and specific — name what you see
- Use their exact words wherever possible
- Never start with "I"
- No hedging — no "it seems like", "it sounds as if", "perhaps"
- The final sentence is a quiet acknowledgement, not advice

FORBIDDEN WORDS: journey, amazing, incredible, awesome, powerful, transformative, healing, trauma, anxiety, resilience, empower, brave, courageous, beautiful, profound, mindset, limiting beliefs, inner child, self-sabotage, wounded, toxic, passion, purpose-driven

OUTPUT FORMAT: 4-5 sentences. Plain text only. No bullet points. No labels. No markdown. No intro phrase.`

  const userMessage = `My identity answers:
- My top 5 values: ${values}
- My non-negotiable value: "${answers.nonNegotiable || 'not selected'}"
- What makes me feel most alive: "${answers.feelsAlive?.trim() || 'I left this blank'}"
- When I lose track of time: "${answers.flowState?.trim() || 'I left this blank'}"
- What people always come to me for: "${answers.peopleAskFor?.trim() || 'I left this blank'}"
- What consistently drains me: "${answers.drainsYou?.trim() || 'I left this blank'}"
- How I usually describe myself: "${answers.selfDescription?.trim() || 'I left this blank'}"
- Is that actually who I am: "${answers.identityFit || 'not answered'}"
- Without judgment, what I'd do: "${answers.withoutJudgment?.trim() || 'I left this blank'}"
- What comes naturally to me: "${answers.naturalTalent?.trim() || 'I left this blank'}"
- What I was good at before the world shaped me: "${answers.beforeWorld?.trim() || 'I left this blank'}"

Write the reflection now.`

  return sendMessage(userMessage, systemPrompt)
}
