import { useEffect, useRef } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import PathBackground from '@/components/PathBackground'

const STAGES = [
  { num: 1, name: 'Where Are You',         desc: 'Map your life across 8 areas with the Wheel of Life.',       color: 'from-purple-100 to-purple-50',   dot: 'bg-brand-primary' },
  { num: 2, name: 'What Happened to You',  desc: 'Name the patterns and blocks that have kept you stuck.',     color: 'from-pink-100 to-pink-50',       dot: 'bg-brand-secondary' },
  { num: 3, name: 'Who Are You',           desc: 'Discover the identity underneath the roles you play.',       color: 'from-blue-100 to-blue-50',       dot: 'bg-blue-400' },
  { num: 4, name: 'Where Do You Want To Be', desc: 'Map your uncensored 1-year and 3-year vision.',           color: 'from-teal-100 to-teal-50',       dot: 'bg-teal-400' },
  { num: 5, name: 'How Do You Get There',  desc: 'Build your career vehicle and financial runway.',            color: 'from-emerald-100 to-emerald-50', dot: 'bg-emerald-400' },
  { num: 6, name: 'Where In The World',    desc: 'Find the places that match your values and freedom goals.',  color: 'from-cyan-100 to-cyan-50',       dot: 'bg-cyan-400' },
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
    desc: 'Unpack the values, strengths, and stories that make you you — beyond the roles you\'ve been playing.',
  },
  {
    icon: '◉',
    title: 'Design where you\'re going',
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

  // Redirect authenticated users to dashboard
  if (authChecked && user) {
    return <Navigate to="/dashboard" replace />
  }

  function scrollToHow() {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text overflow-x-hidden">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <PathBackground />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          {/* Logo */}
          <p className="text-brand-muted text-sm font-medium tracking-widest uppercase">unmap</p>

          {/* Headline */}
          <h1 className="font-['Lora'] italic text-4xl md:text-6xl font-bold text-brand-text leading-tight">
            The life you want<br />is already inside you.
          </h1>

          {/* Subheadline */}
          <p className="font-heading text-brand-muted text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Unmap guides you through 6 stages of honest self-reflection — using 85 psychological frameworks — to help you design the life you actually want.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto bg-[#2DD4BF] text-white font-heading font-semibold px-8 py-3.5 rounded-xl hover:bg-[#22BEA8] transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Start your journey
            </button>
            <button
              onClick={scrollToHow}
              className="w-full sm:w-auto border border-brand-border text-brand-muted font-heading font-medium px-8 py-3.5 rounded-xl hover:border-brand-primary/40 hover:text-brand-text transition-all duration-200"
            >
              See how it works
            </button>
          </div>

          {/* Social proof nudge */}
          <p className="text-brand-muted text-xs pt-2">
            Free to start. No credit card required.
          </p>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40">
          <div className="w-px h-8 bg-brand-muted rounded-full" />
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section ref={howItWorksRef} className="relative bg-white py-20 px-6">
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
                className={`bg-gradient-to-br ${stage.color} rounded-2xl p-5 border border-brand-border/50`}
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

      {/* ── WHAT UNMAP DOES ────────────────────────────────────── */}
      <section className="py-20 px-6 bg-brand-bg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">Why Unmap</span>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-text mt-3">
              One clear path through the fog.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div key={pillar.title} className="bg-white rounded-2xl p-6 border border-brand-border shadow-sm">
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

      {/* ── THE FRAMEWORKS ─────────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-semibold text-brand-primary uppercase tracking-widest">The Science</span>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-brand-text mt-3 mb-3">
            85 frameworks. One picture of you.
          </h2>
          <p className="text-brand-muted text-sm max-w-sm mx-auto mb-10">
            Every reflection is informed by decades of psychology, philosophy, and life design research.
          </p>

          {/* Pill cloud */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-6">
            {FRAMEWORKS.map((fw) => (
              <span
                key={fw}
                className="bg-brand-surface text-brand-text text-sm font-medium px-4 py-2 rounded-full border border-brand-border"
              >
                {fw}
              </span>
            ))}
            <span className="bg-brand-primary/10 text-brand-primary text-sm font-semibold px-4 py-2 rounded-full border border-brand-primary/20">
              +77 more
            </span>
          </div>

          <p className="text-xs text-brand-muted">
            Including Viktor Frankl's Logotherapy, Acceptance &amp; Commitment Therapy, Polyvagal Theory, and more.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="relative py-28 px-6 overflow-hidden">
        <PathBackground />
        <div className="relative z-10 max-w-xl mx-auto text-center space-y-6">
          <h2 className="font-['Lora'] italic text-4xl md:text-5xl font-bold text-brand-text leading-tight">
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

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-brand-border py-10 px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-heading font-bold text-brand-text">unmap</p>
            <p className="text-xs text-brand-muted mt-0.5">you make sense.</p>
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
