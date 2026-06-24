import { useEffect, useReducer, useRef } from 'react'
import { loadState, persistState } from '../lib/storage.js'
import { loadCloud, saveCloud } from '../lib/cloud.js'

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
  pulse: '', pulseLoading: false, feed: [], pulseStage: '', feedStatus: '',
  imgPrompt: '', imgLoading: false, imgCopied: false,
  ideaInbox: [], ideaDraft: '',
}

function reducer(state, action) {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

// One state object, patched in place. Rehydrated from localStorage immediately,
// then (when signed in) from the user's cloud row, which is the cross-device
// source of truth. Local writes go to localStorage always and to the cloud on a
// debounce — but only after cloud hydration, so a fresh device never clobbers
// good cloud data with its empty defaults.
export function useStore(userId) {
  const [state, rawDispatch] = useReducer(reducer, initialState, (init) => {
    const saved = loadState()
    return saved ? { ...init, ...saved } : init
  })

  const dispatch = useRef((payload) => rawDispatch({ type: 'patch', payload })).current
  const stateRef = useRef(state)
  stateRef.current = state

  const saveTimer = useRef(null)
  const hydratedUser = useRef(null)

  // Cloud hydrate whenever the signed-in user changes.
  useEffect(() => {
    if (!userId) return
    let cancelled = false
    loadCloud(userId).then((remote) => {
      if (cancelled) return
      hydratedUser.current = userId
      if (remote) {
        dispatch(remote) // cloud wins across devices
      } else {
        saveCloud(userId, stateRef.current) // first sign-in: seed from local
      }
    })
    return () => { cancelled = true }
  }, [userId])

  // Persist: localStorage immediately; cloud debounced (post-hydration only).
  useEffect(() => {
    persistState(state)
    if (userId && hydratedUser.current === userId) {
      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => saveCloud(userId, state), 800)
    }
  }, [state, userId])

  return [state, dispatch]
}
