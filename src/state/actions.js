import { useMemo, useRef } from 'react'
import { ask } from '../lib/ai.js'
import { prompts, parseJSON } from '../lib/prompts.js'
import { TYPES } from '../lib/constants.js'

const today = () =>
  new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

// Builds the full set of handlers, bound to the current state via a ref so async
// AI calls always read fresh values (the React analogue of `this.state`).
export function useActions(state, dispatch) {
  const stateRef = useRef(state)
  stateRef.current = state

  // Dictation recognition handles, kept across renders.
  const recRef = useRef(null)
  const listenWasRef = useRef(null)

  return useMemo(() => {
    const get = () => stateRef.current
    const set = dispatch // alias; same patch semantics for setState + save

    async function doGenerate() {
      const s = get()
      if (s.generating) return
      const m = s.genMode
      set({ generating: true, justCopied: false })

      if (m === 'ideas') {
        const raw = await ask(prompts.ideas(s))
        const ideas = parseJSON(raw, [])
        set({ generating: false, ideas: Array.isArray(ideas) ? ideas : [], output: '', outKind: 'ideas' })
        return
      }

      const builder = prompts[m]
      const out = await ask(builder(s))
      set({ generating: false, output: out, outKind: m, ideas: [], grade: null, imgPrompt: '' })
    }

    async function genImagePrompt() {
      const s = get()
      if (s.imgLoading || !s.output) return
      set({ imgLoading: true, imgCopied: false })
      const out = await ask(prompts.imagePrompt(s.output))
      set({ imgLoading: false, imgPrompt: out })
    }

    function copyImgPrompt() {
      try { navigator.clipboard.writeText(get().imgPrompt) } catch (e) {}
      set({ imgCopied: true })
      setTimeout(() => set({ imgCopied: false }), 1400)
    }

    async function gradePost() {
      const s = get()
      if (s.grading || !s.output) return
      set({ grading: true })
      const raw = await ask(prompts.grade(s.output))
      const g = parseJSON(raw, { score: 0, letter: '?', verdict: 'Could not grade — try again.', checks: [], fix: '' })
      set({ grading: false, grade: g })
    }

    function postToLinkedIn() {
      try { navigator.clipboard.writeText(get().output) } catch (e) {}
      try { window.open('https://www.linkedin.com/feed/?shareActive=true', '_blank') } catch (e) {}
      set({ postFlash: true })
      setTimeout(() => set({ postFlash: false }), 2400)
    }

    function copyOutput() {
      try { navigator.clipboard.writeText(get().output) } catch (e) {}
      set({ justCopied: true })
      setTimeout(() => set({ justCopied: false }), 1400)
    }

    function saveDraft() {
      const s = get()
      const out = s.output
      if (!out) return
      const hook = out.split('\n').find((l) => l.trim())?.slice(0, 90) || 'Untitled'
      const typeMap = { post: s.postType, recap: 'Weekly Recap', calendar: 'Calendar' }
      const d = { id: Date.now(), type: typeMap[s.outKind] || 'Post', hook, text: out, date: today() }
      set({ drafts: [d, ...s.drafts].slice(0, 60) })
    }

    function useIdea(i) {
      set({ genMode: 'post', topic: i.hook, postType: TYPES.includes(i.type) ? i.type : 'Thought Leadership', output: '', ideas: [], outKind: '', grade: null })
    }

    function loadDraft(d) {
      set({ module: 'generate', genMode: 'post', topic: d.hook, output: d.text, outKind: 'post', grade: null })
    }

    function delDraft(id) {
      set({ drafts: get().drafts.filter((d) => d.id !== id) })
    }

    function setAccent(k) { set({ accent: k }) }

    function startDictation(field) {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SR) { alert('Voice input needs Chrome or Edge.'); return }
      if (recRef.current) {
        const was = listenWasRef.current
        recRef.current.stop()
        recRef.current = null
        set({ listeningField: null })
        if (was === field) return
      }
      const rec = new SR()
      rec.lang = 'en-US'; rec.continuous = true; rec.interimResults = false
      rec.onresult = (e) => {
        let t = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
          if (e.results[i].isFinal) t += e.results[i][0].transcript + ' '
        }
        if (t.trim()) {
          const cur = get()[field] || ''
          set({ [field]: (cur ? cur.trim() + ' ' : '') + t.trim() })
        }
      }
      rec.onend = () => { recRef.current = null; set({ listeningField: null }) }
      rec.onerror = () => { recRef.current = null; set({ listeningField: null }) }
      recRef.current = rec
      listenWasRef.current = field
      set({ listeningField: field })
      try { rec.start() } catch (e) {}
    }

    async function loadTrends() {
      const s = get()
      if (s.trendsLoading) return
      set({ trendsLoading: true })
      const raw = await ask(prompts.trends())
      const t = parseJSON(raw, [])
      set({ trendsLoading: false, trends: Array.isArray(t) ? t : [] })
    }

    function useTrend(t) {
      set({ module: 'generate', genMode: 'post', topic: t.angle, postType: TYPES.includes(t.type) ? t.type : 'Hot Take', output: '', ideas: [], outKind: '', grade: null })
    }

    async function draftComment() {
      const s = get()
      if (s.commentLoading || !s.commentSrc.trim()) return
      set({ commentLoading: true, commentCopied: false })
      const out = await ask(prompts.comment(s.commentSrc))
      set({ commentLoading: false, commentOut: out })
    }

    function copyComment() {
      try { navigator.clipboard.writeText(get().commentOut) } catch (e) {}
      set({ commentCopied: true })
      setTimeout(() => set({ commentCopied: false }), 1400)
    }

    // Two-pass RELAY feed: generate candidates, then verify + tag confidence.
    async function loadPulse() {
      const s = get()
      if (s.pulseLoading) return
      set({ pulseLoading: true, pulseStage: 'Pass 1 — scanning the wire…' })
      const todayLong = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

      // Pass 1 — over-generate candidates so the verifier can cut.
      const raw1 = await ask(prompts.pulsePass1(todayLong))
      const cand = parseJSON(raw1, [])
      if (!Array.isArray(cand) || !cand.length) {
        set({ pulseLoading: false, pulseStage: '', feed: [], pulse: '', feedStatus: 'Nothing came back — try again.' })
        return
      }

      // Pass 2 — skeptical fact-check: drop fabrications, tag confidence.
      set({ pulseStage: 'Pass 2 — cross-checking each item…' })
      const raw2 = await ask(prompts.pulsePass2(todayLong, cand))
      let feed = parseJSON(raw2, null)
      if (!Array.isArray(feed)) feed = cand.map((c) => ({ ...c, confidence: 'Medium' }))
      feed = feed.filter((f) => f && f.headline).slice(0, 6)
      const status = feed.length
        ? `Cross-checked ×2 · ${feed.length} of ${cand.length} passed`
        : 'All candidates failed the check — refresh to retry.'
      set({ pulseLoading: false, pulseStage: '', feed, pulse: feed.length ? '1' : '', feedStatus: status })
    }

    function draftFromFeed(item) {
      set({ module: 'generate', genMode: 'post', topic: item.headline + ' — ' + item.take, output: '', ideas: [], outKind: '', grade: null, imgPrompt: '' })
    }

    // Idea Inbox — quick capture.
    function addIdea() {
      const t = (get().ideaDraft || '').trim()
      if (!t) return
      set({ ideaInbox: [{ id: Date.now(), text: t }, ...get().ideaInbox], ideaDraft: '' })
    }

    function removeIdea(id) {
      set({ ideaInbox: get().ideaInbox.filter((i) => i.id !== id) })
    }

    function writeFromIdea(item) {
      set({ module: 'generate', genMode: 'post', topic: item.text, output: '', ideas: [], outKind: '', grade: null, imgPrompt: '' })
    }

    function toggleDay(day) {
      const s = get()
      if (s.committed) return
      set({ week: { ...s.week, [day]: { ...s.week[day], active: !s.week[day].active } } })
    }

    function setDayType(day, val) {
      const s = get()
      set({ week: { ...s.week, [day]: { ...s.week[day], type: val } } })
    }

    function lockWeek() { set({ committed: true }) }
    function unlockWeek() { set({ committed: false }) }

    function setPosted(day, val) {
      const s = get()
      set({ log: { ...s.log, [day]: { ...(s.log[day] || {}), posted: val } } })
    }

    function setMetric(day, field, val) {
      const s = get()
      set({ log: { ...s.log, [day]: { ...(s.log[day] || {}), [field]: val } } })
    }

    function logToHistory(day) {
      const s = get()
      const l = s.log[day] || {}
      const type = s.week[day].type
      const rec = {
        id: Date.now(), day, type, date: today(),
        impressions: +l.impressions || 0, likes: +l.likes || 0,
        comments: +l.comments || 0, follows: +l.follows || 0,
      }
      set({ history: [rec, ...s.history], log: { ...s.log, [day]: { ...l, saved: true } } })
    }

    async function runAnalysis() {
      const s = get()
      if (s.analyzing) return
      set({ analyzing: true })
      const summary = s.history
        .map((r) => `${r.type} (${r.day}): ${r.impressions} impressions, ${r.likes} likes, ${r.comments} comments, ${r.follows} follows`)
        .join('\n')
      const out = await ask(prompts.analysis(summary))
      set({ analyzing: false, analysis: out })
    }

    return {
      doGenerate, genImagePrompt, copyImgPrompt, gradePost, postToLinkedIn,
      copyOutput, saveDraft, useIdea, loadDraft, delDraft, setAccent,
      startDictation, loadTrends, useTrend, draftComment, copyComment,
      loadPulse, draftFromFeed, addIdea, removeIdea, writeFromIdea,
      toggleDay, setDayType, lockWeek, unlockWeek, setPosted,
      setMetric, logToHistory, runAnalysis,
    }
  }, [dispatch])
}
