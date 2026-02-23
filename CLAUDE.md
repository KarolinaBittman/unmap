# CLAUDE.md — Unmap Project Bible
> This file tells Claude Code everything it needs to know about this project.
> Read this fully before writing any code. Follow these rules without exception.

---

## What We Are Building

**Unmap** is a guided life-redesign web application.

It helps people move from Point A (where they are now) to Point B (where they want to be) — across career, identity, lifestyle, and location. It uses LLM-powered conversation grounded in 85+ psychological and philosophical frameworks.

**Core tagline:** "You make sense."
**Core emotion:** Safe, warm, intelligent. Like a wise friend who happens to know psychology.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | React 18 + Vite | Not Next.js |
| Styling | Tailwind CSS | No inline styles |
| Components | shadcn/ui | Use existing components, don't reinvent |
| Charts | Recharts | Radar chart for Wheel of Life, LineChart for Emotional Baseline |
| LLM | Anthropic Claude API (claude-sonnet-4-20250514) | Core conversation engine |
| Database | Supabase | User profiles, conversation history, progress |
| Auth | Supabase Auth | Email + Google OAuth |
| Routing | React Router v6 | |
| State | Zustand | Global user profile state |
| HTTP | Axios | API calls |
| Hosting | Vercel (frontend) + Railway (backend if needed) | |
| Version control | GitHub | Commit after every meaningful change |

---

## Project Structure

```
unmap/
├── CLAUDE.md                  # This file — read first always
├── .env                       # Never commit this
├── .env.example               # Commit this with placeholder values
├── public/
├── src/
│   ├── main.jsx
│   ├── App.jsx                # Routes only, no logic
│   ├── components/
│   │   ├── ui/                # shadcn components (don't modify)
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── BottomNav.jsx
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── JourneyProgressCard.jsx
│   │   │   ├── PointBClarityCard.jsx
│   │   │   ├── WheelOfLife.jsx
│   │   │   ├── EmotionalBaseline.jsx
│   │   │   ├── StageCard.jsx
│   │   │   ├── JourneyStages.jsx
│   │   │   ├── TodaysResources.jsx
│   │   │   └── WellnessTools.jsx
│   │   ├── onboarding/
│   │   │   ├── OnboardingFlow.jsx
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── ReflectionCard.jsx
│   │   │   └── WheelOfLifeSetup.jsx
│   │   └── conversation/
│   │       ├── ChatInterface.jsx
│   │       └── MessageBubble.jsx
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Onboarding.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── JourneyPage.jsx
│   │   ├── CheckInPage.jsx
│   │   └── ResourcesPage.jsx
│   ├── lib/
│   │   ├── claude.js          # All Claude API calls live here
│   │   ├── supabase.js        # Supabase client
│   │   ├── prompts.js         # All system prompts and framework context
│   │   └── utils.js
│   ├── store/
│   │   └── userStore.js       # Zustand global state
│   ├── hooks/
│   │   ├── useUser.js
│   │   └── useConversation.js
│   └── styles/
│       └── globals.css
├── supabase/
│   └── schema.sql             # Database schema
└── package.json
```

---

## Design System — Follow Exactly

### Colours (use as Tailwind custom colours in tailwind.config.js)

```js
colors: {
  brand: {
    bg: '#FAFAF8',          // warm off-white — page background
    surface: '#F0EEF8',     // lavender blush — card background
    primary: '#7C6BAE',     // muted purple — primary actions
    secondary: '#E8A598',   // dusty rose — warmth, emotion
    text: '#2C2840',        // deep aubergine — primary text
    muted: '#8B85A0',       // soft grey-purple — secondary text
    success: '#9FC4B7',     // sage green — completed stages
    border: '#E2DFF0',      // soft border
  },
  gradient: {
    coral: 'linear-gradient(135deg, #F093FB 0%, #F5576C 100%)',
    teal: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
  }
}
```

### Typography

- Headings: **Plus Jakarta Sans** (import from Google Fonts)
- Body: **Inter**
- Emotional moments (Reflection Card): **Lora** italic

### Component Rules

- Border radius: always `rounded-2xl` (16px) on cards, `rounded-xl` on buttons
- Shadows: `shadow-sm` default, `shadow-md` on hover — never `shadow-lg` or higher
- Spacing: generous — minimum `p-6` on cards, `gap-6` between sections
- Transitions: `transition-all duration-200` on interactive elements
- No hard borders — use `border border-brand-border` only, never dark borders

### Gradient Cards (Journey Progress + Point B Clarity)

```jsx
// Journey Progress — coral/pink gradient
<div className="bg-gradient-to-br from-pink-400 via-purple-400 to-purple-600 rounded-2xl p-6 text-white">

// Point B Clarity — teal/rainbow gradient  
<div className="bg-gradient-to-br from-blue-400 via-teal-300 to-yellow-300 rounded-2xl p-6 text-white">
```

---

## The 6 Journey Stages

These are the core product stages. Every piece of UI maps to one of these:

| Stage | Name | Framework Cluster | Key Tool |
|-------|------|-------------------|---------|
| 1 | Where Are You | Self-awareness | Wheel of Life |
| 2 | What Happened | Trauma & Blocks | CPTSD diagnostic |
| 3 | Who Are You | Identity & Values | Ikigai + VIA Strengths |
| 4 | Where Do You Want To Be | Vision | 1y/2y/5y mapping |
| 5 | How Do You Get There | Vehicle | Career + Financial runway |
| 6 | Where In The World | Location | Nomad destination matching |

---

## Claude API Integration — Critical Rules

### File: src/lib/claude.js

```js
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
  dangerouslyAllowBrowser: true // MVP only — move to backend before launch
})

export async function sendMessage(userMessage, systemPrompt, conversationHistory = []) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ]
  })
  return response.content[0].text
}
```

### System Prompt Structure (src/lib/prompts.js)

Every Claude call must include:
1. **Unmap identity** — who Claude is in this context
2. **User profile** — everything we know about this user so far
3. **Current stage context** — which framework applies right now
4. **Tone rules** — warm, direct, non-clinical, never preachy

```js
export function buildSystemPrompt(userProfile, currentStage) {
  return `
You are Unmap's AI guide — warm, direct, psychologically informed, and deeply human.
You are NOT a therapist. You are a wise, honest companion helping someone redesign their life.

TONE RULES:
- Warm but not fluffy
- Direct but never harsh  
- Non-clinical — never use diagnostic language
- Ask one question at a time
- Reflect back what you hear before moving forward
- Never give generic advice — always personalise to what the user shared
- If someone shares something painful, acknowledge it before moving on

USER PROFILE:
${JSON.stringify(userProfile, null, 2)}

CURRENT STAGE: ${currentStage.name}
FRAMEWORK CONTEXT: ${currentStage.frameworkContext}

STAGE GOAL: ${currentStage.goal}
  `
}
```

---

## Database Schema (Supabase)

```sql
-- Users (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  name text,
  created_at timestamp default now(),
  current_stage integer default 1,
  onboarding_complete boolean default false
);

-- User's answers and values collected during journey
create table user_profile_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  key text not null,        -- e.g. 'wheel_career_score', 'ikigai_love', 'point_b_1y'
  value text not null,
  stage integer,
  created_at timestamp default now()
);

-- Conversation history per stage
create table conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  stage integer not null,
  role text not null,       -- 'user' or 'assistant'
  content text not null,
  created_at timestamp default now()
);

-- Daily check-ins for Emotional Baseline chart
create table checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  mood_score integer,       -- 1-10
  note text,
  created_at timestamp default now()
);
```

---

## Zustand Store Structure (src/store/userStore.js)

```js
{
  // Auth
  user: null,               // Supabase user object
  
  // Profile
  profile: {
    name: '',
    currentStage: 1,
    onboardingComplete: false,
  },
  
  // Wheel of Life scores
  wheelScores: {
    career: 0,
    health: 0,
    relationships: 0,
    money: 0,
    growth: 0,
    fun: 0,
    environment: 0,
    purpose: 0,
  },
  
  // Journey progress
  journeyProgress: 0,       // 0-100 percentage
  pointBClarity: 0,         // 0-100 percentage
  
  // Conversation history (current session)
  conversationHistory: [],
  
  // Checkin history for chart
  checkins: [],
}
```

---

## Component: WheelOfLife.jsx

Use **Recharts RadarChart**. Data shape:

```js
const data = [
  { area: 'Career', score: 6, fullMark: 10 },
  { area: 'Health', score: 5, fullMark: 10 },
  { area: 'Relationships', score: 7, fullMark: 10 },
  { area: 'Money', score: 4, fullMark: 10 },
  { area: 'Growth', score: 8, fullMark: 10 },
  { area: 'Fun', score: 3, fullMark: 10 },
  { area: 'Environment', score: 6, fullMark: 10 },
  { area: 'Purpose', score: 5, fullMark: 10 },
]
```

Radar fill: `#7C6BAE` at 30% opacity. Stroke: `#7C6BAE`. Dot: visible, filled purple.

---

## Component: EmotionalBaseline.jsx

Use **Recharts LineChart**. Smooth curve (`type="monotone"`). 
Line colour: `#7C6BAE`. Dots: coloured by score (green if >6, amber if 4-6, rose if <4).
X axis: week labels. Y axis: 1-10. No grid lines — use subtle dot grid instead.

---

## Coding Rules — Non-Negotiable

1. **No inline styles** — Tailwind classes only
2. **No any TypeScript** — we use plain JavaScript for MVP speed
3. **One component per file** — always
4. **Props always destructured** — `function Card({ title, value })` not `function Card(props)`
5. **Loading states always** — every async operation shows a loading indicator
6. **Error states always** — every async operation handles errors gracefully
7. **Mobile responsive** — use Tailwind responsive prefixes, test at 375px and 1280px
8. **No hardcoded user data** — always pull from Zustand store
9. **Console.log allowed during dev** — remove before any commit to main
10. **Comment complex logic** — especially Claude prompt construction
11. **Environment variables** — prefix with VITE_ for Vite projects
12. **Never commit .env** — it's in .gitignore

---

## Environment Variables (.env.example)

```
VITE_ANTHROPIC_API_KEY=your_key_here
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## Build Order (MVP Milestones)

### Milestone 1 — Static Shell (Week 1)
- [ ] Vite + React + Tailwind setup
- [ ] Design tokens in tailwind.config.js
- [ ] Google Fonts imported (Plus Jakarta Sans, Inter, Lora)
- [ ] Dashboard renders with static/mock data
- [ ] All 5 screens from Pencil design built as static React components
- [ ] React Router routing between pages
- [ ] Zustand store initialised

### Milestone 2 — Claude Integration (Week 2)
- [ ] Claude API connected (src/lib/claude.js)
- [ ] System prompts written for each stage (src/lib/prompts.js)
- [ ] Onboarding Round 1 — 5 questions powered by Claude
- [ ] Reflection Card — Claude generates personalised reflection
- [ ] Wheel of Life — interactive scoring, saves to store

### Milestone 3 — Data Persistence (Week 3)
- [ ] Supabase project created
- [ ] Schema deployed
- [ ] Auth working (email signup/login)
- [ ] User answers save to database
- [ ] Dashboard pulls real data from Supabase
- [ ] Emotional Baseline chart pulls real checkin data

### Milestone 4 — Beta Ready (Week 4)
- [ ] All 6 stages have at least basic conversation flow
- [ ] Daily check-in working
- [ ] Resources page with framework library + book links
- [ ] Wellness tools section with breathwork + RTT links
- [ ] Deploy to Vercel
- [ ] Share with 5 beta users
- [ ] Feedback collection (simple Tally form)

---

## What Unmap Is NOT

- Not a therapy app — never diagnose, never prescribe
- Not a chatbot — structured journey, not open conversation
- Not a quiz — dynamic, adapts to what user shares
- Not clinical — warm human tone always
- Not generic — every response personalised to the user's profile

---

## Frameworks Reference

Full framework library: see `unmap-frameworks-library.md`

**MVP Priority Frameworks (integrated in prompts):**
1. Wheel of Life — Stage 1
2. CPTSD awareness — Stage 2
3. Ikigai — Stage 3
4. Self-Determination Theory — throughout
5. Narrative Therapy — Stage 3
6. Design Your Life — Stage 4
7. Stages of Change — onboarding diagnostic
8. Identity-Based Habits — Stage 5
9. Blue Zones — Stage 6
10. Polyvagal Theory — wellness tools

---

*Last updated: February 2026*
*Product: Unmap v0.1 MVP*
*Founder: Karolina Bittmanova*
*Built with Claude*
