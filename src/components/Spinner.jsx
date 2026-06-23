// The 12px rotating ring. `dark` flips it to a black ring on light buttons.
export default function Spinner({ dark = false }) {
  return (
    <span
      className="spin"
      style={dark ? { borderColor: 'rgba(0,0,0,.25)', borderTopColor: '#000' } : undefined}
    />
  )
}
