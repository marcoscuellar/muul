import { STORAGE_KEY } from './constants.js'

// Transient fields are never persisted (spinners, copy flashes, live dictation).
const TRANSIENT = new Set([
  'generating', 'analyzing', 'justCopied', 'grading', 'grade', 'postFlash',
  'imgLoading', 'imgCopied', 'listeningField',
  'trendsLoading', 'commentLoading', 'commentCopied', 'pulseLoading',
])

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    return null
  }
}

export function persistState(state) {
  try {
    const keep = {}
    for (const k of Object.keys(state)) {
      if (!TRANSIENT.has(k)) keep[k] = state[k]
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keep))
  } catch (e) {
    /* ignore quota / serialization errors */
  }
}
