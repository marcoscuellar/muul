import { supabase } from './supabase.js'
import { cleanState } from './storage.js'

// Per-account durable storage: one JSONB row per user in `app_state`,
// protected by Row-Level Security (see supabase/schema.sql). The persisted
// shape mirrors the localStorage blob exactly.

const TABLE = 'app_state'

// Load this user's saved state, or null if they have none yet.
export async function loadCloud(userId) {
  if (!supabase || !userId) return null
  const { data, error } = await supabase
    .from(TABLE)
    .select('data')
    .eq('user_id', userId)
    .maybeSingle()
  if (error) {
    console.warn('[cloud] load failed:', error.message)
    return null
  }
  return data ? data.data : null
}

// Upsert this user's state blob (transient fields stripped).
export async function saveCloud(userId, state) {
  if (!supabase || !userId) return
  const { error } = await supabase
    .from(TABLE)
    .upsert(
      { user_id: userId, data: cleanState(state), updated_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    )
  if (error) console.warn('[cloud] save failed:', error.message)
}
