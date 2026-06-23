# Múul — LinkedIn Content System

A personal LinkedIn content operating system for a solo founder. It closes the
full loop: **decide what to post → write it in voice → grade it → commit to a
schedule → log what shipped + metrics → analyze what's working.**

Stark black-and-white editorial aesthetic — huge uppercase display type, 1px
hairline rules, zero border-radius — with a single user-selectable accent color
used sparingly for active states and primary actions.

This is a React recreation of the design handoff prototype (`Múul.dc.html`),
built with Vite. The prototype remains the source of truth for copy, layout, and
interactions.

## Stack

- **React 18** + **Vite 5** — no router (single-page, module-switched via state).
- **Plain JS + inline styles**, ported faithfully from the prototype so the
  black-and-white editorial design stays pixel-accurate.
- **localStorage** persistence under `marcos_cs_mono_v1`.
- **Anthropic Messages API** behind a serverless `/api/complete` function for all
  AI generation.
- Fonts: **Geist** / **Geist Mono** (Google Fonts). Icons: **Tabler Icons** webfont.

## Run it

```bash
npm install
npm run dev        # Vite dev server (UI only — AI calls need the backend, below)
npm run build      # production build to dist/
npm run preview    # serve the production build
```

The UI runs fully without a model provider; AI features degrade gracefully with a
clear message until one is wired.

### Wiring AI generation

Every AI feature (write, grade, ideas, recap, calendar, trend angles, comment,
pulse, image prompt, strategist analysis) flows through one entry point:
`src/lib/ai.js` → `ask(prompt)`. It resolves a provider in this order:

1. `window.claude.complete` — the artifact runtime, if present.
2. A backend endpoint (default `/api/complete`) — the production path.
3. A graceful fallback string.

The included `api/complete.js` is a Vercel-style serverless function that proxies
to Anthropic, keeping the API key server-side. To run the full app locally:

```bash
cp .env.example .env            # add your ANTHROPIC_API_KEY
npm i -g vercel && vercel dev   # serves Vite + /api/complete together
```

To deploy, push to Vercel and set `ANTHROPIC_API_KEY` (and optionally `AI_MODEL`)
in the project's environment variables. To use a different provider or backend,
point `VITE_AI_ENDPOINT` at any endpoint that accepts `{ system, prompt }` and
returns `{ text }`.

## Architecture

```
index.html              Fonts + icon webfont + #root
api/complete.js         Serverless AI proxy (Anthropic)
src/
  main.jsx              React entry
  index.css             Global chrome (ported from the prototype <style>)
  App.jsx               Root: store + actions + selectors → module switch
  lib/
    constants.js        DAYS, TYPES, TONES, accent system, hero copy
    prompts.js          PERSONA + every prompt builder + defensive JSON parse
    ai.js               ask() — the single completion entry point
    storage.js          localStorage load/persist (transient fields excluded)
    styles.js           Accent-aware inline-style builders
  state/
    store.js            useReducer + persistence (the component state object)
    actions.js          All mutations, AI orchestration, voice dictation
    selectors.js        derive(state) — pure view-model (the renderVals analogue)
  components/
    Header, ModuleHero, Today, Generate, Commit, Log, Analyze, Mic, Spinner
```

The prototype's logic class maps almost 1:1: `state` → `store.js`, its methods →
`actions.js`, and `renderVals()` → `selectors.js`.

## The five modules

- **01 Today** — daily launchpad: the one job, "Ride the wave" trend angles, a
  comment drafter, and the evergreen "Pulse" briefing.
- **02 Generate** — write posts / ideas / recaps / calendars in voice; grade
  against the rules; create image prompts; save to a draft library.
- **03 Commit** — pick posting days, lock the week, create content debt.
- **04 Log** — did you post? metrics in. Pushes records into history.
- **05 Analyze** — leaderboard + a strategist read of the logged numbers.

## Notes

- **Voice dictation** uses the browser Web Speech API (Chrome / Edge only).
- **LinkedIn handoff** copies the post and opens LinkedIn's composer — there is no
  real auto-posting (that needs the LinkedIn API + a backend; v2).
- The "Pulse" and "Ride the wave" features are model knowledge, **not** a live feed.
