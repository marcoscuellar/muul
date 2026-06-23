import { useState } from 'react'
import { theme } from '../lib/constants.js'

// Editorial sign-in / create-account screen. Shown when accounts are enabled and
// no session exists. Keeps the black-and-white, zero-radius house style.
export default function AuthGate({ auth }) {
  const { A, ON } = theme('teal')
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const isSignup = mode === 'signup'

  async function submit(e) {
    e.preventDefault()
    if (busy) return
    setBusy(true); setError(''); setNotice('')
    try {
      const { data, error } = isSignup
        ? await auth.signUp(email.trim(), password)
        : await auth.signIn(email.trim(), password)
      if (error) { setError(error.message); return }
      // Email-confirmation projects return a user but no session.
      if (isSignup && !data.session) {
        setNotice('Account created. Check your email to confirm, then sign in.')
        setMode('signin')
      }
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const label = { fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 6 }

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 56px' }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 36 }}>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>MÚUL</span>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#9e9e9e' }}>Content System</span>
        </div>

        <h1 style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-.04em', textTransform: 'uppercase', lineHeight: .95, marginBottom: 28 }}>
          {isSignup ? 'Create\naccount'.split('\n').map((t, i) => <span key={i} style={{ display: 'block' }}>{t}</span>) : 'Sign in'}
        </h1>

        <form onSubmit={submit}>
          <div style={{ marginBottom: 24 }}>
            <div className="mono" style={label}>Email</div>
            <input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />
          </div>
          <div style={{ marginBottom: 32 }}>
            <div className="mono" style={label}>Password</div>
            <input type="password" autoComplete={isSignup ? 'new-password' : 'current-password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <div style={{ fontSize: 13, color: '#D7263D', marginBottom: 16, lineHeight: 1.4 }}>{error}</div>}
          {notice && <div style={{ fontSize: 13, color: '#000', marginBottom: 16, lineHeight: 1.4 }}>{notice}</div>}

          <button type="submit" disabled={busy} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 40px', background: A, color: ON, border: 'none', fontSize: 16, fontWeight: 700, cursor: busy ? 'default' : 'pointer', width: '100%', justifyContent: 'center' }}>
            {busy ? 'Working…' : (isSignup ? 'Create account' : 'Sign in')}
          </button>
        </form>

        <button
          onClick={() => { setMode(isSignup ? 'signin' : 'signup'); setError(''); setNotice('') }}
          className="mono"
          style={{ marginTop: 24, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e', borderBottom: '1px solid #e5e5e5', paddingBottom: 2 }}
        >
          {isSignup ? 'Have an account? Sign in' : 'New here? Create an account'}
        </button>
      </div>
    </div>
  )
}
