// The "NN Title" card header used to frame modules consistently
// (01 Compose, 01 Your week, 02 Leaderboard, …).
export default function CardHead({ num, title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
      <span className="mono" style={{ fontSize: 12, color: '#9e9e9e' }}>{num}</span>
      <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.02em', textTransform: 'uppercase', lineHeight: 1 }}>{title}</h2>
    </div>
  )
}
