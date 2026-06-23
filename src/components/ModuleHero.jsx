import { heroTitle } from '../lib/styles.js'

export default function ModuleHero({ vals }) {
  return (
    <>
      <div style={{ padding: '36px 0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 40 }}>
        <h1 style={heroTitle(vals.A, vals.ON)}>{vals.headerTitle}</h1>
        <p style={{ fontSize: 15, color: '#000', maxWidth: 300, lineHeight: 1.45, paddingBottom: 10 }}>{vals.headerDesc}</p>
      </div>
      <div style={{ borderBottom: '1px solid #000', marginBottom: 40 }} />
    </>
  )
}
