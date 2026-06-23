import { mic as micStyle } from '../lib/styles.js'

// Voice-dictation toggle. Turns accent-colored while listening.
export default function Mic({ field, listeningField, A, ON, onToggle }) {
  const active = listeningField === field
  return (
    <button onClick={() => onToggle(field)} style={micStyle(active, A, ON)}>
      <i className="ti ti-microphone" />
      {active ? 'Listening… stop' : 'Dictate'}
    </button>
  )
}
