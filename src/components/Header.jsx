import { ACC_ORDER, ACC, MODULES } from '../lib/constants.js'
import { swatch, moduleTab } from '../lib/styles.js'

export default function Header({ state, vals, actions, dispatch }) {
  return (
    <>
      {/* Top utility row: accent swatches + date / logged count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '24px 0 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
            {ACC_ORDER.map(([k, name]) => (
              <button
                key={k}
                title={name}
                onClick={() => actions.setAccent(k)}
                style={swatch(ACC[k], state.accent === k)}
              />
            ))}
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e' }}>
            {vals.todayStr} · {state.history.length} logged
          </div>
        </div>
      </div>

      {/* Brand + module tabs */}
      <div style={{ padding: '18px 0 0', borderBottom: '1px solid #e5e5e5' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px 32px', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.02em' }}>MÚUL</span>
            <span className="mono" style={{ fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: '#9e9e9e' }}>Content System</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 32px', alignItems: 'baseline' }}>
            {MODULES.map(([k, num, label]) => {
              const active = state.module === k
              return (
                <button key={k} onClick={() => dispatch({ module: k })} style={moduleTab(active, vals.A)}>
                  <sup className="mono" style={{ fontSize: 9, fontWeight: 500, verticalAlign: 'super', color: active ? vals.A : '#bdbdbd', marginRight: 3 }}>{num}</sup>
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
