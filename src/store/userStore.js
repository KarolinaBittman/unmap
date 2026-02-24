import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loadUserData } from '@/lib/db'

export const useUserStore = create(
  persist(
    (set) => ({
      // Auth — not persisted (managed by auth session)
      user: null,
      authChecked: false,
      profileLoaded: false, // true once loadFromSupabase has resolved

      // Profile
      profile: {
        name: '',
        currentStage: 1,
        onboardingComplete: false,
      },

      // Wheel of Life scores — all zero until the user has actually scored them
      wheelScores: {
        career: 0,
        health: 0,
        relationships: 0,
        money: 0,
        growth: 0,
        fun: 0,
        environment: 0,
        purpose: 0,
      },

      // Stage 1 onboarding answers
      onboardingAnswers: null,

      // Journey progress
      journeyProgress: 0,
      pointBClarity: 0,

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
      checkins: [],

      // Actions
      setUser: (user) => set({ user }),
      setAuthChecked: (authChecked) => set({ authChecked }),
      setProfileLoaded: (profileLoaded) => set({ profileLoaded }),

      // Wipe all user data from memory and localStorage on sign-out so the
      // next user who signs in starts with a clean slate.
      clearUserData: () => set({
        user: null,
        profileLoaded: false,
        profile: { name: '', currentStage: 1, onboardingComplete: false },
        wheelScores: { career: 0, health: 0, relationships: 0, money: 0, growth: 0, fun: 0, environment: 0, purpose: 0 },
        onboardingAnswers: null,
        journeyProgress: 0,
        pointBClarity: 0,
        blocksAnswers: null,
        identityAnswers: null,
        pointBAnswers: null,
        roadmapAnswers: null,
        worldAnswers: null,
        conversationHistory: [],
        checkins: [],
      }),
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

      // Load persisted data from Supabase after sign-in.
      // Always sets profileLoaded: true in finally so ProtectedRoute unblocks
      // even if the fetch fails or returns no rows.
      loadFromSupabase: async (userId) => {
        try {
          const data = await loadUserData(userId)
          const updates = {}
          if (data.profile)           updates.profile            = data.profile
          // Always set wheelScores — use DB data if the user has scored, or zeros
          // for a fresh account. This prevents old persisted mock/dev data from
          // showing pre-filled sliders to new users.
          updates.wheelScores = data.wheelScores ?? { career: 0, health: 0, relationships: 0, money: 0, growth: 0, fun: 0, environment: 0, purpose: 0 }
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
        } finally {
          set({ profileLoaded: true })
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
