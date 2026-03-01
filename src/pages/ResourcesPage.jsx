import { useState } from 'react'
import Sidebar from '@/components/layout/Sidebar'
import Navbar from '@/components/layout/Navbar'
import BottomNav from '@/components/layout/BottomNav'
import { ChevronDown, ChevronUp, ArrowRight } from 'lucide-react'
import { getAllWellnessTools } from '@/lib/resources'

// ─── Framework data ────────────────────────────────────────────────────────
const CLUSTERS = [
  {
    id: 1,
    title: 'Who Am I?',
    subtitle: 'Self-awareness, personality, identity',
    color: 'bg-purple-50 border-purple-100',
    dot: 'bg-purple-400',
    frameworks: [
      { id: 1, name: 'Enneagram of Personality', creator: 'Gurdjieff / Ichazo / Naranjo', description: '9 personality types defined by core fear and core desire. Goes deeper than surface behaviour into motivation.', relevance: 5, read: 'The Wisdom of the Enneagram — Don Riso & Russ Hudson' },
      { id: 2, name: 'Myers-Briggs Type Indicator (MBTI)', creator: 'Isabel Briggs Myers & Katharine Cook Briggs', description: '16 personality types across 4 dimensions based on Jungian concepts. Most widely used personality framework globally.', relevance: 4, read: 'Gifts Differing — Isabel Briggs Myers' },
      { id: 3, name: 'Big Five Personality Traits (OCEAN)', creator: 'Costa & McCrae', description: 'Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism. The most scientifically validated personality model.', relevance: 4 },
      { id: 4, name: 'DISC Assessment', creator: 'William Moulton Marston', description: '4 behavioural styles — Dominance, Influence, Steadiness, Conscientiousness. Maps work style and communication patterns.', relevance: 3 },
      { id: 5, name: 'CliftonStrengths / StrengthsFinder', creator: 'Donald O. Clifton / Gallup', description: '34 talent themes focusing on what you\'re naturally great at. The original Zone of Genius framework.', relevance: 4 },
      { id: 6, name: 'VIA Character Strengths', creator: 'Martin Seligman & Christopher Peterson', description: '24 character strengths under 6 virtues. Free assessment available at viacharacter.org. Science-backed and openly accessible.', relevance: 5, read: 'Character Strengths and Virtues — Seligman & Peterson' },
      { id: 7, name: 'Human Design', creator: 'Ra Uru Hu', description: '5 energy types with decision-making strategies. Synthesis of astrology, I Ching, Kabbalah, and chakra systems.', relevance: 3 },
      { id: 8, name: 'Johari Window', creator: 'Joseph Luft & Harry Ingham', description: '4-quadrant model of self-knowledge vs. others\' perception. Reveals blind spots and hidden strengths.', relevance: 4 },
      { id: 9, name: 'Shadow Work', creator: 'Carl Gustav Jung', description: 'The unconscious "shadow" contains repressed desires, fears and traits. Integration leads to wholeness and reduces self-sabotage.', relevance: 5, read: 'Owning Your Own Shadow — Robert A. Johnson' },
      { id: 10, name: 'Attachment Theory', creator: 'John Bowlby & Mary Ainsworth', description: '4 attachment styles formed in childhood affecting all adult relationships. Foundational for understanding safety and intimacy patterns.', relevance: 5, read: 'Attached — Amir Levine & Rachel Heller' },
      { id: 11, name: 'Love Languages', creator: 'Gary Chapman', description: '5 ways people give and receive love: words, acts, gifts, time, touch. Useful for romantic and working relationships alike.', relevance: 3, read: 'The 5 Love Languages — Gary Chapman' },
      { id: 12, name: 'Transactional Analysis (TA)', creator: 'Eric Berne', description: 'Parent, Adult, Child ego states. Reveals the unconscious scripts inherited from caregivers that run adult life.', relevance: 4, read: 'Games People Play — Eric Berne' },
    ],
  },
  {
    id: 2,
    title: 'What Happened To Me?',
    subtitle: 'Trauma, healing, nervous system',
    color: 'bg-rose-50 border-rose-100',
    dot: 'bg-rose-400',
    frameworks: [
      { id: 13, name: 'Complex PTSD (CPTSD)', creator: 'Judith Herman / Pete Walker', description: 'Chronic childhood trauma creates pervasive effects on identity, emotion regulation, and relationships — different from single-event PTSD.', relevance: 5, read: 'Complex PTSD: From Surviving to Thriving — Pete Walker' },
      { id: 14, name: 'Internal Family Systems (IFS)', creator: 'Richard Schwartz', description: 'The mind contains multiple "parts" (Managers, Exiles, Firefighters). True Self can lead when parts are heard and healed.', relevance: 5, read: 'No Bad Parts — Richard Schwartz' },
      { id: 15, name: 'Polyvagal Theory', creator: 'Stephen Porges', description: '3 nervous system states: safe/social, fight-or-flight, shutdown. Safety is the prerequisite for any lasting change.', relevance: 5, read: 'The Polyvagal Theory — Stephen Porges' },
      { id: 16, name: 'Somatic Experiencing (SE)', creator: 'Peter Levine', description: 'Trauma lives in the body, not just the mind. Releasing stored tension completes the incomplete stress response cycle.', relevance: 4, read: 'Waking the Tiger — Peter Levine' },
      { id: 17, name: 'EMDR', creator: 'Francine Shapiro', description: 'Bilateral stimulation helps the brain reprocess traumatic memories that are stuck. Requires a trained therapist.', relevance: 3, read: 'Getting Past Your Past — Francine Shapiro' },
      { id: 18, name: 'Narrative Therapy', creator: 'Michael White & David Epston', description: 'You are not your problem. Externalise problems and rewrite the dominant story of your life.', relevance: 5, read: 'Narrative Means to Therapeutic Ends — White & Epston' },
      { id: 19, name: 'Rapid Transformational Therapy (RTT)', creator: 'Marisa Peer', description: 'Hypnotherapy-based. Goes directly to root cause beliefs formed in childhood and rewrites them in session.', relevance: 3, read: 'I Am Enough — Marisa Peer' },
      { id: 20, name: 'Acceptance and Commitment Therapy (ACT)', creator: 'Steven Hayes', description: 'Psychological flexibility through acceptance, defusion, values clarification, and committed action. Values over feelings.', relevance: 5, read: 'The Happiness Trap — Russ Harris' },
      { id: 21, name: 'Cognitive Behavioural Therapy (CBT)', creator: 'Aaron Beck', description: 'Thoughts → feelings → behaviours. Identify and restructure unhelpful thought patterns. Evidence-based and widely used.', relevance: 4, read: 'Feeling Good — David Burns' },
      { id: 22, name: 'Dialectical Behaviour Therapy (DBT)', creator: 'Marsha Linehan', description: 'Mindfulness + distress tolerance + emotion regulation + interpersonal effectiveness. Originally for BPD, broadly applicable.', relevance: 4, read: 'DBT Skills Training Handouts — Marsha Linehan' },
      { id: 23, name: 'Gestalt Therapy', creator: 'Fritz Perls', description: 'Present-moment awareness and "unfinished business" from the past that interrupts present living.', relevance: 3 },
      { id: 24, name: 'Emotion-Focused Therapy (EFT)', creator: 'Leslie Greenberg', description: 'Emotions contain adaptive information. Processing rather than suppressing leads to healing and clarity.', relevance: 4, read: 'Emotion-Focused Therapy — Leslie Greenberg' },
      { id: 25, name: 'Positive Disintegration', creator: 'Kazimierz Dąbrowski', description: 'Psychological breakdown can be a gateway to higher-level personality development. Crisis as catalyst.', relevance: 4 },
      { id: 26, name: 'Psychodrama', creator: 'Jacob Moreno', description: 'Role-play and dramatic action to explore and resolve psychological conflicts. Most powerful in group settings.', relevance: 2 },
      { id: 27, name: 'Family Constellation Therapy', creator: 'Bert Hellinger', description: 'Intergenerational trauma patterns repeat across generations. Understanding the family system unlocks the personal pattern.', relevance: 3, read: 'Loves Hidden Symmetry — Bert Hellinger' },
      { id: 28, name: 'Transpersonal Psychology', creator: 'Abraham Maslow / Stanislav Grof', description: 'Psychology that includes spiritual and transcendent dimensions of human experience beyond the ego.', relevance: 3 },
    ],
  },
  {
    id: 3,
    title: 'What Do I Want?',
    subtitle: 'Purpose, meaning, direction',
    color: 'bg-amber-50 border-amber-100',
    dot: 'bg-amber-400',
    frameworks: [
      { id: 29, name: 'Ikigai', creator: 'Japanese cultural concept', description: 'Intersection of what you love, what you\'re good at, what the world needs, and what you can be paid for. The natural purpose map.', relevance: 5 },
      { id: 30, name: 'Logotherapy', creator: 'Viktor Frankl', description: 'The primary human drive is meaning, not pleasure or power. Meaning found through work, love, and how we face suffering.', relevance: 5, read: "Man's Search for Meaning — Viktor Frankl" },
      { id: 31, name: 'PERMA Model', creator: 'Martin Seligman', description: 'Wellbeing = Positive emotions + Engagement + Relationships + Meaning + Achievement. Science-based flourishing framework.', relevance: 5, read: 'Flourish — Martin Seligman' },
      { id: 32, name: 'Self-Determination Theory (SDT)', creator: 'Edward Deci & Richard Ryan', description: '3 core psychological needs: Autonomy, Competence, Relatedness. Intrinsic motivation emerges when all three are met.', relevance: 5, read: 'Why We Do What We Do — Edward Deci' },
      { id: 33, name: 'Design Your Life', creator: 'Bill Burnett & Dave Evans (Stanford)', description: 'Apply design thinking to life decisions. Prototype multiple versions of your life before committing. Reframes "stuck" as "needfinding".', relevance: 5, read: 'Designing Your Life — Burnett & Evans' },
      { id: 34, name: 'Finding Your Why', creator: 'Simon Sinek', description: 'Start with purpose (WHY), then HOW, then WHAT. People connect to why, not what. Purpose as competitive advantage.', relevance: 4, read: 'Start With Why — Simon Sinek' },
      { id: 35, name: 'Zone of Genius', creator: 'Gay Hendricks', description: '4 zones — Incompetence, Competence, Excellence, Genius. True fulfilment and sustainability only come from the Zone of Genius.', relevance: 5, read: 'The Big Leap — Gay Hendricks' },
      { id: 36, name: 'North Star Framework', creator: 'Various', description: 'A long-term orienting vision that guides all decisions. Not a goal but a direction. Keeps all choices coherent.', relevance: 4 },
      { id: 37, name: 'Appreciative Inquiry', creator: 'David Cooperrider', description: 'Discovery, Dream, Design, Destiny. Focus on what\'s working and amplify it — rather than only fixing what\'s broken.', relevance: 4 },
      { id: 38, name: 'The 5 Regrets of the Dying', creator: 'Bronnie Ware', description: 'Research on deathbed regrets. Most common: not living authentically, working too hard, not expressing feelings.', relevance: 5, read: 'The Top Five Regrets of the Dying — Bronnie Ware' },
      { id: 39, name: "Maslow's Hierarchy of Needs", creator: 'Abraham Maslow', description: '5-level pyramid from survival → safety → belonging → esteem → self-actualisation. Diagnoses which level someone is stuck on.', relevance: 5 },
      { id: 40, name: 'The Second Mountain', creator: 'David Brooks', description: 'First mountain = achievement and success. Second mountain = commitment, contribution, community. For people who "made it" and still feel empty.', relevance: 4, read: 'The Second Mountain — David Brooks' },
    ],
  },
  {
    id: 4,
    title: 'What Is A Good Life?',
    subtitle: 'Philosophy and wisdom traditions',
    color: 'bg-teal-50 border-teal-100',
    dot: 'bg-teal-400',
    frameworks: [
      { id: 41, name: 'Stoicism', creator: 'Marcus Aurelius / Epictetus / Seneca', description: 'Focus only on what you control. Virtue is the highest good. Equanimity in the face of uncertainty and change.', relevance: 5, read: 'Meditations — Marcus Aurelius' },
      { id: 42, name: 'Existentialism', creator: 'Sartre / Camus / Heidegger / de Beauvoir', description: 'Existence precedes essence. You are not born with a purpose — you create it through choices. Liberation from inherited identities.', relevance: 5, read: 'Existentialism Is a Humanism — Jean-Paul Sartre' },
      { id: 43, name: 'Absurdism', creator: 'Albert Camus', description: 'Life has no inherent meaning — and the response is not despair but joyful rebellion. Sisyphus is happy.', relevance: 4, read: 'The Myth of Sisyphus — Albert Camus' },
      { id: 44, name: 'Eudaimonia (Aristotelian Ethics)', creator: 'Aristotle', description: 'Human flourishing through virtue and living in alignment with your best nature. Not happiness but thriving.', relevance: 4 },
      { id: 45, name: 'Epicureanism', creator: 'Epicurus', description: 'Simple pleasures, deep friendships, absence of fear and pain = the good life. Anti-hustle before it was cool.', relevance: 4 },
      { id: 46, name: 'Taoism / Wu Wei', creator: 'Laozi', description: 'Go with the natural flow of life. Non-striving. Essential for burned-out overachievers who need to release control.', relevance: 4, read: 'Tao Te Ching — Laozi' },
      { id: 47, name: 'Buddhism / The Middle Way', creator: 'Siddhartha Gautama', description: 'Suffering comes from attachment. The Eightfold Path leads to liberation. Present-moment awareness as daily practice.', relevance: 4, read: 'When Things Fall Apart — Pema Chödrön' },
      { id: 48, name: 'Nietzsche — Amor Fati', creator: 'Friedrich Nietzsche', description: 'Become what you are. Love your fate. Create your own values rather than inheriting them from others.', relevance: 4, read: 'Thus Spoke Zarathustra — Friedrich Nietzsche' },
      { id: 49, name: 'Vedanta / Advaita', creator: 'Ancient Indian tradition / Adi Shankaracharya', description: 'Non-duality. The individual self and universal consciousness are one. Suffering comes from the illusion of separation.', relevance: 3 },
      { id: 50, name: 'Zen Buddhism', creator: 'Bodhidharma / Japanese tradition', description: "Direct experience over intellectual understanding. Beginner's mind. Present-moment simplicity above all else.", relevance: 4, read: "Zen Mind, Beginner's Mind — Shunryu Suzuki" },
      { id: 51, name: 'Wabi-Sabi', creator: 'Japanese aesthetic philosophy', description: 'Beauty in imperfection and impermanence. Nothing is finished, nothing is perfect, nothing lasts.', relevance: 4, read: 'Wabi-Sabi for Artists and Designers — Leonard Koren' },
      { id: 52, name: 'Hygge', creator: 'Danish/Norwegian cultural concept', description: 'Cosiness, togetherness, simplicity, presence. Quality of life through small everyday pleasures.', relevance: 3, read: 'The Little Book of Hygge — Meik Wiking' },
      { id: 53, name: 'Ubuntu', creator: 'African philosophical tradition', description: '"I am because we are." Individual identity and wellbeing is inseparable from community and belonging.', relevance: 3 },
    ],
  },
  {
    id: 5,
    title: 'How Do I Change?',
    subtitle: 'Behaviour, identity, transformation',
    color: 'bg-blue-50 border-blue-100',
    dot: 'bg-blue-400',
    frameworks: [
      { id: 54, name: 'Identity-Based Habits', creator: 'James Clear', description: 'Change starts with identity: "I am the type of person who…" Systems over goals. Every action is a vote for who you want to be.', relevance: 5, read: 'Atomic Habits — James Clear' },
      { id: 55, name: 'Stages of Change (Transtheoretical Model)', creator: 'Prochaska & DiClemente', description: 'Precontemplation → Contemplation → Preparation → Action → Maintenance. Maps where someone actually is in their readiness to change.', relevance: 5 },
      { id: 56, name: 'Growth Mindset', creator: 'Carol Dweck', description: 'Abilities can be developed. Failure is feedback not verdict. The foundational mindset shift before any other change is possible.', relevance: 5, read: 'Mindset — Carol Dweck' },
      { id: 57, name: 'Flow State Theory', creator: 'Mihaly Csikszentmihalyi', description: 'Optimal experience at the edge of challenge and skill. Time disappears, self disappears — pure engagement. A clue to purpose.', relevance: 5, read: 'Flow — Mihaly Csikszentmihalyi' },
      { id: 58, name: "The Hero's Journey", creator: 'Joseph Campbell', description: 'Universal narrative: ordinary world → call to adventure → trials → transformation → return. All meaningful change follows this shape.', relevance: 5, read: 'The Hero With a Thousand Faces — Joseph Campbell' },
      { id: 59, name: 'Liminal Space Theory', creator: 'Arnold van Gennep / Victor Turner', description: 'The in-between state during transition. Neither here nor there. Disorienting, but the most creative place to be.', relevance: 4 },
      { id: 60, name: 'Positive Psychology', creator: 'Martin Seligman', description: 'The study of what makes life worth living. Strengths, flourishing, meaning — the antidote to deficit-based thinking.', relevance: 5, read: 'Authentic Happiness — Martin Seligman' },
      { id: 61, name: 'Self-Reparenting', creator: 'John Bradshaw / various', description: 'As adults we can give our inner child the nurturing we never received. Healing through sustained self-compassion.', relevance: 5, read: 'Homecoming — John Bradshaw' },
      { id: 62, name: 'Neuroplasticity', creator: 'Donald Hebb / modern neuroscience', description: 'The brain rewires through new experiences and repeated thoughts. Change is biologically possible at any age.', relevance: 4, read: 'The Brain That Changes Itself — Norman Doidge' },
      { id: 63, name: 'Habit Loop', creator: 'Charles Duhigg', description: 'Cue → Routine → Reward. Understanding this loop is the entry point for any lasting behaviour change.', relevance: 4, read: 'The Power of Habit — Charles Duhigg' },
      { id: 64, name: 'Cognitive Defusion (ACT)', creator: 'Steven Hayes', description: 'Unhooking from thoughts — observing them rather than being ruled by them. "I notice I\'m having the thought that…"', relevance: 5, read: 'The Happiness Trap — Russ Harris' },
      { id: 65, name: 'Adlerian Psychology', creator: 'Alfred Adler', description: 'Humans are motivated by belonging and significance. Inferiority feelings drive comparison and unworthiness patterns.', relevance: 3, read: 'The Courage to Be Disliked — Kishimi & Koga' },
    ],
  },
  {
    id: 6,
    title: 'Where And How Do I Want To Live?',
    subtitle: 'Lifestyle design, freedom, relocation',
    color: 'bg-green-50 border-green-100',
    dot: 'bg-green-400',
    frameworks: [
      { id: 66, name: 'The 4-Hour Workweek', creator: 'Tim Ferriss', description: 'Geographic arbitrage, lifestyle design, mini-retirements, outsourcing, automation. The founding text of the modern freedom movement.', relevance: 5, read: 'The 4-Hour Workweek — Tim Ferriss' },
      { id: 67, name: 'Cashflow Quadrant', creator: 'Robert Kiyosaki', description: 'Employee → Self-employed → Business owner → Investor. The rat race lives in the E and S quadrant. Freedom requires moving right.', relevance: 5, read: 'Rich Dad Poor Dad — Robert Kiyosaki' },
      { id: 68, name: 'FIRE Movement', creator: 'Various (Mr. Money Mustache popularised)', description: 'Financial Independence, Retire Early. Aggressive saving + investment to exit traditional employment permanently.', relevance: 4, read: 'Your Money or Your Life — Vicki Robin' },
      { id: 69, name: 'Blue Zones', creator: 'Dan Buettner (National Geographic)', description: '5 places where people live longest. Common factors: purpose, movement, plants, community, and deliberate downshift.', relevance: 4, read: 'The Blue Zones — Dan Buettner' },
      { id: 70, name: 'Essentialism', creator: 'Greg McKeown', description: 'Less but better. Ruthless elimination of the non-essential. Only do what only you can do.', relevance: 4, read: 'Essentialism — Greg McKeown' },
      { id: 71, name: 'Slow Living Movement', creator: 'Carl Honoré', description: 'Counter to hustle culture. Depth over speed, quality over quantity, presence over productivity.', relevance: 4, read: 'In Praise of Slow — Carl Honoré' },
      { id: 72, name: 'Third Place Theory', creator: 'Ray Oldenburg', description: 'Beyond home (1st) and work (2nd), humans need a 3rd place — café, park, community space — for belonging and civic life.', relevance: 4, read: 'The Great Good Place — Ray Oldenburg' },
      { id: 73, name: 'Nomad Capitalism / Flag Theory', creator: 'Andrew Henderson', description: 'Distribute your life legally across multiple countries for freedom, tax efficiency, and optionality.', relevance: 3, read: 'Nomad Capitalist — Andrew Henderson' },
      { id: 74, name: 'Ecological Identity', creator: 'Environmental psychology tradition', description: 'Physical environment shapes identity and cognitive capacity. Place is part of self — relocation is psychological, not just practical.', relevance: 4 },
      { id: 75, name: 'Wheel of Life', creator: 'Paul J. Meyer', description: 'Visual audit of 8-10 life areas scored 1-10. Instantly reveals imbalance. The perfect starting snapshot for any coaching process.', relevance: 5 },
      { id: 76, name: 'Four Burners Theory', creator: 'David Sedaris / popularised by James Clear', description: '4 burners: work, family, friends, health. You can only have 2 fully on at a time. Forces honest trade-off awareness.', relevance: 4, read: 'Atomic Habits — James Clear' },
    ],
  },
  {
    id: 7,
    title: 'Bonus: Emerging & Niche',
    subtitle: 'Lesser known but highly relevant',
    color: 'bg-slate-50 border-slate-100',
    dot: 'bg-slate-400',
    frameworks: [
      { id: 77, name: 'Integral Theory (AQAL)', creator: 'Ken Wilber', description: 'All Quadrants All Levels — maps interior/exterior + individual/collective. The most complete meta-framework available.', relevance: 3, read: 'A Brief History of Everything — Ken Wilber' },
      { id: 78, name: 'Psychosynthesis', creator: 'Roberto Assagioli', description: 'Integration of all aspects of personality — including spiritual — into a unified self. Wholeness-first therapeutic approach.', relevance: 3 },
      { id: 79, name: 'Wilderness Therapy', creator: 'Kurt Hahn (foundational)', description: 'Nature-based healing and growth. Outdoor challenge as therapeutic and transformative. The original "forest bathing".', relevance: 3 },
      { id: 80, name: 'Expressive Arts Therapy', creator: 'Natalie Rogers / various', description: 'Art, music, movement, writing as therapeutic tools for self-expression and healing when words are not enough.', relevance: 3 },
      { id: 81, name: 'Solution-Focused Brief Therapy (SFBT)', creator: 'Steve de Shazer & Insoo Kim Berg', description: 'Focus on solutions not problems. "What\'s already working?" The miracle question: if you woke up tomorrow and it was fixed, what would be different?', relevance: 4 },
      { id: 82, name: 'Motivational Interviewing', creator: 'William Miller & Stephen Rollnick', description: 'Collaborative conversation that strengthens motivation for change. Meets people where they are. The art of not pushing.', relevance: 5, read: 'Motivational Interviewing — Miller & Rollnick' },
      { id: 83, name: 'Coherence Therapy', creator: 'Bruce Ecker', description: 'Symptoms make perfect sense given hidden emotional learnings. Find the logic behind the pattern — and it dissolves.', relevance: 4, read: 'Unlocking the Emotional Brain — Ecker, Ticic & Hulley' },
      { id: 84, name: 'Mindfulness-Based Stress Reduction (MBSR)', creator: 'Jon Kabat-Zinn', description: '8-week secular mindfulness programme. Non-judgmental present-moment awareness as the foundation for everything else.', relevance: 4, read: 'Full Catastrophe Living — Jon Kabat-Zinn' },
      { id: 85, name: 'Person-Centred Therapy (PCT)', creator: 'Carl Rogers', description: 'Unconditional positive regard, empathy, congruence. The client has the answers within. The philosophy behind how Unmap is built.', relevance: 5, read: 'On Becoming a Person — Carl Rogers' },
    ],
  },
]

// ─── Relevance dots ────────────────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div className="flex gap-0.5 shrink-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= count ? 'bg-brand-primary' : 'bg-brand-border'}`} />
      ))}
    </div>
  )
}

// ─── Single framework row ──────────────────────────────────────────────────
function FrameworkRow({ fw }) {
  return (
    <div className="py-4 border-b border-brand-border last:border-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className="text-[10px] font-semibold text-brand-muted tabular-nums">#{fw.id}</span>
            <h4 className="font-heading font-semibold text-sm text-brand-text">{fw.name}</h4>
          </div>
          <p className="text-xs text-brand-muted mb-1.5">{fw.creator}</p>
          <p className="text-xs text-brand-text/80 leading-relaxed">{fw.description}</p>
          {fw.read && (
            <p className="text-[10px] text-brand-primary mt-1.5 font-medium">
              Read: {fw.read}
            </p>
          )}
        </div>
        <div className="shrink-0 pt-1">
          <Stars count={fw.relevance} />
        </div>
      </div>
    </div>
  )
}

// ─── Cluster accordion ─────────────────────────────────────────────────────
function ClusterCard({ cluster }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={`rounded-2xl border ${cluster.color} overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-3 h-3 rounded-full shrink-0 ${cluster.dot}`} />
          <div className="min-w-0">
            <p className="font-heading font-semibold text-brand-text text-sm leading-tight">
              {cluster.title}
            </p>
            <p className="text-xs text-brand-muted mt-0.5">{cluster.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-brand-muted">{cluster.frameworks.length}</span>
          {open ? (
            <ChevronUp size={16} className="text-brand-muted" />
          ) : (
            <ChevronDown size={16} className="text-brand-muted" />
          )}
        </div>
      </button>

      {open && (
        <div className="bg-white border-t border-brand-border/50 px-5">
          {cluster.frameworks.map((fw) => (
            <FrameworkRow key={fw.id} fw={fw} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Wellness tool row ──────────────────────────────────────────────────────
function WellnessToolRow({ tool }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-brand-border overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-3 bg-brand-surface hover:bg-brand-border/20 transition-colors duration-150 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-brand-text">{tool.title}</p>
            <span className="text-xs text-brand-muted ml-2 shrink-0">{tool.duration}</span>
          </div>
          <p className="text-xs text-brand-muted mt-0.5 leading-snug">{tool.description}</p>
        </div>
        {open
          ? <ChevronUp size={14} className="text-brand-muted shrink-0" />
          : <ArrowRight size={14} className="text-brand-muted shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 pb-4 pt-3 bg-white border-t border-brand-border">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">How to do it</p>
          <ol className="space-y-1.5">
            {tool.instructions.map((step, i) => (
              <li key={i} className="flex gap-2 text-xs text-brand-text leading-snug">
                <span className="text-brand-primary font-semibold shrink-0">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}

// ─── Wellness category accordion ───────────────────────────────────────────
function WellnessCategoryCard({ category, color, dot, tools }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`rounded-2xl border ${color} overflow-hidden`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left gap-3"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-3 h-3 rounded-full shrink-0 ${dot}`} />
          <p className="font-heading font-semibold text-brand-text text-sm">{category}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-brand-muted">{tools.length}</span>
          {open ? <ChevronUp size={16} className="text-brand-muted" /> : <ChevronDown size={16} className="text-brand-muted" />}
        </div>
      </button>
      {open && (
        <div className="bg-white border-t border-brand-border/50 p-4 space-y-2">
          {tools.map((tool) => (
            <WellnessToolRow key={tool.title} tool={tool} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [tab, setTab] = useState('frameworks')
  const total = CLUSTERS.reduce((sum, c) => sum + c.frameworks.length, 0)
  const wellnessCategories = getAllWellnessTools()
  const totalTools = wellnessCategories.reduce((sum, c) => sum + c.tools.length, 0)

  return (
    <div className="flex min-h-screen bg-brand-bg">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-2xl">
            <h1 className="font-heading font-bold text-2xl text-brand-text mb-1">
              Library
            </h1>
            <p className="text-brand-muted text-sm mb-6">
              The intellectual and practical foundation behind every stage of Unmap.
            </p>

            {/* Tabs */}
            <div className="flex gap-1 bg-brand-surface rounded-xl p-1 mb-8 w-fit">
              <button
                onClick={() => setTab('frameworks')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  tab === 'frameworks'
                    ? 'bg-white text-brand-text shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Frameworks
              </button>
              <button
                onClick={() => setTab('tools')}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                  tab === 'tools'
                    ? 'bg-white text-brand-text shadow-sm'
                    : 'text-brand-muted hover:text-brand-text'
                }`}
              >
                Wellness Tools
              </button>
            </div>

            {tab === 'frameworks' && (
              <>
                <p className="text-xs text-brand-muted mb-6">
                  {total} frameworks across {CLUSTERS.length} clusters · Referenced for educational purposes · Credits go to the original creators
                </p>
                <div className="space-y-3">
                  {CLUSTERS.map((cluster) => (
                    <ClusterCard key={cluster.id} cluster={cluster} />
                  ))}
                </div>
              </>
            )}

            {tab === 'tools' && (
              <>
                <p className="text-xs text-brand-muted mb-6">
                  {totalTools} practices across {wellnessCategories.length} categories · Expand any tool for step-by-step instructions
                </p>
                <div className="space-y-3">
                  {wellnessCategories.map((cat) => (
                    <WellnessCategoryCard key={cat.category} {...cat} />
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
