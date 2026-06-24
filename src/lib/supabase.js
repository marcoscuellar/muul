import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from './config.js'

// Account-based storage is enabled when a URL + anon key are available. Env vars
// win; otherwise we fall back to the committed public config so any build has
// accounts enabled. If neither is set, the app runs fully on localStorage (no
// accounts, no gate).
const URL = import.meta.env.VITE_SUPABASE_URL || PUBLIC_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY

export const supabaseEnabled = !!(URL && ANON)

export const supabase = supabaseEnabled
  ? createClient(URL, ANON, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null
