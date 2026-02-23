// Milestone 3 — Supabase auth integration
import { useUserStore } from '@/store/userStore'

export function useUser() {
  const { user, profile, setUser, setProfile } = useUserStore()
  return { user, profile, setUser, setProfile }
}
