// Milestone 2 — Claude-powered chat interface
import MessageBubble from './MessageBubble'

export default function ChatInterface({ messages = [], onSend, loading = false }) {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-brand-border overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex gap-1 px-4 py-3">
            <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce" />
            <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce [animation-delay:0.1s]" />
            <span className="w-2 h-2 bg-brand-muted rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
        )}
      </div>
    </div>
  )
}
