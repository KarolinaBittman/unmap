import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { loadUserData, syncProfile } from '@/lib/db'

// Progress is always derived from currentStage — never trust a stored number.
// This is the single source of truth for both local state and Supabase corrections.
const STAGE_PROGRESS_FLOOR = { 1: 0, 2: 17, 3: 33, 4: 50, 5: 67, 6: 83, 7: 100 }
function progressForStage(stage) {
  return STAGE_PROGRESS_FLOOR[stage] ?? (stage > 6 ? 100 : 0)
}

export const useUserStore = create(
  persist(
    (set, get) => ({
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

      // Generated 4-week action plan (after Stage 5 completion)
      roadmapPlan: null,

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
        roadmapPlan: null,
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
      setRoadmapPlan: (roadmapPlan) => set({ roadmapPlan }),
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
          if (data.profile) {
            // Never downgrade currentStage — local progress wins if it's ahead of the DB.
            // This prevents TOKEN_REFRESHED events from reverting completed stages when
            // a background syncProfile call failed or hadn't landed yet.
            const localStage = get().profile.currentStage ?? 1
            updates.profile = {
              ...data.profile,
              currentStage: Math.max(data.profile.currentStage ?? 1, localStage),
            }
          }
          // Always set wheelScores — use DB data if the user has scored, or zeros
          // for a fresh account. This prevents old persisted mock/dev data from
          // showing pre-filled sliders to new users.
          updates.wheelScores = data.wheelScores ?? { career: 0, health: 0, relationships: 0, money: 0, growth: 0, fun: 0, environment: 0, purpose: 0 }

          // Always derive journeyProgress from currentStage — never trust the stored
          // number, which can be stale (e.g. stuck at 17% even after all stages done).
          // The floor map is the single source of truth.
          const resolvedStage = updates.profile?.currentStage ?? get().profile.currentStage ?? 1
          const correctProgress = progressForStage(resolvedStage)
          updates.journeyProgress = correctProgress

          // Resolve pointBClarity BEFORE any sync calls so we always pass the real
          // value. The migration sync below was previously omitting pointBClarity,
          // causing it to write point_b_clarity: 0 to the DB on every page load.
          const dbPointBClarity    = data.pointBClarity ?? 0
          const localPointBClarity = get().pointBClarity ?? 0
          const resolvedPointBClarity = Math.max(dbPointBClarity, localPointBClarity)
          updates.pointBClarity = resolvedPointBClarity

          // One-time migration: if the DB has a stale journey_progress value, patch it now.
          // Always include pointBClarity in the payload so we never write 0 over a real value.
          const storedProgress = data.journeyProgress ?? 0
          if (storedProgress < correctProgress && resolvedStage >= 2) {
            const profileToSync = updates.profile ?? get().profile
            syncProfile(userId, { ...profileToSync, journeyProgress: correctProgress, pointBClarity: resolvedPointBClarity })
              .catch(() => {}) // fire-and-forget, non-blocking
          }

          // Repair sync: if the DB has point_b_clarity lower than the resolved value
          // (e.g. the migration previously wrote 0 over a real value), fix it now.
          if (resolvedPointBClarity > dbPointBClarity) {
            const profileToSync = updates.profile ?? get().profile
            syncProfile(userId, { ...profileToSync, journeyProgress: correctProgress, pointBClarity: resolvedPointBClarity })
              .catch(() => {})
          }
          if (data.onboardingAnswers) updates.onboardingAnswers  = data.onboardingAnswers
          if (data.blocksAnswers)     updates.blocksAnswers      = data.blocksAnswers
          if (data.identityAnswers)   updates.identityAnswers    = data.identityAnswers
          if (data.pointBAnswers)     updates.pointBAnswers      = data.pointBAnswers
          if (data.roadmapAnswers)    updates.roadmapAnswers     = data.roadmapAnswers
          if (data.worldAnswers)      updates.worldAnswers        = data.worldAnswers
          if (data.roadmapPlan)       updates.roadmapPlan        = data.roadmapPlan
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
        roadmapPlan: state.roadmapPlan,
        checkins: state.checkins,
      }),
    },
  ),
)
