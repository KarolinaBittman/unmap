// Milestone 2 — Claude conversation management
import { useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { sendMessage } from '@/lib/claude'
import { buildSystemPrompt } from '@/lib/prompts'

export function useConversation(stageId) {
  const { profile, wheelScores, conversationHistory, addToConversation } =
    useUserStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function send(userMessage) {
    setLoading(true)
    setError(null)
    addToConversation({ role: 'user', content: userMessage })

    try {
      const systemPrompt = buildSystemPrompt(
        { name: profile.name, wheelScores },
        stageId,
      )
      const reply = await sendMessage(userMessage, systemPrompt, conversationHistory)
      addToConversation({ role: 'assistant', content: reply })
      return reply
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { send, loading, error, history: conversationHistory }
}
