// Domain constants — lifted verbatim from the prototype logic class.

export const STORAGE_KEY = 'marcos_cs_mono_v1'

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export const TYPES = [
  'Thought Leadership',
  'Founder Story',
  'AI Insight',
  'Security Tip',
  'Recruiting Tip',
  'Hot Take',
]

export const CAL_TYPES = [
  'Thought Leadership',
  'Founder Story',
  'AI Insight',
  'Security Tip',
  'Recruiting Tip',
  'Hot Take',
  'Weekly Recap',
]

export const TONES = [
  'Direct & Bold',
  'Educational',
  'Conversational',
  'Provocative',
]

// Accent system: key -> hex. Text placed ON the accent is white, except yellow.
export const ACC = {
  ink: '#000000',
  teal: '#0E7C7B',
  navy: '#1B2A5B',
  red: '#D7263D',
  yellow: '#E0A500',
}

export const ACC_ORDER = [
  ['ink', 'Ink'],
  ['teal', 'Teal'],
  ['navy', 'Navy'],
  ['red', 'Red'],
  ['yellow', 'Yellow'],
]

// Resolve the active accent + the text color that sits on top of it.
export function theme(accent) {
  const A = ACC[accent] || '#000'
  const ON = accent === 'yellow' ? '#000' : '#fff'
  return { A, ON }
}

// Module hero copy: [title, description].
export const HEADS = {
  today: ['Today', "What to post, who to talk to, what's moving — your daily launchpad."],
  generate: ['Generate', 'Posts, ideas, recaps, calendars — in your voice. Save the keepers.'],
  commit: ['Commit', 'Pick your days. Lock the week. Owe yourself the posts.'],
  log: ['Log', 'Did you post? One tap. Drop the numbers. The accountability layer.'],
  analyze: ['Analyze', 'What type wins. What day works. What to double down on.'],
}

export const MODULES = [
  ['today', '01', 'Today'],
  ['generate', '02', 'Generate'],
  ['commit', '03', 'Commit'],
  ['log', '04', 'Log'],
  ['analyze', '05', 'Analyze'],
]

export const GEN_MODES = [
  ['post', 'Write'],
  ['ideas', 'Ideas'],
  ['recap', 'Recap'],
  ['calendar', 'Calendar'],
]
