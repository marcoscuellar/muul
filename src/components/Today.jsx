import Spinner from './Spinner.jsx'
import Mic from './Mic.jsx'
import RelayLogo from './RelayLogo.jsx'
import { accentBtn, ghostBtn, glanceDot, confChip } from '../lib/styles.js'

const cardTitle = { fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }
const cardDesc = { fontSize: 13, color: '#9e9e9e', marginTop: 8, lineHeight: 1.5 }
const monoKicker = { fontSize: 12, color: '#9e9e9e' }

export default function Today({ state, vals, actions, dispatch }) {
  const { A, ON } = vals
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 780 }}>
      <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* THE ONE JOB */}
        <div style={{ border: '1px solid #000', padding: '28px 30px', display: 'flex', flexDirection: 'column', gap: 18, height: '100%' }}>
          <div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 10 }}>Today · {vals.todayStr}</div>
            <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.03em', lineHeight: 1.05 }}>{vals.todayJob}</div>
            <div style={{ fontSize: 13, color: '#737373', marginTop: 10 }}>{vals.debtLeft} owed this week · {vals.postedCount} shipped</div>
          </div>
          <button onClick={() => dispatch({ module: 'generate', genMode: 'post' })} style={{ ...accentBtn(A, ON), marginTop: 'auto', alignSelf: 'flex-start' }}>{vals.todayCta} →</button>
        </div>

        {/* 01 RIDE THE WAVE */}
        <div style={{ border: '1px solid #000', padding: '24px 30px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="mono" style={{ fontSize: 12, color: '#9e9e9e', flex: 'none' }}>01</span>
            <div style={{ flex: 1 }}>
              <h2 style={cardTitle}>Ride the wave</h2>
              <p style={cardDesc}>Blank-page paralysis? Get 5 fresh angles in your lanes — tap one to load it into the writer. <i>Smart picks, not a live feed.</i></p>
              <button onClick={actions.loadTrends} style={{ ...ghostBtn, marginTop: 16 }}>
                {state.trendsLoading && <Spinner dark />}
                <span>{vals.trendsBtnLabel}</span>
              </button>

              {state.trends.length > 0 ? (
                <div style={{ borderTop: '1px solid #e5e5e5', marginTop: 18 }}>
                  {state.trends.map((t, idx) => (
                    <div key={idx} onClick={() => actions.useTrend(t)} style={{ display: 'flex', gap: 20, alignItems: 'baseline', padding: '16px 0', borderBottom: '1px solid #e5e5e5', cursor: 'pointer' }}>
                      <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#9e9e9e', width: 120, flex: 'none' }}>{t.theme}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.01em' }}>{t.angle}</div>
                        <div className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000', marginTop: 6 }}>{t.type} →</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ borderTop: '1px solid #e5e5e5', marginTop: 22, paddingTop: 16 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 12 }}>This week at a glance</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {vals.weekGlance.map((g) => (
                      <div key={g.day} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0', borderBottom: '1px solid #f0f0f0' }}>
                        <span style={glanceDot(g.done, A)} />
                        <span className="mono" style={{ fontSize: 11, letterSpacing: '.08em', textTransform: 'uppercase', fontWeight: 600, width: 42, flex: 'none', color: g.dayColor }}>{g.day}</span>
                        <span style={{ fontSize: 14, flex: 1, color: g.txtColor }}>{g.type}</span>
                        <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: g.statusColor }}>{g.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 02 COMMENT + 03 PULSE side by side */}
      <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'start' }}>
        {/* 02 COMMENT */}
        <div style={{ border: '1px solid #000', padding: '24px 30px' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span className="mono" style={monoKicker}>02</span>
            <h2 style={cardTitle}>Comment game</h2>
          </div>
          <p style={cardDesc}>Spot a post worth a reply? Paste it — get an on-brand comment that adds value, not generic praise.</p>
          <textarea rows={4} placeholder="Paste the post you want to comment on…" value={state.commentSrc} onChange={(e) => dispatch({ commentSrc: e.target.value })} style={{ marginTop: 16 }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span />
            <Mic field="commentSrc" listeningField={state.listeningField} A={A} ON={ON} onToggle={actions.startDictation} />
          </div>
          <button onClick={actions.draftComment} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#000', color: '#fff', border: '1px solid #000', padding: '10px 18px', fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 16 }}>
            {state.commentLoading && <Spinner />}
            <span>{vals.commentBtnLabel}</span>
          </button>
          {state.commentOut && (
            <div style={{ borderTop: '1px solid #e5e5e5', marginTop: 20, paddingTop: 14, animation: 'rise .25s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e' }}>Your comment</span>
                <button onClick={actions.copyComment} className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #000' }}>{vals.commentCopyLabel}</button>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{state.commentOut}</div>
            </div>
          )}
        </div>

        {/* 03 RELAY — direct-source feed (two-pass verified) */}
        <div style={{ border: '1px solid #000', padding: '24px 30px', background: '#E0A500' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span className="mono" style={{ fontSize: 12, color: 'rgba(0,0,0,.5)' }}>03</span>
              <div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  <RelayLogo />
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 20, letterSpacing: '.16em', textTransform: 'uppercase', fontWeight: 700, color: '#16233f' }}>RELAY</span>
                  <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,.5)' }}>· standby</span>
                </span>
              </div>
            </div>
            <button onClick={actions.loadPulse} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#000', color: '#fff', border: '1px solid #000', padding: '9px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
              {state.pulseLoading && <Spinner />}
              <span>{vals.pulseBtnLabel}</span>
            </button>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(0,0,0,.62)', marginTop: 8, lineHeight: 1.5 }}>What's moving in security, AI, tech stacks &amp; standards — tap one to draft it. <i>Each item is cross-checked twice before it shows — still verify before you post.</i></p>

          {/* RELAY engine panel — direct-source wiring is Coming v2 */}
          <div style={{ border: '1px solid rgba(0,0,0,.35)', marginTop: 16, padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <RelayLogo />
              <span style={{ fontFamily: "'Geist Mono',monospace", fontSize: 13, fontWeight: 700, letterSpacing: '.22em', color: '#16233f' }}>RELAY</span>
              <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,.62)' }}>Direct-source engine</span>
            </div>
            <span className="mono" style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', background: '#000', color: '#E0A500', padding: '3px 8px' }}>Coming · v2</span>
            <div className="mono" style={{ flexBasis: '100%', fontSize: 10, letterSpacing: '.06em', textTransform: 'uppercase', color: 'rgba(0,0,0,.5)' }}>Pulls direct: CISA · NVD · arXiv · IEEE · GitHub · vendor blogs</div>
          </div>

          {state.pulseLoading && (
            <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, borderTop: '1px solid rgba(0,0,0,.25)', marginTop: 16, paddingTop: 16, fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', color: '#000' }}>
              <Spinner dark />{state.pulseStage}
            </div>
          )}

          {vals.hasPulse && (
            <div style={{ borderTop: '1px solid rgba(0,0,0,.25)', marginTop: 16, animation: 'rise .25s ease' }}>
              <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(0,0,0,.62)', padding: '12px 0 4px' }}>
                <i className="ti ti-shield-check" style={{ fontSize: 13 }} />{state.feedStatus}
              </div>
              {vals.feedViews.map((f, idx) => (
                <div key={idx} onClick={() => actions.draftFromFeed(state.feed[idx])} style={{ padding: '15px 0', borderBottom: '1px solid rgba(0,0,0,.15)', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span className="mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#E0A500', background: '#000', display: 'inline-block', padding: '2px 7px' }}>{f.cat}</span>
                    <span className="mono" style={confChip(f.confHigh)}>{f.confLabel}</span>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.3, letterSpacing: '-.01em', color: '#000' }}>{f.headline}</div>
                  <div style={{ fontSize: 13, color: 'rgba(0,0,0,.66)', marginTop: 5, lineHeight: 1.45 }}>{f.take}</div>
                  <div className="mono" style={{ fontSize: 9, letterSpacing: '.12em', textTransform: 'uppercase', color: '#000', marginTop: 8, fontWeight: 600 }}>Draft this →</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
