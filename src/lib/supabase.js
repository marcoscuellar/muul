// Accounts are DISABLED — the app runs local-only (localStorage), with no
// sign-in gate. This removes the auth wall entirely.
//
// To re-enable accounts later, restore the env/config-driven client:
//   import { createClient } from '@supabase/supabase-js'
//   import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from './config.js'
//   const URL  = import.meta.env.VITE_SUPABASE_URL  || PUBLIC_SUPABASE_URL
//   const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY || PUBLIC_SUPABASE_ANON_KEY
//   export const supabaseEnabled = !!(URL && ANON)
//   export const supabase = supabaseEnabled ? createClient(URL, ANON, {...}) : null

export const supabaseEnabled = false
export const supabase = null
