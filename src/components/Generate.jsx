import Spinner from './Spinner.jsx'
import Mic from './Mic.jsx'
import CardHead from './CardHead.jsx'
import { TYPES, TONES, GEN_MODES } from '../lib/constants.js'
import { genModeWord, typeRow, typeMark, genBtn, chip, monoTextBtn } from '../lib/styles.js'

const monoLabel = { fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#9e9e9e' }

function Inputs({ state, vals, actions, dispatch }) {
  const { A, ON } = vals
  const mode = state.genMode

  if (mode === 'post') return (
    <div>
      <div className="mono" style={{ ...monoLabel, marginBottom: 16 }}>Type — pick one</div>
      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 48 }}>
        {TYPES.map((t) => {
          const on = state.postType === t
          return (
            <button key={t} onClick={() => dispatch({ postType: t })} style={typeRow(on)}>
              <span>{t}</span>
              <span style={typeMark(on, A)} />
            </button>
          )
        })}
      </div>
      <div className="mono" style={{ ...monoLabel, marginBottom: 14 }}>Tone</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 48 }}>
        {TONES.map((t) => (
          <button key={t} onClick={() => dispatch({ tone: t })} style={chip(state.tone === t, A, ON)}>{t}</button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div className="mono" style={monoLabel}>The idea</div>
        <Mic field="topic" listeningField={state.listeningField} A={A} ON={ON} onToggle={actions.startDictation} />
      </div>
      <textarea rows={4} placeholder="A thought. A rant. A sentence worth sharpening." value={state.topic} onChange={(e) => dispatch({ topic: e.target.value })} />
    </div>
  )

  if (mode === 'ideas') return (
    <div>
      <div className="mono" style={{ ...monoLabel, marginBottom: 6 }}>Topic area</div>
      <textarea rows={4} placeholder="AI in recruiting · solo founder burnout · security blind spots…" value={state.ideasTopic} onChange={(e) => dispatch({ ideasTopic: e.target.value })} />
      <p style={{ fontSize: 14, color: '#9e9e9e', marginTop: 20, lineHeight: 1.5 }}>Six angles. Each a hook and the unique take. Click one to load it.</p>
    </div>
  )

  if (mode === 'recap') return (
    <div>
      <div style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 24, borderLeft: '2px solid #000', paddingLeft: 14 }}>Your Friday segment — <b>What Happened This Week.</b> Paste raw notes, get the post.</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
        <div className="mono" style={monoLabel}>This week's notes</div>
        <Mic field="recapNotes" listeningField={state.listeningField} A={A} ON={ON} onToggle={actions.startDictation} />
      </div>
      <textarea rows={8} placeholder={'- OpenAI shipped something wild\n- I built X\n- Big breach at a healthcare co\n- A trend in exec hiring'} value={state.recapNotes} onChange={(e) => dispatch({ recapNotes: e.target.value })} />
    </div>
  )

  // calendar
  return (
    <div>
      <div className="mono" style={{ ...monoLabel, marginBottom: 6 }}>Focus for the week</div>
      <textarea rows={4} placeholder="What should the week orbit around?" value={state.calTopic} onChange={(e) => dispatch({ calTopic: e.target.value })} />
      <p style={{ fontSize: 14, color: '#9e9e9e', marginTop: 20, lineHeight: 1.5 }}>3 posts. Friday is always the Recap. Take it to Commit to lock.</p>
    </div>
  )
}

function Output({ state, vals, actions }) {
  const { A, ON } = vals

  if (vals.showTextOut) return (
    <div style={{ animation: 'rise .25s ease', borderTop: '1px solid #000' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>{vals.outLabel}</span>
        <div style={{ display: 'flex', gap: 18 }}>
          <button onClick={actions.gradePost} className="mono" style={monoTextBtn}>{vals.gradeLabel}</button>
          <button onClick={actions.copyOutput} className="mono" style={monoTextBtn}>{vals.copyLabel}</button>
          <button onClick={actions.saveDraft} className="mono" style={monoTextBtn}>Save</button>
        </div>
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.8, whiteSpace: 'pre-wrap', borderTop: '1px solid #e5e5e5', maxHeight: 560, overflow: 'auto', paddingTop: 24 }}>{state.output}</div>

      {vals.grade && (
        <div style={{ borderTop: '1px solid #000', marginTop: 24, paddingTop: 22, animation: 'rise .25s ease' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24 }}>
            <div style={{ flex: 'none', textAlign: 'center' }}>
              <div style={{ fontSize: 72, fontWeight: 800, letterSpacing: '-.04em', lineHeight: .85 }}>{vals.grade.letter}</div>
              <div className="mono" style={{ fontSize: 11, letterSpacing: '.12em', color: '#9e9e9e', marginTop: 4 }}>{vals.grade.score}/100</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, lineHeight: 1.55, fontWeight: 500, marginBottom: 14 }}>{vals.grade.verdict}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {vals.grade.checks.map((c, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 10, fontSize: 14, lineHeight: 1.4 }}>
                    <span style={{ flex: 'none', width: 14, fontWeight: 700 }}>{c.mark}</span>
                    <span style={{ flex: 'none', width: 120, fontWeight: 600 }}>{c.label}</span>
                    <span style={{ flex: 1, color: '#555' }}>{c.note}</span>
                  </div>
                ))}
              </div>
              {vals.grade.hasFix && (
                <div style={{ marginTop: 16, borderLeft: '2px solid #000', paddingLeft: 14 }}>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e', marginBottom: 5 }}>Sharpen it</div>
                  <div style={{ fontSize: 14, lineHeight: 1.55 }}>{vals.grade.fix}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POST HANDOFF */}
      <div style={{ borderTop: '1px solid #000', marginTop: 24, paddingTop: 20, display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <button onClick={actions.postToLinkedIn} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', background: '#000', color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}><i className="ti ti-brand-linkedin" /> {vals.postLabel}</button>
        <button onClick={actions.genImagePrompt} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 20px', background: '#fff', color: '#000', border: '1px solid #000', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          {state.imgLoading && <Spinner dark />}
          <i className="ti ti-photo" /> {vals.imgBtnLabel}
        </button>
      </div>
      <div style={{ fontSize: 13, color: '#9e9e9e', lineHeight: 1.4, marginTop: 10, maxWidth: 420 }}>Post copies to clipboard + opens LinkedIn's composer. <i>(Hands-free auto-posting needs a LinkedIn API connection — v2.)</i></div>

      {state.imgPrompt && (
        <div style={{ border: '1px solid #000', marginTop: 20, animation: 'rise .25s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #e5e5e5' }}>
            <span className="mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: '#9e9e9e' }}>Image prompt — paste into Midjourney / DALL·E / Ideogram</span>
            <button onClick={actions.copyImgPrompt} className="mono" style={{ fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #000' }}>{vals.imgCopyLabel}</button>
          </div>
          <div style={{ padding: 16, fontSize: 14, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{state.imgPrompt}</div>
        </div>
      )}
    </div>
  )

  if (vals.showIdeasOut) return (
    <div style={{ animation: 'rise .25s ease', borderTop: '1px solid #000' }}>
      {state.ideas.map((i, idx) => (
        <div key={idx} onClick={() => actions.useIdea(i)} style={{ padding: '20px 0', borderBottom: '1px solid #e5e5e5', cursor: 'pointer', display: 'flex', gap: 18, alignItems: 'baseline' }}>
          <span className="mono" style={{ fontSize: 12, color: '#9e9e9e', flex: 'none', width: 24 }}>{String(idx + 1).padStart(2, '0')}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.25, letterSpacing: '-.01em' }}>{i.hook}</div>
            <div style={{ fontSize: 14, color: '#737373', marginTop: 6, lineHeight: 1.45 }}>{i.angle}</div>
            <div className="mono" style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', color: '#000', marginTop: 10 }}>{i.type} →</div>
          </div>
        </div>
      ))}
    </div>
  )

  // empty
  return (
    <div style={{ borderTop: '1px solid #000', padding: '48px 0', color: '#bdbdbd' }}>
      <div className="mono" style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase' }}>Your words land here</div>
    </div>
  )
}

function Library({ state, vals, actions, dispatch }) {
  return (
    <div className="card" style={{ border: '1px solid #000', padding: '28px 30px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: '#9e9e9e' }}>02</span>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }}>Library</h2>
          <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: '#9e9e9e' }}>{state.drafts.length} saved</span>
        </div>
        <input type="text" placeholder="Search…" value={state.search} onChange={(e) => dispatch({ search: e.target.value })} style={{ maxWidth: 140 }} />
      </div>
      {vals.hasDrafts ? (
        <div style={{ borderTop: '1px solid #e5e5e5', maxHeight: 420, overflow: 'auto' }}>
          {vals.draftsF.map((d) => (
            <div key={d.id} style={{ padding: '16px 0', borderBottom: '1px solid #e5e5e5' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 7 }}>
                <span className="mono" style={{ fontSize: 10, letterSpacing: '.1em', textTransform: 'uppercase', color: '#fff', background: '#000', padding: '2px 7px' }}>{d.type}</span>
                <span className="mono" style={{ fontSize: 10, color: '#9e9e9e', flex: 'none' }}>{d.date}</span>
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.35, marginBottom: 9 }}>{d.hook}</div>
              <div style={{ display: 'flex', gap: 16 }}>
                <button onClick={() => { try { navigator.clipboard.writeText(d.text) } catch (e) {} }} className="mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #000' }}>Copy</button>
                <button onClick={() => actions.loadDraft(d)} className="mono" style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', borderBottom: '1px solid #000' }}>Reuse</button>
                <button onClick={() => actions.delDraft(d.id)} className="mono" style={{ fontSize: 11, background: 'none', border: 'none', cursor: 'pointer', color: '#9e9e9e', marginLeft: 'auto' }}><i className="ti ti-x" /></button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '40px 0', color: '#bdbdbd', fontSize: 15, borderTop: '1px solid #e5e5e5' }}>Nothing saved yet.</div>
      )}
    </div>
  )
}

function IdeaInbox({ state, actions, dispatch }) {
  const onKey = (e) => { if (e.key === 'Enter') { e.preventDefault(); actions.addIdea() } }
  return (
    <div className="card" style={{ border: '1px solid #000', padding: '28px 30px', background: '#0E7C7B', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
        <span className="mono" style={{ fontSize: 12, color: 'rgba(255,255,255,.6)' }}>03</span>
        <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }}>Idea inbox</h2>
        <span className="mono" style={{ fontSize: 11, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>{state.ideaInbox.length} parked</span>
      </div>
      <p style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', lineHeight: 1.5, marginBottom: 16 }}>Brain too loud? Dump it here. Hit enter, it's parked. Fire any one into the writer when you're ready.</p>
      <div style={{ display: 'flex', gap: 8 }}>
        <input type="text" placeholder="A thought, a phrase, half an idea…" value={state.ideaDraft} onChange={(e) => dispatch({ ideaDraft: e.target.value })} onKeyDown={onKey} style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.4)', color: '#fff' }} />
        <button onClick={actions.addIdea} style={{ flex: 'none', background: '#fff', color: '#0E7C7B', border: 'none', padding: '0 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>Park</button>
      </div>
      {state.ideaInbox.length > 0 ? (
        <div style={{ marginTop: 18, borderTop: '1px solid rgba(255,255,255,.25)', maxHeight: 360, overflow: 'auto' }}>
          {state.ideaInbox.map((i) => (
            <div key={i.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 0', borderBottom: '1px solid rgba(255,255,255,.18)' }}>
              <span style={{ flex: 1, fontSize: 15, lineHeight: 1.4 }}>{i.text}</span>
              <button onClick={() => actions.writeFromIdea(i)} className="mono" style={{ flex: 'none', fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: 'none', color: '#fff', cursor: 'pointer', borderBottom: '1px solid #fff' }}>Write →</button>
              <button onClick={() => actions.removeIdea(i.id)} style={{ flex: 'none', fontSize: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', cursor: 'pointer' }}><i className="ti ti-x" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ marginTop: 18, padding: '32px 0', borderTop: '1px solid rgba(255,255,255,.25)', color: 'rgba(255,255,255,.55)', fontSize: 14 }}>Inbox zero. Park your first thought above.</div>
      )}
    </div>
  )
}

export default function Generate({ state, vals, actions, dispatch }) {
  const { A, ON } = vals
  return (
    <div>
      {/* mode switch */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 32px', marginBottom: 44 }}>
        {GEN_MODES.map(([k, label]) => (
          <button key={k} onClick={() => dispatch({ genMode: k, output: '', ideas: [], outKind: '', justCopied: false })} style={genModeWord(state.genMode === k, A)}>{label}</button>
        ))}
      </div>

      {/* 01 Compose — input/output grid framed as a card */}
      <div className="card" style={{ border: '1px solid #000', padding: '34px 36px' }}>
        <div style={{ marginBottom: 34 }}><CardHead num="01" title="Compose" /></div>
        <div className="grid2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
          <div>
            <Inputs state={state} vals={vals} actions={actions} dispatch={dispatch} />
            <button onClick={actions.doGenerate} style={genBtn(state.generating, A, ON)}>
              {state.generating && <Spinner />}
              <span>{vals.genBtnLabel}</span>
              <i className="ti ti-arrow-right" style={{ fontSize: 18 }} />
            </button>
          </div>
          <div>
            <Output state={state} vals={vals} actions={actions} />
          </div>
        </div>
      </div>

      {/* 02 Library + 03 Idea Inbox */}
      <div className="grid2" style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <Library state={state} vals={vals} actions={actions} dispatch={dispatch} />
        <IdeaInbox state={state} actions={actions} dispatch={dispatch} />
      </div>
    </div>
  )
}
