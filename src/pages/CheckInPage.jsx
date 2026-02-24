import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Heart, CheckCircle } from 'lucide-react'
import { useUserStore } from '@/store/userStore'
import { syncCheckin } from '@/lib/db'

const MOOD_LABELS = {
  1: 'Struggling',
  2: 'Very low',
  3: 'Low',
  4: 'A bit flat',
  5: 'Okay',
  6: 'Decent',
  7: 'Pretty good',
  8: 'Good',
  9: 'Great',
  10: 'Brilliant',
}

function getMoodColor(score) {
  if (score >= 8) return 'text-brand-success'
  if (score >= 5) return 'text-brand-primary'
  return 'text-brand-secondary'
}

export default function CheckInPage() {
  const navigate = useNavigate()
  const { user, addCheckin } = useUserStore()

  const [score, setScore] = useState(5)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    setSaving(true)
    if (user?.id) {
      await syncCheckin(user.id, score, note.trim())
    }
    const dayLabel = new Date().toLocaleDateString('en-US', { weekday: 'short' })
    addCheckin({ day: dayLabel, score })
    setSaving(false)
    setSaved(true)
    setTimeout(() => navigate(-1), 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">

        {/* Close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-brand-surface hover:bg-brand-border transition-colors"
          aria-label="Close"
        >
          <X size={16} className="text-brand-muted" />
        </button>

        <div className="p-8">
          {saved ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle size={40} className="text-brand-success mx-auto" />
              <p className="font-heading font-semibold text-brand-text text-lg">Logged.</p>
              <p className="text-brand-muted text-sm">Your baseline has been updated.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-brand-surface rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-border">
                  <Heart size={20} className="text-brand-primary" />
                </div>
                <h2 className="font-heading font-bold text-2xl text-brand-text">
                  How are you feeling today?
                </h2>
                <p className="text-brand-muted text-sm mt-1">
                  Honest answers only — this is just for you.
                </p>
              </div>

              {/* Score display */}
              <div className="text-center mb-6">
                <span className={`text-6xl font-heading font-bold tabular-nums ${getMoodColor(score)}`}>
                  {score}
                </span>
                <span className="text-2xl font-heading font-semibold text-brand-muted ml-1">/10</span>
                <p className="text-brand-muted text-sm mt-2 font-medium">{MOOD_LABELS[score]}</p>
              </div>

              {/* Slider */}
              <div className="mb-6 px-1">
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    accentColor: 'var(--color-brand-primary)',
                    background: `linear-gradient(to right, #7C6BAE 0%, #7C6BAE ${(score - 1) / 9 * 100}%, #E8E4F0 ${(score - 1) / 9 * 100}%, #E8E4F0 100%)`,
                  }}
                />
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-brand-muted">Struggling</span>
                  <span className="text-[10px] text-brand-muted">Brilliant</span>
                </div>
              </div>

              {/* Optional note */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2">
                  Add a note <span className="font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="What's on your mind today?"
                  rows={3}
                  maxLength={500}
                  className="w-full resize-none rounded-xl border border-brand-border bg-brand-surface px-4 py-3 text-sm text-brand-text placeholder:text-brand-muted focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>

              {/* Save */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-brand-primary text-white py-4 rounded-xl font-heading font-semibold text-base hover:bg-brand-primary/90 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving…' : 'Log check-in →'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
