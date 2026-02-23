import { cn } from '@/lib/utils'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex', isUser ? 'justify-end' : 'justify-start')}>
      <div
        className={cn(
          'max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-brand-primary text-white rounded-br-sm'
            : 'bg-brand-surface text-brand-text rounded-bl-sm',
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
