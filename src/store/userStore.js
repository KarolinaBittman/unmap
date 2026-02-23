import { create } from 'zustand'

export const useUserStore = create((set) => ({
  // Auth
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

  // Journey progress
  journeyProgress: 42,
  pointBClarity: 67,

  // Conversation history (current session)
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
  setJourneyProgress: (journeyProgress) => set({ journeyProgress }),
  setPointBClarity: (pointBClarity) => set({ pointBClarity }),
  addToConversation: (message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),
  addCheckin: (checkin) =>
    set((state) => ({ checkins: [...state.checkins, checkin] })),
}))
