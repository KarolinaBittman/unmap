import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loadUserData } from '@/lib/db'

export const useUserStore = create(
  persist(
    (set) => ({
      // Auth — not persisted (managed by auth session)
      user: null,
      authChecked: false,

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

      // Stage 4 Point B answers
      pointBAnswers: null,

      // Stage 5 Roadmap answers
      roadmapAnswers: null,

      // Stage 6 World answers
      worldAnswers: null,

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
      setAuthChecked: (authChecked) => set({ authChecked }),
      setProfile: (profile) => set({ profile }),
      setWheelScores: (wheelScores) => set({ wheelScores }),
      setOnboardingAnswers: (onboardingAnswers) => set({ onboardingAnswers }),
      setBlocksAnswers: (blocksAnswers) => set({ blocksAnswers }),
      setIdentityAnswers: (identityAnswers) => set({ identityAnswers }),
      setPointBAnswers: (pointBAnswers) => set({ pointBAnswers }),
      setRoadmapAnswers: (roadmapAnswers) => set({ roadmapAnswers }),
      setWorldAnswers: (worldAnswers) => set({ worldAnswers }),
      setJourneyProgress: (journeyProgress) => set({ journeyProgress }),
      setPointBClarity: (pointBClarity) => set({ pointBClarity }),
      addToConversation: (message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
        })),
      addCheckin: (checkin) =>
        set((state) => ({ checkins: [...state.checkins, checkin] })),

      // Load persisted data from Supabase after sign-in
      loadFromSupabase: async (userId) => {
        try {
          const data = await loadUserData(userId)
          const updates = {}
          if (data.profile)           updates.profile            = data.profile
          if (data.wheelScores)       updates.wheelScores        = data.wheelScores
          if (data.journeyProgress !== null) updates.journeyProgress = data.journeyProgress
          if (data.pointBClarity !== null)   updates.pointBClarity   = data.pointBClarity
          if (data.onboardingAnswers) updates.onboardingAnswers  = data.onboardingAnswers
          if (data.blocksAnswers)     updates.blocksAnswers      = data.blocksAnswers
          if (data.identityAnswers)   updates.identityAnswers    = data.identityAnswers
          if (data.pointBAnswers)     updates.pointBAnswers      = data.pointBAnswers
          if (data.roadmapAnswers)    updates.roadmapAnswers     = data.roadmapAnswers
          if (data.worldAnswers)      updates.worldAnswers        = data.worldAnswers
          if (data.checkins?.length)  updates.checkins           = data.checkins
          if (Object.keys(updates).length) set(updates)
        } catch (err) {
          console.error('[store] loadFromSupabase error:', err)
        }
      },
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
        pointBAnswers: state.pointBAnswers,
        roadmapAnswers: state.roadmapAnswers,
        worldAnswers: state.worldAnswers,
        checkins: state.checkins,
      }),
    },
  ),
)
