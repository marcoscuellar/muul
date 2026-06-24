import Spinner from './Spinner.jsx'
import CardHead from './CardHead.jsx'
import { analyzeBtn } from '../lib/styles.js'

const statKicker = { fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 12 }
const colHead = { fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e' }

export default function Analyze({ state, vals, actions }) {
  if (!vals.hasHistory) return (
    <div style={{ padding: '80px 0', textAlign: 'center', borderTop: '1px solid #000' }}>
      <div style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-.04em', textTransform: 'uppercase', lineHeight: 1 }}>No data<br />yet</div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginTop: 20 }}>Log posts with metrics to start the loop</div>
    </div>
  )

  return (
    <div>
      <div className="gap-lg" style={{ display: 'flex', gap: 80, alignItems: 'flex-start', marginBottom: 80, flexWrap: 'wrap' }}>
        <div>
          <div className="mono" style={statKicker}>Top type</div>
          <div className="stat64" style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-.04em', lineHeight: .9, textTransform: 'uppercase', maxWidth: 360 }}>{vals.topType}</div>
          <div className="mono" style={{ fontSize: 13, marginTop: 12 }}>{vals.topTypeAvg} avg impressions</div>
        </div>
        <div>
          <div className="mono" style={statKicker}>Best day</div>
          <div className="stat64" style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-.04em', lineHeight: .9, textTransform: 'uppercase' }}>{vals.topDay}</div>
          <div className="mono" style={{ fontSize: 13, marginTop: 12 }}>{vals.topDayAvg} avg impressions</div>
        </div>
        <div>
          <div className="mono" style={statKicker}>Avg engagement</div>
          <div className="stat64" style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-.04em', lineHeight: .9 }}>{vals.avgEng}</div>
          <div className="mono" style={{ fontSize: 13, marginTop: 12, color: '#9e9e9e' }}>likes + comments / post</div>
        </div>
      </div>

      <div className="card" style={{ border: '1px solid #000', padding: '8px 36px 14px', marginBottom: 24 }}>
        <div style={{ padding: '22px 0 14px' }}><CardHead num="01" title="Leaderboard" /></div>
        <div style={{ display: 'flex', padding: '14px 0', borderBottom: '1px solid #000' }} className="mono">
          <div style={{ flex: 1, ...colHead }}>Post type</div>
          <div style={{ width: 90, textAlign: 'right', ...colHead }}>Posts</div>
          <div style={{ width: 150, textAlign: 'right', ...colHead }}>Avg impr.</div>
          <div style={{ width: 150, textAlign: 'right', ...colHead }}>Avg eng.</div>
        </div>
        {vals.typeStats.map((t) => (
          <div key={t.type} style={{ display: 'flex', alignItems: 'center', padding: '20px 0', borderBottom: '1px solid #e5e5e5' }}>
            <div style={{ flex: 1, fontSize: 22, fontWeight: 600, letterSpacing: '-.01em' }}>{t.type}</div>
            <div className="mono" style={{ width: 90, textAlign: 'right', fontSize: 16, color: '#9e9e9e' }}>{t.count}</div>
            <div className="mono" style={{ width: 150, textAlign: 'right', fontSize: 18, fontWeight: 600 }}>{t.imp}</div>
            <div className="mono" style={{ width: 150, textAlign: 'right', fontSize: 18 }}>{t.eng}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ border: '1px solid #000', padding: '8px 36px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0 18px' }}>
          <CardHead num="02" title="Strategist read" />
          <button onClick={actions.runAnalysis} style={analyzeBtn}>
            {state.analyzing && <Spinner />}
            <span>{vals.analyzeBtnLabel}</span>
          </button>
        </div>
        {state.analysis ? (
          <div style={{ padding: '28px 0 0', fontSize: 18, lineHeight: 1.8, whiteSpace: 'pre-wrap', borderTop: '1px solid #000', maxWidth: 760 }}>{state.analysis}</div>
        ) : (
          <div style={{ padding: '48px 0', color: '#bdbdbd', fontSize: 16, borderTop: '1px solid #000' }}>Run analysis — the agent reads your numbers and tells you what to double down on.</div>
        )}
      </div>
    </div>
  )
}
