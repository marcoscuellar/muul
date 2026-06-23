// Serverless text-completion endpoint (Vercel-style: `/api/complete`).
//
// The frontend POSTs { system, prompt } and expects { text }. This proxies to
// the Anthropic Messages API so the API key never reaches the browser. It is the
// production swap-in for the prototype's `window.claude.complete`.
//
// Env:
//   ANTHROPIC_API_KEY  (required)
//   AI_MODEL           (optional, default below)
//
// Locally, run with `vercel dev` so this route is served alongside Vite.

const MODEL = process.env.AI_MODEL || 'claude-sonnet-4-6'
const MAX_TOKENS = 1500

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    res.status(500).json({ error: 'ANTHROPIC_API_KEY is not configured.' })
    return
  }

  try {
    const { system, prompt } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}
    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt.' })
      return
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        system: system || undefined,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!r.ok) {
      const detail = await r.text()
      res.status(502).json({ error: 'Upstream model error', detail })
      return
    }

    const data = await r.json()
    const text = (data.content || [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')

    res.status(200).json({ text })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}
