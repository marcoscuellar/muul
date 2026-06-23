import { useEffect, useReducer, useRef } from 'react'
import { loadState, persistState } from '../lib/storage.js'

export const initialState = {
  module: 'today', genMode: 'post',
  topic: '', postType: 'Thought Leadership', tone: 'Direct & Bold',
  ideasTopic: '', recapNotes: '', calTopic: '',
  generating: false, output: '', outKind: '', ideas: [], justCopied: false,
  drafts: [], search: '',
  week: {
    Mon: { active: true, type: 'Thought Leadership' },
    Tue: { active: false, type: 'AI Insight' },
    Wed: { active: true, type: 'AI Insight' },
    Thu: { active: false, type: 'Recruiting Tip' },
    Fri: { active: true, type: 'Weekly Recap' },
    Sat: { active: false, type: 'Hot Take' },
    Sun: { active: false, type: 'Founder Story' },
  },
  committed: false,
  log: {}, history: [],
  analysis: '', analyzing: false,
  accent: 'teal', grade: null, grading: false, postFlash: false,
  trends: [], trendsLoading: false,
  commentSrc: '', commentOut: '', commentLoading: false, commentCopied: false,
  pulse: '', pulseLoading: false,
  imgPrompt: '', imgLoading: false, imgCopied: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// Mirrors the prototype's component state: one object, patched in place,
// rehydrated from and persisted to localStorage (transient fields excluded).
export function useStore() {
  const [state, rawDispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadState()
    return saved ? { ...init, ...saved } : init
  })

  // Stable patch dispatcher.
  const dispatch = useRef((payload) => rawDispatch({ type: 'patch', payload })).current

  // Persist on every change (transient fields are filtered inside persistState).
  useEffect(() => {
    persistState(state)
  }, [state])

  return [state, dispatch]
}
