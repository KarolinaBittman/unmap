import { CheckCircle, Lock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

// Unique pastel background per stage
const STAGE_BG = {
  1: '#DBEAFE', // soft blue
  2: '#FFE4E1', // soft coral
  3: '#EDE9FE', // soft lavender
  4: '#DCFCE7', // soft mint
  5: '#FEF9C3', // soft yellow
  6: '#CCFBF1', // soft teal
}

// status: 'completed' | 'current' | 'locked'
export default function StageCard({ stage, status, onClick }) {
  const isCompleted = status === 'completed'
  const isCurrent = status === 'current'
  const isLocked = status === 'locked'
  const isClickable = !isLocked && !!onClick

  const stageBg = STAGE_BG[stage.id]

  return (
    <div
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick() : undefined}
      style={!isLocked ? { backgroundColor: stageBg } : undefined}
      className={cn(
        'rounded-2xl p-3.5 sm:p-5 flex flex-col gap-2 sm:gap-3 transition-all duration-200',
        isCompleted && 'border border-brand-border/60',
        isCurrent && 'border-2 border-brand-primary shadow-sm',
        isLocked && 'bg-white border border-brand-border opacity-55',
        isClickable && 'cursor-pointer hover:shadow-md',
      )}
    >
      {/* Status icon + stage number */}
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'text-xs font-semibold',
            isCompleted && 'text-brand-success',
            isCurrent && 'text-brand-primary',
            isLocked && 'text-brand-muted',
          )}
        >
          Stage {stage.id}
        </span>
        {isCompleted && <CheckCircle size={16} className="text-brand-success" />}
        {isCurrent && <ArrowRight size={16} className="text-brand-primary" />}
        {isLocked && <Lock size={14} className="text-brand-muted" />}
      </div>

      {/* Stage name */}
      <p
        className={cn(
          'font-heading font-semibold text-sm leading-snug',
          isLocked ? 'text-brand-muted' : 'text-brand-text',
        )}
      >
        {stage.name}
      </p>

      {/* Status badge */}
      {isCurrent && (
        <span className="inline-block text-[10px] font-semibold text-brand-primary bg-brand-primary/15 px-2 py-0.5 rounded-full w-fit">
          In progress
        </span>
      )}
      {isCompleted && (
        <span className="inline-block text-[10px] font-semibold text-brand-success bg-brand-success/20 px-2 py-0.5 rounded-full w-fit">
          Complete
        </span>
      )}
    </div>
  )
}
