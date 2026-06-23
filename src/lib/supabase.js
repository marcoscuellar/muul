import { createClient } from '@supabase/supabase-js'

// Account-based storage is enabled only when these are configured. When they're
// absent the app runs fully on localStorage (no accounts, no gate) so it still
// works offline and builds without any secrets.
const URL = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseEnabled = !!(URL && ANON)

export const supabase = supabaseEnabled
  ? createClient(URL, ANON, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
