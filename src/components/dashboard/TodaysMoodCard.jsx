import { Link } from 'react-router-dom'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { useUserStore } from '@/store/userStore'

export default function TodaysMoodCard() {
  const { checkins } = useUserStore()

  const today = new Date().toISOString().slice(0, 10)
  const todayEntry = checkins.find((c) => c.date === today)

  // Last 7 days for sparkline
  const sparkData = checkins.slice(-7).map((c) => ({ score: c.score }))

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-3">
      <p className="text-[11px] font-semibold tracking-widest text-brand-muted uppercase">
        Today's Mood
      </p>

      <div className="flex items-end gap-2">
        {todayEntry ? (
          <span className="text-5xl font-bold font-heading text-brand-text leading-none">
            {todayEntry.score}
          </span>
        ) : (
          <>
            <span className="text-5xl font-bold font-heading text-brand-muted leading-none">—</span>
            <Link
              to="/checkin"
              className="text-sm font-semibold text-brand-primary hover:underline mb-1"
            >
              Check in →
            </Link>
          </>
        )}
        {todayEntry && (
          <span className="text-brand-muted text-sm mb-1">/ 10</span>
        )}
      </div>

      {sparkData.length > 0 && (
        <div className="h-10">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData}>
              <Line
                type="monotone"
                dataKey="score"
                stroke="#7C6BAE"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <p className="text-[11px] text-brand-muted">Last 7 days</p>
    </div>
  )
}
