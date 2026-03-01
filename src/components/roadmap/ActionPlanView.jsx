import { useNavigate } from 'react-router-dom'
import { useUserStore } from '@/store/userStore'
import { syncProfile } from '@/lib/db'

export default function ActionPlanView({ plan }) {
  const navigate = useNavigate()
  const { user, profile, setProfile, journeyProgress, setJourneyProgress } = useUserStore()

  function handleContinue() {
    const nextStage = Math.max(profile.currentStage ?? 0, 6)
    const nextProgress = Math.max(journeyProgress ?? 0, 83)
    const updatedProfile = { ...profile, currentStage: nextStage }
    setProfile(updatedProfile)
    setJourneyProgress(nextProgress)
    if (user?.id) syncProfile(user.id, { ...updatedProfile, journeyProgress: nextProgress })
    navigate('/dashboard')
  }

  return (
    <div className="space-y-6 pb-24 md:pb-8">

      {/* Header */}
      <div className="text-center pb-2">
        <h1 className="font-heading font-bold text-2xl text-brand-text">
          Your 4-week plan.
        </h1>
        {plan.theme && (
          <p className="text-brand-muted text-sm mt-2 italic">
            {plan.theme}
          </p>
        )}
      </div>

      {/* Week cards */}
      <div className="space-y-4">
        {plan.weeks?.map((week) => (
          <div
            key={week.week}
            className="bg-white rounded-2xl border border-brand-border overflow-hidden"
          >
            {/* Week header */}
            <div className="bg-brand-surface px-5 py-3 flex items-center justify-between border-b border-brand-border">
              <span className="font-heading font-bold text-brand-text text-sm">
                Week {week.week}
              </span>
              <span className="text-xs font-semibold text-brand-primary bg-brand-primary/10 px-2.5 py-1 rounded-full">
                {week.focus}
              </span>
            </div>

            <div className="p-5 space-y-4">
              {/* Goal */}
              <div>
                <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-1.5">
                  Goal
                </p>
                <p className="text-sm text-brand-text leading-snug font-medium">
                  {week.goal}
                </p>
              </div>

              {/* Tasks */}
              <div>
                <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">
                  This week's tasks
                </p>
                <ul className="space-y-2">
                  {week.tasks?.map((task, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-brand-text leading-snug">
                      <span className="w-5 h-5 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkpoint */}
              {week.checkpoint && (
                <div className="bg-brand-surface rounded-xl p-3.5">
                  <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-1">
                    Week-end check-in
                  </p>
                  <p className="text-xs text-brand-text italic leading-snug">
                    "{week.checkpoint}"
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Daily habit */}
      {plan.dailyHabit && (
        <div className="bg-brand-surface rounded-2xl p-5 border border-brand-border">
          <p className="text-[10px] font-semibold text-brand-muted uppercase tracking-widest mb-2">
            Daily habit (all 4 weeks)
          </p>
          <p className="text-sm text-brand-text leading-snug">
            {plan.dailyHabit}
          </p>
        </div>
      )}

      {/* First day task */}
      {plan.firstDayTask && (
        <div className="bg-brand-primary/5 rounded-2xl p-5 border border-brand-primary/20">
          <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-widest mb-2">
            Do this tomorrow morning
          </p>
          <p className="text-sm text-brand-text font-medium leading-snug">
            {plan.firstDayTask}
          </p>
        </div>
      )}

      {/* Continue CTA */}
      <button
        onClick={handleContinue}
        className="w-full bg-brand-primary text-white py-4 rounded-xl font-heading font-semibold text-base hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md"
      >
        Continue to Stage 6 →
      </button>

    </div>
  )
}
