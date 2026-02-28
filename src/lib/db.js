import { supabase } from './supabase'

// ─── Profile ────────────────────────────────────────────────────────────────

export async function syncProfile(userId, profileData) {
  try {
    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: userId,
          name: profileData.name ?? null,
          current_stage: profileData.currentStage ?? 1,
          onboarding_complete: profileData.onboardingComplete ?? false,
          journey_progress: profileData.journeyProgress ?? 0,
          point_b_clarity: profileData.pointBClarity ?? 0,
        },
        { onConflict: 'id' },
      )
    if (error) console.error('[db] syncProfile error:', error)
  } catch (err) {
    console.error('[db] syncProfile exception:', err)
  }
}

// ─── Wheel of Life ───────────────────────────────────────────────────────────

export async function syncWheelScores(userId, scores) {
  try {
    const { error } = await supabase
      .from('wheel_scores')
      .upsert(
        {
          user_id: userId,
          career: scores.career ?? 0,
          health: scores.health ?? 0,
          relationships: scores.relationships ?? 0,
          money: scores.money ?? 0,
          growth: scores.growth ?? 0,
          fun: scores.fun ?? 0,
          environment: scores.environment ?? 0,
          purpose: scores.purpose ?? 0,
        },
        { onConflict: 'user_id' },
      )
    if (error) console.error('[db] syncWheelScores error:', error)
  } catch (err) {
    console.error('[db] syncWheelScores exception:', err)
  }
}

// ─── Stage answers ───────────────────────────────────────────────────────────

export async function syncStageAnswers(userId, stage, answers, extra = {}) {
  try {
    const { error } = await supabase
      .from('stage_answers')
      .upsert(
        { user_id: userId, stage, answers, ...extra },
        { onConflict: 'user_id,stage' },
      )
    if (error) console.error(`[db] syncStageAnswers stage ${stage} error:`, error)
  } catch (err) {
    console.error(`[db] syncStageAnswers stage ${stage} exception:`, err)
  }
}

// ─── Reflections ─────────────────────────────────────────────────────────────
// Supabase table (create once):
// create table reflections (
//   id uuid primary key default gen_random_uuid(),
//   user_id uuid references profiles(id),
//   stage integer not null,
//   content text not null,
//   cycle integer not null default 1,
//   created_at timestamp default now()
// );

export async function insertReflection(userId, stage, content, cycle = 1) {
  try {
    const { error } = await supabase
      .from('reflections')
      .insert({ user_id: userId, stage, content, cycle })
    if (error) console.error('[db] insertReflection error:', error)
  } catch (err) {
    console.error('[db] insertReflection exception:', err)
  }
}

export async function loadReflections(userId) {
  try {
    const { data, error } = await supabase
      .from('reflections')
      .select('id, stage, content, cycle, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) console.error('[db] loadReflections error:', error)
    return data ?? []
  } catch (err) {
    console.error('[db] loadReflections exception:', err)
    return []
  }
}

// ─── Check-ins ───────────────────────────────────────────────────────────────

export async function syncCheckin(userId, moodScore, note = '') {
  try {
    const { error } = await supabase
      .from('checkins')
      .insert({ user_id: userId, mood_score: moodScore, note: note || null })
    if (error) console.error('[db] syncCheckin error:', error)
    return !error
  } catch (err) {
    console.error('[db] syncCheckin exception:', err)
    return false
  }
}

// ─── Load all user data ──────────────────────────────────────────────────────

export async function loadUserData(userId) {
  try {
    const [profileRes, wheelRes, stageRes, checkinRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('wheel_scores').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('stage_answers').select('*').eq('user_id', userId),
      supabase.from('checkins').select('*').eq('user_id', userId).order('created_at'),
    ])

    const profile = profileRes.data
    const wheel = wheelRes.data
    const stages = stageRes.data ?? []
    const checkins = checkinRes.data ?? []
    const stageMap = Object.fromEntries(stages.map((s) => [s.stage, s.answers]))

    return {
      profile: profile
        ? {
            name: profile.name ?? '',
            currentStage: profile.current_stage ?? 1,
            onboardingComplete: profile.onboarding_complete ?? false,
          }
        : null,
      wheelScores: wheel
        ? {
            career: wheel.career,
            health: wheel.health,
            relationships: wheel.relationships,
            money: wheel.money,
            growth: wheel.growth,
            fun: wheel.fun,
            environment: wheel.environment,
            purpose: wheel.purpose,
          }
        : null,
      journeyProgress: profile?.journey_progress ?? null,
      pointBClarity: profile?.point_b_clarity ?? null,
      onboardingAnswers: stageMap[1] ?? null,
      blocksAnswers: stageMap[2] ?? null,
      identityAnswers: stageMap[3] ?? null,
      pointBAnswers: stageMap[4] ?? null,
      roadmapAnswers: stageMap[5] ?? null,
      worldAnswers: stageMap[6] ?? null,
      checkins: checkins.map((c) => ({
        day: new Date(c.created_at).toLocaleDateString('en-US', { weekday: 'short' }),
        score: c.mood_score,
        date: c.created_at.slice(0, 10), // YYYY-MM-DD UTC for today detection
      })),
    }
  } catch (err) {
    console.error('[db] loadUserData exception:', err)
    return {}
  }
}

// ─── Manual diagnostic — call from browser console ───────────────────────────
// Usage: window.__unmapSync()

export function registerDebugSync(userId, store) {
  window.__unmapSync = async () => {
    console.group('[db] manual sync')
    console.log('userId:', userId)
    const { profile, wheelScores, onboardingAnswers, blocksAnswers, identityAnswers, pointBAnswers, roadmapAnswers, worldAnswers } = store
    console.log('store snapshot:', { profile, wheelScores, onboardingAnswers, blocksAnswers, identityAnswers, pointBAnswers, roadmapAnswers, worldAnswers })

    await syncProfile(userId, {
      ...profile,
      journeyProgress: store.journeyProgress,
      pointBClarity: store.pointBClarity,
    })
    if (wheelScores && Object.values(wheelScores).some((v) => v > 0)) {
      await syncWheelScores(userId, wheelScores)
    }
    if (onboardingAnswers) await syncStageAnswers(userId, 1, onboardingAnswers)
    if (blocksAnswers)     await syncStageAnswers(userId, 2, blocksAnswers)
    if (identityAnswers)   await syncStageAnswers(userId, 3, identityAnswers)
    if (pointBAnswers)     await syncStageAnswers(userId, 4, pointBAnswers)
    if (roadmapAnswers)    await syncStageAnswers(userId, 5, roadmapAnswers)
    if (worldAnswers)      await syncStageAnswers(userId, 6, worldAnswers)

    console.log('done')
    console.groupEnd()
  }
}
