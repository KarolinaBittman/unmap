/**
 * Stage-specific resources and wellness tools.
 *
 * Each stage entry has:
 *   resources – 3 curated reading/exercise recommendations
 *   tools     – 3 short wellness practices to support that stage's inner work
 *
 * Resources shape: { title, type, framework, description, url? }
 * Tools shape:     { title, description, duration, color, bg, icon, instructions[] }
 *
 * `icon` is a lucide-react icon *name string* (e.g. 'Wind') — the consuming
 * component resolves it from a local map so this file stays import-free and
 * easy to extend.
 */

// ─── Resources ────────────────────────────────────────────────────────────────

const RESOURCES = {
  // Stage 1 — Where Are You (Wheel of Life, self-awareness baseline)
  1: [
    {
      title: 'The Wheel of Life',
      type: 'Article',
      framework: 'Wheel of Life',
      description: 'The coaching tool that started it all — read the original framing.',
      url: 'https://positivepsychology.com/life-wheel/',
    },
    {
      title: 'Designing Your Life',
      type: 'Book',
      framework: 'Design Your Life',
      description:
        'Bill Burnett & Dave Evans — how Stanford designers approach life like a prototype.',
    },
    {
      title: 'Life Satisfaction Scale',
      type: 'Exercise',
      framework: 'Positive Psychology',
      description: 'A validated 5-question tool to quantify where you actually are.',
      url: 'https://positivepsychology.com/satisfaction-with-life-scale/',
    },
  ],

  // Stage 2 — What Happened (blocks, trauma awareness, nervous system)
  2: [
    {
      title: 'The Body Keeps the Score',
      type: 'Book',
      framework: 'Somatic Therapy',
      description:
        'Bessel van der Kolk — the definitive book on how the body holds what the mind hides.',
    },
    {
      title: 'Running on Empty',
      type: 'Book',
      framework: 'Emotional Neglect',
      description:
        'Jonice Webb — for the blocks that have no obvious source but are deeply real.',
    },
    {
      title: 'The Belief Audit',
      type: 'Exercise',
      framework: 'Cognitive Restructuring',
      description:
        'Write down the thought that stops you. Then ask: is it fact, or is it story?',
    },
  ],

  // Stage 3 — Who Are You (identity, values, strengths, ikigai)
  3: [
    {
      title: 'VIA Character Strengths Survey',
      type: 'Exercise',
      framework: 'VIA Strengths',
      description: 'Free. Research-backed. 15 minutes to your top 5 strengths.',
      url: 'https://www.viacharacter.org/survey/account/register',
    },
    {
      title: "Man's Search for Meaning",
      type: 'Book',
      framework: 'Logotherapy',
      description:
        'Viktor Frankl — the most important book on purpose ever written. Read it slowly.',
    },
    {
      title: 'Ikigai: The Japanese Secret',
      type: 'Book',
      framework: 'Ikigai',
      description:
        'Héctor García & Francesc Miralles — the intersection of love, skill, need, and pay.',
    },
  ],

  // Stage 4 — Where Do You Want To Be (vision, Point B, future self)
  4: [
    {
      title: 'Designing Your Life',
      type: 'Book',
      framework: 'Design Your Life',
      description:
        "The most practical book on building a life you'd actually choose.",
    },
    {
      title: "The Future Self Mapping Exercise",
      type: 'Exercise',
      framework: 'Visualisation',
      description:
        'Write a letter from your 5-years-from-now self. What did they figure out?',
    },
    {
      title: 'The Miracle Morning',
      type: 'Book',
      framework: 'Intentional Living',
      description:
        'Hal Elrod — the case for designing your morning before the world gets its turn.',
    },
  ],

  // Stage 5 — How Do You Get There (career vehicle, money, first move)
  5: [
    {
      title: 'The $100 Startup',
      type: 'Book',
      framework: 'Entrepreneurship',
      description:
        'Chris Guillebeau — 50 case studies of people who built freedom on what they already had.',
    },
    {
      title: 'Your Money or Your Life',
      type: 'Book',
      framework: 'Financial Independence',
      description:
        'Vicki Robin — the book that reframes money as a unit of life energy.',
    },
    {
      title: 'Atomic Habits',
      type: 'Book',
      framework: 'Identity-Based Habits',
      description:
        "James Clear — why your first move isn't a task but an identity statement.",
    },
  ],

  // Stage 6 — Where In The World (location, nomad, Blue Zones)
  6: [
    {
      title: 'Nomad List',
      type: 'Tool',
      framework: 'Location Independence',
      description: 'Real cost-of-living, weather, and safety data for 1000+ cities worldwide.',
      url: 'https://nomadlist.com',
    },
    {
      title: 'The 4-Hour Workweek',
      type: 'Book',
      framework: 'Lifestyle Design',
      description:
        'Tim Ferriss — the book that made location independence a mainstream idea.',
    },
    {
      title: 'Blue Zones',
      type: 'Book',
      framework: 'Blue Zones',
      description:
        "Dan Buettner — what the world's longest-lived people have in common with their places.",
    },
  ],
}

// ─── Wellness Tools ───────────────────────────────────────────────────────────

const TOOLS = {
  // Stage 1 — ground yourself, notice where you are
  1: [
    {
      title: 'Box Breathing',
      description: '4-4-4-4 nervous system reset',
      duration: '5 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'Wind',
      instructions: [
        'Breathe in through your nose for 4 slow counts.',
        'Hold for 4 counts.',
        'Exhale through your mouth for 4 counts.',
        'Hold for 4 counts.',
        'Repeat for 4 full cycles. Feel the system slow down.',
      ],
    },
    {
      title: 'Body Scan',
      description: 'Grounding through somatic awareness',
      duration: '10 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Waves',
      instructions: [
        'Sit or lie somewhere quiet.',
        'Start at the crown of your head — just notice, no judgment.',
        'Slowly move attention down: face, neck, shoulders, chest, belly, legs, feet.',
        'If you find tension, breathe into it. Then release.',
        '10 minutes is enough.',
      ],
    },
    {
      title: 'Gratitude Practice',
      description: '3 specific things from today',
      duration: '5 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'Heart',
      instructions: [
        'Open a notebook or your phone notes.',
        'Write 3 things you are genuinely grateful for today.',
        'Be specific — not "family" but "the conversation with my sister this morning."',
        "Don't rush it. Let the feeling land for each one.",
        'This trains the brain toward what is already here.',
      ],
    },
  ],

  // Stage 2 — nervous system regulation, naming what's underneath
  2: [
    {
      title: 'Box Breathing',
      description: 'Nervous system regulation before going in',
      duration: '5 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'Wind',
      instructions: [
        'Breathe in through your nose for 4 slow counts.',
        'Hold for 4 counts.',
        'Exhale through your mouth for 4 counts.',
        'Hold for 4 counts.',
        'Repeat for 4 cycles. This activates your parasympathetic system.',
      ],
    },
    {
      title: '5-4-3-2-1 Grounding',
      description: 'Anxiety reset through the senses',
      duration: '5 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Focus',
      instructions: [
        'Notice 5 things you can see. Name them out loud or in your head.',
        'Notice 4 things you can touch. Feel their texture.',
        'Notice 3 things you can hear.',
        'Notice 2 things you can smell.',
        'Notice 1 thing you can taste.',
        'You are here. The past is not happening right now.',
      ],
    },
    {
      title: 'Emotional Check-in',
      description: 'Name what you feel — exactly',
      duration: '3 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'BookMarked',
      instructions: [
        'Find the feeling in your body first — where do you feel it physically?',
        "Name it precisely. Not just 'bad' — sad, ashamed, afraid, angry, numb?",
        'Say it to yourself out loud: "I feel ___."',
        'Feelings named are feelings that can move. Unnamed, they just grow.',
      ],
    },
  ],

  // Stage 3 — identity clarity, what's authentic vs performed
  3: [
    {
      title: 'Values Journaling',
      description: 'What you would protect at any cost',
      duration: '10 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'PenLine',
      instructions: [
        'Write this prompt: "When I feel most like myself, I am ___."',
        'Write for 5 minutes without stopping. No editing.',
        'Read it back. Circle any value words that appear.',
        'These are the things worth building a life around.',
      ],
    },
    {
      title: 'Morning Pages',
      description: 'Stream-of-consciousness to bypass the inner critic',
      duration: '20 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'BookMarked',
      instructions: [
        'First thing in the morning — before coffee, before your phone.',
        "Write 3 pages of whatever comes. Don't edit. Don't stop.",
        "When you're done, close the notebook. You don't have to read it.",
        'Do it every morning for one week. Notice what surfaces.',
      ],
    },
    {
      title: 'Mirror Work',
      description: 'Making contact with who you actually are',
      duration: '5 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Eye',
      instructions: [
        'Stand in front of a mirror. Look yourself in the eyes.',
        'Say your own name, then: "I see you. I hear you. You make sense."',
        'Stay with whatever comes up — embarrassment, sadness, warmth.',
        'This is identity work. It is supposed to feel strange at first.',
      ],
    },
  ],

  // Stage 4 — vision clarity, future self, possibility
  4: [
    {
      title: 'Future Self Letter',
      description: 'Write from your 5-years-from-now self',
      duration: '15 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'PenLine',
      instructions: [
        'Date the letter 5 years from today.',
        "Start with: 'Dear [your name], I'm writing from the life we built...'",
        'Write what you figured out, what you let go of, what surprised you.',
        "Don't censor. Future you is further along — they're allowed to be honest.",
        'Read it back slowly. Notice what feels true vs. what you are afraid to want.',
      ],
    },
    {
      title: 'Vision Journaling',
      description: 'Describe your Point B in sensory detail',
      duration: '20 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Eye',
      instructions: [
        'Write a day in your Point B life — from waking up to going to sleep.',
        'Be specific: where are you, who is around you, what does the air smell like?',
        'What work are you doing? How does your body feel?',
        'The more specific, the more real it becomes to the nervous system.',
      ],
    },
    {
      title: 'Box Breathing',
      description: 'Calm the system before visioning',
      duration: '5 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'Wind',
      instructions: [
        'Breathe in through your nose for 4 slow counts.',
        'Hold for 4 counts.',
        'Exhale through your mouth for 4 counts.',
        'Hold for 4 counts.',
        'Do this before your vision journaling. A calm body visualises better.',
      ],
    },
  ],

  // Stage 5 — action, productivity, financial clarity
  5: [
    {
      title: 'Pomodoro Technique',
      description: '25 min deep work, 5 min rest',
      duration: '25 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'Clock',
      instructions: [
        'Write down the one thing you are working on. One thing only.',
        'Set a timer for 25 minutes. Work on nothing else.',
        'When the timer rings, take a 5-minute break. Step away from the screen.',
        'After 4 cycles, take a longer break (15–30 min).',
        'The constraint is the point. Urgency creates focus.',
      ],
    },
    {
      title: 'Weekly Review',
      description: 'Clear the decks, set the week',
      duration: '30 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'RefreshCw',
      instructions: [
        'Every Sunday evening, find 30 quiet minutes.',
        'Review last week: what moved forward, what stalled, why.',
        'Write next week\'s one non-negotiable: the thing that matters most.',
        'Check your calendar. Is your time aligned with your priorities?',
        "Clear your inbox to zero. Start the week with an empty mind.",
      ],
    },
    {
      title: 'Focus Breathing',
      description: 'Prime your brain for deep work',
      duration: '4 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Wind',
      instructions: [
        'Sit upright. Close your eyes.',
        'Take 30 normal breaths, then one deep exhale.',
        'Repeat for 3 rounds.',
        'Open your eyes. Your brain is now primed for focus.',
        'Start the timer immediately.',
      ],
    },
  ],

  // Stage 6 — grounding in transition, navigating newness
  6: [
    {
      title: 'Walking Meditation',
      description: 'Grounding through movement and place',
      duration: '20 min',
      color: 'text-teal-500',
      bg: 'bg-teal-50',
      icon: 'Footprints',
      instructions: [
        'Go somewhere you can walk without a destination.',
        'Leave your headphones behind.',
        'Notice what is around you — sounds, smells, light, temperature.',
        'Match your breathing to your steps: 4 steps in, 4 steps out.',
        'You are learning to be in a place. This is the skill of every nomad.',
      ],
    },
    {
      title: 'Body Scan',
      description: 'Grounding in any new place',
      duration: '10 min',
      color: 'text-brand-primary',
      bg: 'bg-brand-surface',
      icon: 'Waves',
      instructions: [
        'Sit or lie somewhere in the new place.',
        'Start at the crown of your head — just notice.',
        'Slowly move attention down: face, neck, shoulders, chest, belly, legs, feet.',
        'If you find tension (travel does this), breathe into it.',
        'You are safe in this new place. Your body can land here.',
      ],
    },
    {
      title: 'Travel Journaling',
      description: 'Process what you are moving toward',
      duration: '10 min',
      color: 'text-brand-secondary',
      bg: 'bg-pink-50',
      icon: 'BookMarked',
      instructions: [
        'Write this prompt: "What I am leaving behind is ___. What I am moving toward is ___."',
        'Write for 5 minutes on each side.',
        "Don't make it neat. Transitions are complicated. Let it be complicated.",
        'Notice what you feel about each list.',
        'This is how you move consciously rather than just geographically.',
      ],
    },
  ],
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getStageResources(stage) {
  // Clamp: stages beyond 6 (e.g. 7 = journey complete) get stage 6 content
  const s = Math.min(Math.max(stage ?? 1, 1), 6)
  return {
    resources: RESOURCES[s],
    tools: TOOLS[s],
  }
}
