import { DAYS, TYPES, CAL_TYPES, theme, HEADS } from '../lib/constants.js'

const fmt = (n) =>
  n >= 1000 ? (n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0) + 'k' : '' + Math.round(n)

// Pure derivation of everything the views need — the React analogue of
// the prototype's renderVals(). Handlers are wired in the components.
export function derive(s) {
  const { A, ON } = theme(s.accent)

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })

  const [headerTitle, headerDesc] = HEADS[s.module]

  // schedule-derived
  const activeDays = DAYS.filter((d) => s.week[d].active)
  const contentDebt = activeDays.length
  const postedCount = activeDays.filter((d) => s.log[d] && s.log[d].posted === true).length

  // today
  const todayKey = DAYS[(new Date().getDay() + 6) % 7] // Mon-first
  const todW = s.week[todayKey]
  const todPosted = s.log[todayKey] && s.log[todayKey].posted === true
  const todayJob = !todW || !todW.active
    ? 'Rest day — nothing owed'
    : (todPosted ? todW.type + ' — shipped ✓' : todW.type)
  const todayDone = !!todPosted
  const todayCta = todayDone ? 'Write another' : (todW && todW.active ? 'Write it' : 'Write anyway')

  const weekGlance = activeDays.map((d) => {
    const done = s.log[d] && s.log[d].posted === true
    const skip = s.log[d] && s.log[d].posted === false
    return {
      day: d, type: s.week[d].type, done,
      dayColor: done ? '#000' : '#737373',
      txtColor: done ? '#000' : '#555',
      status: done ? 'Shipped' : (skip ? 'Skipped' : 'Open'),
      statusColor: done ? A : (skip ? '#bdbdbd' : '#9e9e9e'),
    }
  })

  // generate output state
  const showTextOut = !!s.output && s.outKind !== 'ideas'
  const showIdeasOut = s.outKind === 'ideas' && s.ideas.length > 0
  const showOutEmpty = !showTextOut && !showIdeasOut
  const outLabels = { post: 'LinkedIn post', recap: 'Weekly recap', calendar: 'Content calendar' }
  const outLabel = outLabels[s.outKind] || 'Output'

  // library
  const q = s.search.trim().toLowerCase()
  const draftsF = q ? s.drafts.filter((d) => (d.hook + ' ' + d.type + ' ' + d.text).toLowerCase().includes(q)) : s.drafts

  // week list (commit)
  const weekViews = DAYS.map((day) => {
    const w = s.week[day]
    return { day, active: w.active, type: w.type, options: CAL_TYPES, locked: s.committed, opacity: w.active ? 1 : 0.4 }
  })

  // log
  const logViews = activeDays.map((day) => {
    const l = s.log[day] || {}
    const posted = l.posted
    return {
      day, type: s.week[day].type,
      yesOn: posted === true, noOn: posted === false, showMetrics: posted === true,
      impressions: l.impressions || '', likes: l.likes || '', comments: l.comments || '', follows: l.follows || '',
      saved: !!l.saved, saveLabel: l.saved ? 'Saved' : 'Save',
    }
  })

  // analyze aggregates
  const h = s.history
  const hasHistory = h.length > 0
  const byType = {}, byDay = {}
  h.forEach((r) => { (byType[r.type] = byType[r.type] || []).push(r); (byDay[r.day] = byDay[r.day] || []).push(r) })
  const avg = (arr, f) => (arr.length ? arr.reduce((a, r) => a + f(r), 0) / arr.length : 0)
  const typeStats = Object.entries(byType)
    .map(([type, arr]) => ({ type, count: arr.length, impRaw: avg(arr, (r) => r.impressions), imp: fmt(avg(arr, (r) => r.impressions)), eng: Math.round(avg(arr, (r) => r.likes + r.comments)) }))
    .sort((a, b) => b.impRaw - a.impRaw)
  const dayStats = Object.entries(byDay)
    .map(([day, arr]) => ({ day, impRaw: avg(arr, (r) => r.impressions) }))
    .sort((a, b) => b.impRaw - a.impRaw)

  // grade panel
  const g = s.grade
  const grade = g ? {
    letter: g.letter, score: g.score, verdict: g.verdict,
    hasFix: !!(g.fix && ('' + g.fix).trim()), fix: g.fix,
    checks: (g.checks || []).map((c) => ({ mark: c.pass ? '✓' : '✕', label: c.label, note: c.note || '' })),
  } : null

  const genLabels = { post: 'Generate', ideas: 'Get 6 angles', recap: 'Write recap', calendar: 'Build week' }

  return {
    A, ON, todayStr, headerTitle, headerDesc,
    activeDays, contentDebt, postedCount,
    todayJob, todayDone, todayCta, debtLeft: contentDebt - postedCount,
    weekGlance,
    showTextOut, showIdeasOut, showOutEmpty, outLabel,
    draftsF, hasDrafts: draftsF.length > 0,
    weekViews, logViews,
    hasHistory,
    typeStats,
    topType: typeStats[0] ? typeStats[0].type : '—',
    topTypeAvg: typeStats[0] ? fmt(typeStats[0].impRaw) : '0',
    topDay: dayStats[0] ? dayStats[0].day : '—',
    topDayAvg: dayStats[0] ? fmt(dayStats[0].impRaw) : '0',
    avgEng: Math.round(avg(h, (r) => r.likes + r.comments)),
    grade,
    // labels
    genBtnLabel: s.generating ? 'Writing' : genLabels[s.genMode],
    gradeLabel: s.grading ? 'Grading…' : (s.grade ? 'Re-grade' : 'Grade'),
    copyLabel: s.justCopied ? 'Copied' : 'Copy',
    postLabel: s.postFlash ? 'Copied — paste in LinkedIn' : 'Post on LinkedIn',
    imgBtnLabel: s.imgLoading ? 'Writing prompt…' : (s.imgPrompt ? 'New image prompt' : 'Image prompt'),
    imgCopyLabel: s.imgCopied ? 'Copied' : 'Copy',
    trendsBtnLabel: s.trendsLoading ? 'Reading the room…' : (s.trends.length ? 'Fresh batch' : 'Give me angles'),
    commentBtnLabel: s.commentLoading ? 'Drafting…' : 'Draft my comment',
    commentCopyLabel: s.commentCopied ? 'Copied' : 'Copy comment',
    pulseBtnLabel: s.pulseLoading ? 'Pulling…' : (s.pulse ? 'Refresh' : 'Get the pulse'),
    analyzeBtnLabel: s.analyzing ? 'Reading' : 'Run analysis',
    commitStatus: s.committed ? 'LOCKED' : 'OPEN',
  }
}
