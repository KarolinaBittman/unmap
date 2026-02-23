import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create(
  persist(
    (set) => ({
      // Auth — not persisted (managed by auth session)
      user: null,

      // Profile
      profile: {
        name: 'Karolina',
        currentStage: 3,
        onboardingComplete: true,
      },

      // Wheel of Life scores
      wheelScores: {
        career: 6,
        health: 5,
        relationships: 7,
        money: 4,
        growth: 8,
        fun: 3,
        environment: 6,
        purpose: 5,
      },

      // Stage 1 onboarding answers
      onboardingAnswers: null,

      // Journey progress
      journeyProgress: 42,
      pointBClarity: 67,

      // Stage 2 blocks answers
      blocksAnswers: null,

      // Stage 3 identity answers
      identityAnswers: null,

      // Conversation history — session only, not persisted
      conversationHistory: [],

      // Checkin history for chart
      checkins: [
        { day: 'Mon', score: 5 },
        { day: 'Tue', score: 6 },
        { day: 'Wed', score: 4 },
        { day: 'Thu', score: 7 },
        { day: 'Fri', score: 8 },
        { day: 'Sat', score: 7 },
        { day: 'Sun', score: 9 },
      ],

      // Actions
      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setWheelScores: (wheelScores) => set({ wheelScores }),
      setOnboardingAnswers: (onboardingAnswers) => set({ onboardingAnswers }),
      setBlocksAnswers: (blocksAnswers) => set({ blocksAnswers }),
      setIdentityAnswers: (identityAnswers) => set({ identityAnswers }),
      setJourneyProgress: (journeyProgress) => set({ journeyProgress }),
      setPointBClarity: (pointBClarity) => set({ pointBClarity }),
      addToConversation: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),
      addCheckin: (checkin) =>
        set((state) => ({ checkins: [...state.checkins, checkin] })),
    }),
    {
      name: 'unmap-store',
      // Only persist data that should survive a page refresh.
      // Excludes: user (auth session), conversationHistory (session-only).
      partialize: (state) => ({
        profile: state.profile,
        wheelScores: state.wheelScores,
        onboardingAnswers: state.onboardingAnswers,
        journeyProgress: state.journeyProgress,
        pointBClarity: state.pointBClarity,
        blocksAnswers: state.blocksAnswers,
        identityAnswers: state.identityAnswers,
        checkins: state.checkins,
      }),
    },
  ),
)
