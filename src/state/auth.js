import { useEffect, useState } from 'react'
import { supabase, supabaseEnabled } from '../lib/supabase.js'

// Thin wrapper over Supabase Auth: tracks the session, exposes sign in / up /
// out. When Supabase isn't configured this reports a "disabled" auth so the app
// falls back to local-only mode with no gate.
export function useAuth() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(supabaseEnabled)

  useEffect(() => {
    if (!supabaseEnabled) return
    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      setLoading(false)
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return {
    enabled: supabaseEnabled,
    loading,
    session,
    user: session?.user || null,
    signUp: (email, password) => supabase.auth.signUp({ email, password }),
    signIn: (email, password) => supabase.auth.signInWithPassword({ email, password }),
    signOut: () => supabase.auth.signOut(),
  }
}
