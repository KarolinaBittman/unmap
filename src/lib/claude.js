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
