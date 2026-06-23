import { PERSONA } from './prompts.js'

// Single text-completion entry point for every AI feature in the app.
//
// Resolution order:
//   1. `window.claude.complete` — the prototype/artifact runtime, if present.
//   2. A backend endpoint (default `/api/complete`, see `api/complete.js`) that
//      proxies to a model provider. Override with `VITE_AI_ENDPOINT`.
//   3. A graceful fallback string so the UI never throws when no provider is wired.
//
// The PERSONA (Marcos's voice + rules) is prepended to every call.

const ENDPOINT = import.meta.env.VITE_AI_ENDPOINT || '/api/complete'

export async function ask(prompt) {
  const content = PERSONA + '\n\n---\n\n' + prompt

  // 1. Native artifact runtime.
  if (typeof window !== 'undefined' && window.claude && window.claude.complete) {
    try {
      return await window.claude.complete({ messages: [{ role: 'user', content }] })
    } catch (e) {
      return `Generation hit a snag — try again. (${e.message})`
    }
  }

  // 2. Backend proxy.
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ system: PERSONA, prompt }),
    })
    if (res.ok) {
      const data = await res.json()
      if (data && typeof data.text === 'string') return data.text
    }
  } catch (e) {
    // fall through to the offline message below
  }

  // 3. No provider configured.
  return 'Live generation needs a model provider. Set VITE_AI_ENDPOINT or deploy the /api/complete function with an ANTHROPIC_API_KEY.'
}
