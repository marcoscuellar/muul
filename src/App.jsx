import { useAuth } from './state/auth.js'
import AuthGate from './components/AuthGate.jsx'
import Workspace from './Workspace.jsx'

export default function App() {
  const auth = useAuth()

  // Accounts enabled (Supabase configured): show a gate until signed in.
  if (auth.enabled) {
    if (auth.loading) {
      return (
        <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.02em' }}>MÚUL</span>
        </div>
      )
    }
    if (!auth.user) return <AuthGate auth={auth} />
  }

  // Accounts disabled: local-only mode, no gate.
  return <Workspace auth={auth} />
}
