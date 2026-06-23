import { useStore } from './state/store.js'
import { useActions } from './state/actions.js'
import { derive } from './state/selectors.js'
import Header from './components/Header.jsx'
import ModuleHero from './components/ModuleHero.jsx'
import Today from './components/Today.jsx'
import Generate from './components/Generate.jsx'
import Commit from './components/Commit.jsx'
import Log from './components/Log.jsx'
import Analyze from './components/Analyze.jsx'

const MODULE_VIEWS = {
  today: Today,
  generate: Generate,
  commit: Commit,
  log: Log,
  analyze: Analyze,
}

export default function Workspace({ auth }) {
  const [state, dispatch] = useStore(auth?.user?.id)
  const actions = useActions(state, dispatch)
  const vals = derive(state)

  const View = MODULE_VIEWS[state.module]
  const shared = { state, vals, actions, dispatch, auth }

  return (
    <div style={{ minHeight: '100vh', background: '#fff' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 56px' }}>
        <Header {...shared} />
        <ModuleHero {...shared} />
        <View {...shared} />
        <div style={{ height: 120 }} />
      </div>
    </div>
  )
}
