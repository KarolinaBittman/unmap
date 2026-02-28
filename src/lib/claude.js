import Anthropic from '@anthropic-ai/sdk'
import { useUserStore } from '@/store/userStore'
import { buildSystemPrompt } from './prompts'
import { insertReflection } from './db'

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

// ─── Stage 1 ──────────────────────────────────────────────────────────────────

export async function generateOnboardingReflection(answers) {
  const store = useUserStore.getState()

  // At onboarding time the wheel hasn't been scored yet — strip wheel scores
  // so the prompt doesn't hallucinate tension between satisfaction score and
  // wheel numbers that came from mock/persisted data, not this user's input.
  const BLANK_WHEEL = { career: 0, health: 0, relationships: 0, money: 0, growth: 0, fun: 0, environment: 0, purpose: 0 }
  const storeForPrompt = { ...store, wheelScores: BLANK_WHEEL }

  const readinessLabels = {
    1: 'just starting to explore',
    2: 'thinking things through',
    3: 'ready to start',
    4: 'fully committed',
    5: 'already in motion',
  }

  const stuckAreas =
    Array.isArray(answers.stuckArea) && answers.stuckArea.length > 0
      ? answers.stuckArea.join(', ')
      : 'various areas'

  const systemPrompt = `${buildSystemPrompt(storeForPrompt, 1)}

TASK: Write a 3-4 sentence personalised reflection based on the user's Stage 1 answers. Reflect back what they actually said — use their words, not paraphrases. Note any tension between their life satisfaction score and their Wheel of Life scores if both are available. The final sentence opens a door gently — not advice, not a question, just an acknowledgement of what's possible.

OUTPUT FORMAT: 3-4 sentences of reflection. Plain text only. No bullet points. No labels. No markdown. No intro phrase like "Here is your reflection:".
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 psychological or philosophical frameworks you actually drew on, comma-separated, no period]`

  const userMessage = `My Stage 1 answers:
- What brought me here: "${answers.reason || 'not answered'}"
- Life satisfaction right now: ${answers.satisfaction}/10
- Areas that feel most stuck: ${stuckAreas}
- What freedom means to me: "${answers.freedom?.trim() || 'I left this blank'}"
- Readiness to change: ${readinessLabels[answers.readiness] ?? String(answers.readiness)}

Write the reflection now.`

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 0, text)
  return text
}

// ─── Stage 2 ──────────────────────────────────────────────────────────────────

export async function generateBlocksReflection(answers) {
  const store = useUserStore.getState()

  const systemPrompt = `${buildSystemPrompt(store, 2)}

TASK: Write a 3-4 sentence reflection that names the pattern behind what's blocking this user. Use their actual words — especially from the "inner voice" answer. Draw on what you know about their full profile (if earlier stages are complete) to name the thread connecting their blocks to their larger story. Name what you see clearly and gently, without diagnosing or labelling it clinically.

OUTPUT FORMAT: 3-4 sentences of reflection. Plain text only. No bullet points. No labels. No markdown. No intro phrase.
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 psychological or philosophical frameworks you actually drew on, comma-separated, no period]`

  const userMessage = `My Stage 2 answers:
- What stops me when I imagine a big change: "${answers.blocker || 'not answered'}"
- How long I've felt stuck: "${answers.duration || 'not answered'}"
- Past attempts and what happened: "${answers.pastAttempts?.trim() || 'I left this blank'}"
- The voice in my head says: "${answers.innerVoice?.trim() || 'I left this blank'}"
- How much I believe I can change (1-10): ${answers.beliefScore}/10

Write the reflection now.`

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 2, text)
  return text
}

// ─── Stage 3 ──────────────────────────────────────────────────────────────────

export async function generateIdentityReflection(answers) {
  const store = useUserStore.getState()

  const values =
    Array.isArray(answers.values) && answers.values.length > 0
      ? answers.values.join(', ')
      : 'not selected'

  const systemPrompt = `${buildSystemPrompt(store, 3)}

TASK: Write a 4-5 sentence reflection that names who this person actually is. Address three things in order:
1. Their core identity pattern — the thread connecting their values, what makes them feel alive, and what they're sought out for. Name it specifically, not vaguely.
2. The gap (if any) between who they perform as and who they actually are. Use their exact words. If there's no gap, acknowledge the alignment briefly.
3. Their natural strength — the thing they carry without realising it. Pull from what they were good at before the world shaped them and what people always come to them for.

Cross-reference with earlier stage answers where relevant — blocks and identity are often deeply connected.

OUTPUT FORMAT: 4-5 sentences of reflection. Plain text only. No bullet points. No labels. No markdown. No intro phrase.
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 psychological or philosophical frameworks you actually drew on, comma-separated, no period]`

  const userMessage = `My Stage 3 answers:
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

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 3, text)
  return text
}

// ─── Stage 4 ──────────────────────────────────────────────────────────────────

export async function generatePointBReflection(answers) {
  const store = useUserStore.getState()

  const systemPrompt = `${buildSystemPrompt(store, 4)}

TASK: Write a 4-5 sentence Point B reflection that does three things in order:
1. Name their vision concretely — use their exact words from the uncensored section. This is the real thing they want, not the edited version. State it plainly.
2. Spot the gap between their 1-year and 3-year answers — where did they get bolder? What changed between the two? Name the specific shift.
3. Call out the uncensored section as what they're actually after — the version underneath all the practicality. Make it clear that the uncensored one is the signal.

If earlier stages reveal relevant identity or blocks context, let that inform the reflection without making it the focus.

OUTPUT FORMAT: 4-5 sentences of reflection. Plain text only. No bullet points. No labels. No markdown. No intro phrase.
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 psychological or philosophical frameworks you actually drew on, comma-separated, no period]`

  const userMessage = `My Stage 4 answers:

ONE YEAR FROM NOW:
- Where I'm living: "${answers.year1_living?.trim() || 'I left this blank'}"
- What a typical Tuesday looks like: "${answers.year1_tuesday?.trim() || 'I left this blank'}"
- What I'm working on: "${answers.year1_working?.trim() || 'I left this blank'}"
- How I feel when I wake up: "${answers.year1_feeling?.trim() || 'I left this blank'}"

THREE YEARS FROM NOW:
- Where I'm living: "${answers.year3_living?.trim() || 'I left this blank'}"
- What a typical Tuesday looks like: "${answers.year3_tuesday?.trim() || 'I left this blank'}"
- What I'm working on: "${answers.year3_working?.trim() || 'I left this blank'}"
- How I feel when I wake up: "${answers.year3_feeling?.trim() || 'I left this blank'}"

UNCENSORED:
- If I knew I couldn't fail, I'd build or become: "${answers.uncensored_build?.trim() || 'I left this blank'}"
- The life I want but haven't said out loud: "${answers.uncensored_truth?.trim() || 'I left this blank'}"

Write the reflection now.`

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 4, text)
  return text
}

// ─── Stage 5 ──────────────────────────────────────────────────────────────────

export async function generateRoadmapReflection(answers) {
  const store = useUserStore.getState()

  const systemPrompt = `${buildSystemPrompt(store, 5)}

TASK: Write a 4-5 sentence reflection that does three things in order:
1. Name their career vehicle — the specific bridge between what they're doing now and what they want to do. Use their exact words. Name the type of work, not a vague label. Draw on their identity (Stage 3) and Point B vision (Stage 4) where relevant.
2. Name the financial gap concretely — use their actual numbers and currency. Compare monthly expenses to freedom income. Factor in savings runway to say something real about their window for action.
3. Name their first move and cut through what's actually blocking it — use their exact words from both the step and the blocker. Say what you see beneath the surface reason, informed by what you know about their blocks (Stage 2).

OUTPUT FORMAT: 4-5 sentences of reflection. Plain text only. No bullet points. No labels. No markdown. No intro phrase.
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 psychological or philosophical frameworks you actually drew on, comma-separated, no period]`

  const userMessage = `My Stage 5 answers:

CAREER VEHICLE:
- What I currently do for money: "${answers.currentWork?.trim() || 'I left this blank'}"
- What I'd design if I could start from scratch: "${answers.designedWork?.trim() || 'I left this blank'}"
- Skills I already have that could earn remotely or independently: "${answers.remoteSkills?.trim() || 'I left this blank'}"
- The gap between where I am and that: "${answers.workGap?.trim() || 'I left this blank'}"

FINANCIAL RUNWAY:
- My monthly expenses: ${answers.monthlyExpenses || '0'} ${answers.currency || 'EUR'}
- Months of savings I have right now: "${answers.savingsRunway || 'not answered'}"
- Monthly income that would feel like freedom: ${answers.freedomIncome || '0'} ${answers.currency || 'EUR'}

FIRST MOVE:
- The smallest step I could take this week: "${answers.firstStep?.trim() || 'I left this blank'}"
- What's been stopping me: "${answers.firstMoveBlocker?.trim() || 'I left this blank'}"

Write the reflection now.`

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 5, text)
  return text
}

// ─── Stage 6 ──────────────────────────────────────────────────────────────────

export async function generateWorldReflection(answers) {
  const store = useUserStore.getState()

  const prioritiesList =
    Array.isArray(answers.priorities) && answers.priorities.length > 0
      ? answers.priorities.map((p, i) => `${i + 1}. ${p}`).join('\n')
      : 'not ranked'

  const systemPrompt = `${buildSystemPrompt(store, 6)}

TASK: Suggest 3 specific cities or regions that genuinely match this person's lifestyle needs, budget, and freedom priorities. Be specific — name real places with real reasons that reference their actual answers. Draw on their full profile (identity, Point B vision, career vehicle) where relevant — the right place supports the whole life they're building, not just a budget.

FORMAT (use exactly this structure, plain text):
1. [City, Country]
[2-3 sentences about why it fits them specifically. Use their actual numbers, priorities, and words.]

2. [City, Country]
[2-3 sentences about why it fits them specifically.]

3. [City, Country]
[2-3 sentences about why it fits them specifically.]

[One closing sentence about what their answers collectively point to — not advice, just an observation.]

OUTPUT FORMAT: Plain text only. No markdown headers. No asterisks. No bullet points beyond the numbered list above. No intro phrase.
Then on the very last line, with no blank line before it, write exactly:
---FRAMEWORKS: [2–4 frameworks or concepts that informed your matching, comma-separated, no period]`

  const userMessage = `My Stage 6 answers:

LIFESTYLE NEEDS:
- Climate preference: "${answers.climate || 'not answered'}"
- Environment preference: "${answers.environment || 'not answered'}"
- Ideal pace of life: "${answers.pace || 'not answered'}"

PRACTICAL REQUIREMENTS:
- Monthly budget: ${answers.monthlyBudget || '0'} ${answers.currency || 'EUR'}
- Needs visa-free EU travel: "${answers.euTravel || 'not answered'}"
- Languages I speak: "${answers.languages?.trim() || 'not answered'}"
- Countries already on my list: "${answers.countriesList?.trim() || 'none / fully open'}"

FREEDOM PRIORITIES (ranked most to least important):
${prioritiesList}

Suggest 3 specific cities or regions now.`

  const text = await sendMessage(userMessage, systemPrompt)
  const userId = store.user?.id
  if (userId) insertReflection(userId, 6, text)
  return text
}

// ─── Action Plan ──────────────────────────────────────────────────────────────

export async function generateActionPlan(answers) {
  const store = useUserStore.getState()
  const { identityAnswers, pointBAnswers } = store

  const systemPrompt = `You are Unmap's strategic planning engine. Generate a personalised, achievable 4-week action plan for someone who has just completed their Stage 5 roadmap. Every task and checkpoint must reference their actual situation — no generic advice.

OUTPUT: Respond with ONLY a valid JSON object. No prose before or after. No markdown code fences. Raw JSON only.

JSON STRUCTURE (follow exactly):
{
  "theme": "A 5-10 word phrase capturing the essence of this person's transition",
  "weeks": [
    {
      "week": 1,
      "focus": "One short phrase for this week's focus area",
      "goal": "One specific, achievable goal for this week",
      "tasks": ["task 1", "task 2", "task 3"],
      "checkpoint": "A single question they ask themselves at week's end to know if they made progress"
    },
    { "week": 2, "focus": "...", "goal": "...", "tasks": ["...", "...", "..."], "checkpoint": "..." },
    { "week": 3, "focus": "...", "goal": "...", "tasks": ["...", "...", "..."], "checkpoint": "..." },
    { "week": 4, "focus": "...", "goal": "...", "tasks": ["...", "...", "..."], "checkpoint": "..." }
  ],
  "dailyHabit": "One concrete daily practice (5-15 minutes) that will compound over the month",
  "firstDayTask": "The single most important thing they do tomorrow. Specific and achievable in under 2 hours."
}`

  const pointBContext = pointBAnswers
    ? `Year 1 vision: "${pointBAnswers.year1_living || pointBAnswers.year1_tuesday || 'not answered'}"
Uncensored dream: "${pointBAnswers.uncensored_build || 'not answered'}"`
    : 'Point B not yet completed'

  const identityContext = identityAnswers
    ? `What makes them feel alive: "${identityAnswers.feelsAlive || 'not answered'}"
Their natural talent: "${identityAnswers.naturalTalent || 'not answered'}"
What they're known for: "${identityAnswers.peopleAskFor || 'not answered'}"`
    : 'Identity stage not yet completed'

  const userMessage = `Build my 4-week action plan based on everything I've shared:

WHAT I DO NOW:
"${answers.currentWork || 'not answered'}"

WHAT I WANT WORK TO LOOK LIKE:
"${answers.designedWork || 'not answered'}"

SKILLS I COULD EARN FROM REMOTELY:
"${answers.remoteSkills || 'not answered'}"

THE GAP:
"${answers.workGap || 'not answered'}"

MONTHLY EXPENSES: ${answers.monthlyExpenses || '0'} ${answers.currency || 'EUR'}
SAVINGS RUNWAY: ${answers.savingsRunway || 'not answered'}
FREEDOM INCOME TARGET: ${answers.freedomIncome || '0'} ${answers.currency || 'EUR'}

MY FIRST STEP THIS WEEK:
"${answers.firstStep || 'not answered'}"

WHAT'S BEEN STOPPING ME:
"${answers.firstMoveBlocker || 'not answered'}"

MY POINT B:
${pointBContext}

MY IDENTITY:
${identityContext}

Generate a 4-week plan now. Output only the JSON.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  })

  const raw = response.content[0].text.trim()
  // Strip markdown fences if Claude wraps the JSON
  const jsonString = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  return JSON.parse(jsonString)
}
