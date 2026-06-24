// Style-object builders ported from the prototype's inline CSS strings.
// Kept as functions so accent-dependent styling stays a pure derivation.

export const swatch = (color, on) => ({
  width: 18, height: 18, borderRadius: 0, border: '1px solid #000',
  background: color, cursor: 'pointer', padding: 0,
  boxShadow: on ? '0 0 0 2px #fff,0 0 0 3px #000' : 'none',
})

export const chip = (on, A, ON) => ({
  padding: '8px 16px', fontSize: 14, cursor: 'pointer', borderRadius: 0,
  border: `1px solid ${on ? A : '#000'}`, background: on ? A : '#fff',
  color: on ? ON : '#000', fontWeight: on ? 600 : 400,
})

export const moduleTab = (active, A) => ({
  background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px',
  fontSize: 14, fontWeight: 600, letterSpacing: '.02em',
  color: active ? '#000' : '#9e9e9e', lineHeight: 1,
  borderBottom: `2px solid ${active ? A : 'transparent'}`, marginBottom: -1,
})

export const heroTitle = (A, ON) => ({
  display: 'inline', fontSize: 104, lineHeight: 1.16, fontWeight: 800,
  letterSpacing: '-.05em', textTransform: 'uppercase', background: A, color: ON,
  padding: '0 18px 6px', marginLeft: -18,
  boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone',
})

export const genModeWord = (active, A) => ({
  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
  fontSize: 28, fontWeight: 800, letterSpacing: '-.03em',
  textTransform: 'uppercase', lineHeight: 1, color: active ? '#000' : '#dcdcdc',
  ...(active ? {
    textDecoration: 'underline', textDecorationColor: A,
    textUnderlineOffset: 6, textDecorationThickness: 3,
  } : {}),
})

export const typeRow = (on) => ({
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  background: 'none', border: 'none', borderBottom: '1px solid #e5e5e5',
  cursor: 'pointer', padding: '14px 0', fontSize: 20, fontWeight: on ? 700 : 400,
  letterSpacing: '-.01em', color: '#000', textAlign: 'left',
})

export const typeMark = (on, A) => ({
  width: 12, height: 12, border: `1px solid ${on ? A : '#000'}`,
  background: on ? A : '#fff', flex: 'none',
})

export const genBtn = (generating, A, ON) => ({
  display: 'inline-flex', alignItems: 'center', gap: 14, marginTop: 48,
  padding: '18px 40px', background: A, color: ON, border: 'none',
  fontSize: 18, fontWeight: 700, cursor: generating ? 'default' : 'pointer',
})

export const ghostBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8, background: 'none',
  border: '1px solid #000', padding: '9px 18px', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', color: '#000',
}

export const accentBtn = (A, ON) => ({
  display: 'inline-flex', alignItems: 'center', gap: 9, padding: '13px 26px',
  background: A, color: ON, border: 'none', fontSize: 15, fontWeight: 700,
  cursor: 'pointer',
})

export const mic = (active, A, ON) => ({
  display: 'inline-flex', alignItems: 'center', gap: 5,
  background: active ? A : '#fff', color: active ? ON : '#000',
  border: '1px solid #000', padding: '5px 11px', fontSize: 10, fontWeight: 600,
  letterSpacing: '.08em', textTransform: 'uppercase', cursor: 'pointer',
  borderRadius: 0, fontFamily: "'Geist Mono', monospace",
})

export const weekDot = (active, committed, A) => ({
  width: 18, height: 18, borderRadius: 0, border: `1px solid ${active ? A : '#000'}`,
  background: active ? A : '#fff', cursor: committed ? 'default' : 'pointer', flex: 'none',
})

export const logYes = (on, A, ON) => ({
  display: 'flex', alignItems: 'center', gap: 6, padding: '11px 20px',
  fontSize: 14, fontWeight: 600, cursor: 'pointer', border: 'none',
  borderRight: '1px solid #000', background: on ? A : '#fff', color: on ? ON : '#000',
})

export const logNo = (on) => ({
  padding: '11px 20px', fontSize: 14, cursor: 'pointer', border: 'none',
  background: on ? '#000' : '#fff', color: on ? '#fff' : '#9e9e9e',
})

export const logSave = (saved, A, ON) => ({
  flex: 'none', padding: '13px 24px', fontSize: 14, fontWeight: 700,
  cursor: 'pointer', border: saved ? '1px solid #000' : 'none',
  background: saved ? '#fff' : A, color: saved ? '#000' : ON,
})

export const analyzeBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px',
  fontSize: 14, fontWeight: 600, cursor: 'pointer', border: '1px solid #000',
  background: '#000', color: '#fff',
}

export const glanceDot = (done, A) => ({
  width: 9, height: 9, flex: 'none', border: '1px solid #000',
  background: done ? A : '#fff',
})

// Confidence chip on Pulse feed items (High = filled, Medium = transparent).
export const confChip = (high) => ({
  fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase',
  padding: '2px 7px', border: '1px solid #000', color: '#000',
  background: high ? 'rgba(0,0,0,.12)' : 'transparent',
})

// Shared mono-text-button (Grade / Copy / Save / Reuse, etc.)
export const monoTextBtn = {
  fontSize: 11, letterSpacing: '.1em', textTransform: 'uppercase',
  background: 'none', border: 'none', cursor: 'pointer',
  borderBottom: '1px solid #000', paddingBottom: 1,
}
