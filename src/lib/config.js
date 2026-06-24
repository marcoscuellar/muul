// Public, browser-safe configuration committed for reliable builds.
//
// The Supabase URL and anon key are designed to be exposed in client bundles —
// they only permit what Row-Level Security allows (see supabase/schema.sql),
// which restricts every account to its own row. Env vars take precedence, so you
// can override these per-environment or rotate the project without a code change.
//
// NEVER put secret keys here (service-role key, ANTHROPIC_API_KEY, etc.) — those
// are server-side only.

export const PUBLIC_SUPABASE_URL = 'https://rxrxirhogfjnrjjzjchj.supabase.co'
export const PUBLIC_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4cnhpcmhvZ2ZqbnJqanpqY2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIyNjQ0MjcsImV4cCI6MjA5Nzg0MDQyN30.2wGnWcc4A4K5nD-IwDskb2hvJtlStjdXek0uLEbPyAo'
