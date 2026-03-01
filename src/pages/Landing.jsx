import { useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import PathBackground from '@/components/PathBackground'

const STAGES = [
  { num: 1, name: 'Where Are You',           desc: 'Map your life across 8 areas with the Wheel of Life.',       color: 'from-purple-100/80 to-purple-50/80',   dot: 'bg-brand-primary' },
  { num: 2, name: 'What Happened to You',    desc: 'Name the patterns and blocks that have kept you stuck.',     color: 'from-pink-100/80 to-pink-50/80',       dot: 'bg-brand-secondary' },
  { num: 3, name: 'Who Are You',             desc: 'Discover the identity underneath the roles you play.',       color: 'from-blue-100/80 to-blue-50/80',       dot: 'bg-blue-400' },
  { num: 4, name: 'Where Do You Want To Be', desc: 'Map your uncensored 1-year and 3-year vision.',              color: 'from-teal-100/80 to-teal-50/80',       dot: 'bg-teal-400' },
  { num: 5, name: 'How Do You Get There',    desc: 'Build your career vehicle and financial runway.',            color: 'from-emerald-100/80 to-emerald-50/80', dot: 'bg-emerald-400' },
  { num: 6, name: 'Where In The World',      desc: 'Find the places that match your values and freedom goals.',  color: 'from-cyan-100/80 to-cyan-50/80',       dot: 'bg-cyan-400' },
]

const PILLARS = [
  {
    icon: '◎',
    title: 'Understand where you are',
    desc: 'Get an honest picture of your life right now — across every dimension that matters. No filters, no judgment.',
  },
  {
    icon: '◈',
    title: 'Discover who you are',
    desc: "Unpack the values, strengths, and stories that make you you — beyond the roles you've been playing.",
  },
  {
    icon: '◉',
    title: "Design where you're going",
    desc: 'Build a concrete vision and action plan for the life you actually want — not the one you defaulted into.',
  },
]

const FRAMEWORKS = [
  'Ikigai', 'Polyvagal Theory', 'Design Your Life', 'IFS',
  'Logotherapy', 'FIRE Method', 'Essentialism', 'Blue Zones',
]

export default function Landing() {
  const navigate = useNavigate()
  const { user, authChecked } = useUserStore()
  const howItWorksRef = useRef(null)

  if (authChecked && user) {
    return <Navigate to="/dashboard" replace />
  }

  function scrollToHow() {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    // Base background colour — path SVG (fixed z-0) sits on top of this, sections sit on top of path
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">

      {/* PathBackground — fixed z-0, full viewport. scrollFill drives the
          gradient stroke animation as the user scrolls down the page. */}
      <PathBackground scrollFill />

      {/* ── NAVBAR ─────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-12"
        style={{ background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <div className="flex items-center gap-2.5">
          <img
            src="/icon.png"
            alt="Unmap"
            className="h-10 w-10 object-contain"
          />
          <span className="font-heading font-bold text-brand-text text-lg tracking-tight">
            unmap
          </span>
        </div>
        <button
          onClick={() => navigate('/auth')}
          className="text-sm font-medium text-brand-muted hover:text-brand-text transition-colors duration-150"
        >
          Sign in
        </button>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────
          No section background — path shows through freely        */}
      <section className="relative z-10 min-h-[calc(100vh-72px)] flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1
            className="text-4xl md:text-6xl text-brand-text leading-tight"
            style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            The life you want<br />is already inside you.
          </h1>

          <p className="font-heading text-brand-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Unmap guides you through 6 stages of honest self-reflection — using 85 psychological frameworks — to help you design the life you actually want.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-[#2DD4BF] text-white font-heading font-semibold px-8 py-3.5 rounded-xl hover:bg-[#22BEA8] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Start your journey
            </button>
            <button
              onClick={scrollToHow}
              className="w-full sm:w-auto border border-brand-border bg-white/60 text-brand-muted font-heading font-medium px-8 py-3.5 rounded-xl hover:border-brand-primary/40 hover:text-brand-text transition-all duration-200"
            >
              See how it works
            </button>
          </div>

          <p className="text-brand-muted text-xs pt-2">
            Free to start. No credit card required.
          </p>
        </div>

        {/* Scroll chevron — custom bounce so we can control amplitude */}
        <button
          onClick={scrollToHow}
          aria-label="Scroll down"
          className="absolute bottom-10 left-1/2 -translate-x-1/2 focus:outline-none"
          style={{ animation: 'chevronBounce 1.5s ease-in-out infinite' }}
        >
          <ChevronDown size={32} color="#2DD4BF" strokeWidth={2} />
        </button>
        <style>{`
          @keyframes chevronBounce {
            0%, 100% { transform: translateX(-50%) translateY(0px); }
            50%       { transform: translateX(-50%) translateY(10px); }
          }
        `}</style>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────
          No section background — path visible between cards       */}
      <section ref={howItWorksRef} className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">The Journey</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-text mt-3">
              6 stages. Your whole picture.
            </h2>
            <p className="text-brand-muted text-sm mt-3 max-w-sm mx-auto">
              Each stage builds on the last — guided by proven frameworks, personalised to you.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {STAGES.map((stage) => (
              <div
                key={stage.num}
                className={`bg-gradient-to-br ${stage.color} rounded-2xl p-5 border border-brand-border/50 backdrop-blur-sm`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-6 h-6 rounded-full ${stage.dot} flex items-center justify-center`}>
                    <span className="text-white text-[10px] font-bold">{stage.num}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest">
                    Stage {stage.num}
                  </span>
                </div>
                <p className="font-heading font-semibold text-brand-text text-sm mb-1">
                  {stage.name}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT UNMAP DOES ──────────────────────────────────────
          No section background — cards have bg-white              */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">Why Unmap</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-text mt-3">
              One clear path through the fog.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="bg-white/90 rounded-2xl p-6 border border-brand-border shadow-sm backdrop-blur-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-surface flex items-center justify-center text-brand-primary text-xl mb-4">
                  {pillar.icon}
                </div>
                <p className="font-heading font-semibold text-brand-text text-sm mb-2">
                  {pillar.title}
                </p>
                <p className="text-xs text-brand-muted leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE FRAMEWORKS ───────────────────────────────────────
          Semi-transparent pill container                          */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">The Science</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-text mt-3 mb-3">
            85 frameworks. One picture of you.
          </h2>
          <p className="text-brand-muted text-sm max-w-sm mx-auto mb-10">
            Every reflection is informed by decades of psychology, philosophy, and life design research.
          </p>

          <div className="flex flex-wrap justify-center gap-2.5 mb-6">
            {FRAMEWORKS.map((fw) => (
              <span
                key={fw}
                className="bg-white/80 text-brand-text text-sm font-medium px-4 py-2 rounded-full border border-brand-border backdrop-blur-sm"
              >
                {fw}
              </span>
            ))}
            <span className="bg-brand-primary/10 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full border border-brand-primary/20 backdrop-blur-sm">
              +77 more
            </span>
          </div>

          <p className="text-xs text-brand-muted">
            Including Viktor Frankl's Logotherapy, Acceptance &amp; Commitment Therapy, Polyvagal Theory, and more.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────
          No background — path fully visible here                  */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2
            className="text-4xl md:text-5xl text-brand-text leading-tight"
            style={{ fontFamily: "'Noto Serif', serif", fontStyle: 'italic', fontWeight: 400 }}
          >
            You make sense.<br />All of it does.
          </h2>
          <p className="text-brand-muted text-sm max-w-xs mx-auto">
            Start your journey — free, at your own pace, on your terms.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="inline-flex items-center gap-2 bg-[#2DD4BF] text-white font-heading font-semibold px-10 py-4 rounded-xl hover:bg-[#22BEA8] transition-all duration-200 shadow-sm hover:shadow-md text-base"
          >
            Begin your journey →
          </button>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────
          Solid white so it reads cleanly at the bottom            */}
      <footer className="relative z-10 bg-white border-t border-brand-border py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/Unmap Logo.png"
              alt="Unmap"
              className="h-8 w-8 rounded-full object-cover"
            />
            <div>
              <p className="font-heading font-bold text-brand-text text-sm">unmap</p>
              <p className="text-[10px] text-brand-muted mt-0.5">you make sense.</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/auth')}
              className="text-xs text-brand-muted hover:text-brand-text transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/auth')}
              className="text-xs text-brand-muted hover:text-brand-text transition-colors"
            >
              Create account
            </button>
          </div>
          <p className="text-xs text-brand-muted">
            © {new Date().getFullYear()} Unmap. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  )
}
