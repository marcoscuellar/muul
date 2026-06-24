import CardHead from './CardHead.jsx'
import { logYes, logNo, logSave } from '../lib/styles.js'

const metricLabel = { fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 2 }

export default function Log({ state, vals, actions }) {
  const { A, ON } = vals

  if (!state.committed) return (
    <div style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #000' }}>
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-.04em', textTransform: 'uppercase', lineHeight: 1 }}>No locked<br />week</div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginTop: 20 }}>Lock your days in Commit first</div>
    </div>
  )

  return (
    <div className="card" style={{ border: '1px solid #000', padding: '8px 36px' }}>
      <div style={{ padding: '22px 0 6px' }}><CardHead num="01" title="This week's posts" /></div>
      {vals.logViews.map((l) => (
        <div key={l.day} style={{ borderBottom: '1px solid #000' }}>
          <div className="rowflex" style={{ display: 'flex', alignItems: 'center', gap: 32, padding: '28px 0' }}>
            <div style={{ width: 90, fontSize: 32, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase', flex: 'none' }}>{l.day}</div>
            <div style={{ flex: 1, fontSize: 24, fontWeight: 600, letterSpacing: '-.01em' }}>{l.type}</div>
            <div style={{ display: 'flex', gap: 0, flex: 'none', border: '1px solid #000' }}>
              <button onClick={() => actions.setPosted(l.day, true)} style={logYes(l.yesOn, A, ON)}><i className="ti ti-check" /> Posted</button>
              <button onClick={() => actions.setPosted(l.day, false)} style={logNo(l.noOn)}>Skipped</button>
            </div>
          </div>
          {l.showMetrics && (
            <div className="metricsrow" style={{ display: 'flex', alignItems: 'flex-end', gap: 40, padding: '0 0 28px' }}>
              <div style={{ flex: 1 }}><div className="mono" style={metricLabel}>Impressions</div><input type="number" placeholder="0" value={l.impressions} onChange={(e) => actions.setMetric(l.day, 'impressions', e.target.value)} /></div>
              <div style={{ flex: 1 }}><div className="mono" style={metricLabel}>Likes</div><input type="number" placeholder="0" value={l.likes} onChange={(e) => actions.setMetric(l.day, 'likes', e.target.value)} /></div>
              <div style={{ flex: 1 }}><div className="mono" style={metricLabel}>Comments</div><input type="number" placeholder="0" value={l.comments} onChange={(e) => actions.setMetric(l.day, 'comments', e.target.value)} /></div>
              <div style={{ flex: 1 }}><div className="mono" style={metricLabel}>Follows</div><input type="number" placeholder="0" value={l.follows} onChange={(e) => actions.setMetric(l.day, 'follows', e.target.value)} /></div>
              <button onClick={() => actions.logToHistory(l.day)} style={logSave(l.saved, A, ON)}>{l.saveLabel}</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
