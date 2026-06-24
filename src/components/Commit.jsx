import CardHead from './CardHead.jsx'
import { weekDot } from '../lib/styles.js'

const statBig = { fontSize: 128, fontWeight: 800, letterSpacing: '-.05em', lineHeight: .85 }
const statLabel = { fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginTop: 8 }

export default function Commit({ state, vals, actions, dispatch }) {
  const { A } = vals
  return (
    <div>
      <div className="gap-lg" style={{ display: 'flex', alignItems: 'baseline', gap: 80, marginBottom: 72 }}>
        <div>
          <div className="statbig" style={statBig}>{vals.contentDebt}</div>
          <div className="mono" style={statLabel}>Posts you owe</div>
        </div>
        <div>
          <div className="statbig" style={statBig}>{vals.postedCount}</div>
          <div className="mono" style={statLabel}>Shipped this week</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', textTransform: 'uppercase' }}>{vals.commitStatus}</div>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid #000', padding: '16px 36px 8px' }}>
        <div style={{ padding: '18px 0 10px' }}><CardHead num="01" title="Your week" /></div>
        {vals.weekViews.map((w) => (
          <div key={w.day} className="rowflex" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '22px 0', borderBottom: '1px solid #e5e5e5', opacity: w.opacity }}>
            <button onClick={() => actions.toggleDay(w.day)} style={weekDot(w.active, w.locked, A)} />
            <div style={{ width: 90, fontSize: 32, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase' }}>{w.day}</div>
            {w.active ? (
              <div style={{ flex: 1, maxWidth: 360 }}>
                <select value={w.type} onChange={(e) => actions.setDayType(w.day, e.target.value)} disabled={w.locked}>
                  {w.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ) : (
              <div style={{ flex: 1, fontSize: 16, color: '#bdbdbd' }}>Rest</div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'center', marginTop: 48 }}>
        {!state.committed ? (
          <button onClick={actions.lockWeek} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 40px', background: '#000', color: '#fff', border: 'none', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}><i className="ti ti-lock" /> Lock the week</button>
        ) : (
          <>
            <button onClick={actions.unlockWeek} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '18px 40px', background: '#fff', color: '#000', border: '1px solid #000', fontSize: 18, fontWeight: 700, cursor: 'pointer' }}><i className="ti ti-lock-open" /> Unlock</button>
            <span className="mono" style={{ fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase' }}>Locked — go log →</span>
          </>
        )}
      </div>
    </div>
  )
}
