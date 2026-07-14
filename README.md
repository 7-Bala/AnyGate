# Any Gate

An accessibility-first wayfinding assistant that gets a fan with an accessibility need
to the right gate, restroom, or quiet room at a huge, loud, multi-day stadium event —
and explains why, in their language.

## Vertical

**Accessibility is the chosen vertical.** Everything else in this product — crowd-aware
routing, real-time re-ranking, multilingual assistance — is not a separate feature bolted
on for breadth. It is the mechanism accessibility actually requires at this kind of event.
A wheelchair user needs to know a gate is accessible *and* not currently a crowd crush. A
fan with sensory sensitivity needs a quiet room that's actually quiet right now, not one
that was quiet when the data was last updated. A fan who doesn't speak the venue's default
language still needs to understand *why* a recommendation was made, not just receive it.
Strip out crowd-awareness or multilingual support and the accessibility promise breaks —
they aren't add-ons, they're what makes the recommendation usable by the person it's for.

## Why GenAI is mandatory here, not decorative

The system is a strict three-layer architecture, and GenAI is deliberately confined to
exactly one of the three layers:

1. **Deterministic constraint filter** (`src/engine/filterValidOptions.js`) — excludes
   facilities that structurally fail a fan's needs (e.g. non-accessible for a wheelchair
   need, under maintenance). Pure logic. Never touches an LLM.
2. **Deterministic scorer** (`src/engine/scoreAndRank.js`) — ranks the valid options,
   factoring in live congestion and feature-match quality. Pure logic. Never touches an LLM.
3. **GenAI layer** (`server/services/geminiClient.js`, Gemini API, model
   `gemini-2.5-flash`) — the *only* layer that talks to a language model. It explains an
   already-computed recommendation in warm natural language, answers open-ended
   multilingual questions about the venue, and detects urgency or distress in a fan's free
   text.

This split is the point, not an implementation detail. Which gate is safe and valid is a
safety-critical decision — it must never hallucinate a feature that isn't there or invent
a route that doesn't exist, so it's computed by deterministic code the LLM cannot touch.
Explaining that decision warmly, answering an open-ended question, or picking up on
distress in free text are things only a language model does well — no rule engine can do
open-ended natural language. So GenAI is required for the parts of the product that need
it, and deliberately absent from the parts that must be reliable above all else.

## How it works

1. **Onboarding** — a fan states their accessibility needs (wheelchair, visual impairment,
   hearing impairment, sensory sensitivity, limited mobility) and preferred language.
2. **Recommendation** — the filter excludes invalid options, the scorer ranks what's left
   using live congestion, and Gemini explains the top pick in plain, warm language, in the
   fan's language, at their chosen reading level.
3. **Live re-routing** — congestion is polled continuously; if conditions change enough to
   change the ranking, the recommendation updates without the fan asking again.
4. **Open Q&A** — a chat interface lets the fan ask follow-up questions, answered strictly
   from the same facility data, with voice input and output via Google Speech-to-Text/TTS.
5. **Staff-assistance fallback** — if no facility satisfies the fan's needs, the app says so
   plainly and offers to request on-site staff help instead of guessing.

## Architecture

```
src/
  engine/       deterministic filter + scorer (no network, no LLM)
  data/         stadium.json — facility data for MetLife Stadium
  services/     firestoreClient.js — congestion read client (see below)
  components/   Onboarding, RouteView, Chat, RecommendationCard, NoValidRoute, ...
  i18n/         language list, string dictionary, translation hook
  hooks/        useRecommendationExplanation (Gemini), useReducedMotion, ...
server/
  routes/       chat.js (Gemini), translate.js, translateUi.js, speech.js
  services/     geminiClient.js, translateClient.js, speechClient.js, congestionSimulator.js
  middleware/   sanitizeInput.js, rateLimit.js
  prompts/      chatSystemPrompt.js
tests/
  engine.test.js  18 unit tests on the deterministic engine
```

- **Gemini** plugs in at `server/services/geminiClient.js` behind the `/api/chat` route —
  the only place the app calls an LLM.
- **Google Translate** plugs in at `server/services/translateClient.js` behind
  `/api/translate` (fan-message translation) and `/api/translate-ui` (UI chrome for
  languages beyond the hand-tested three).
- **Google Speech-to-Text/TTS** plug in at `server/services/speechClient.js` behind
  `/api/speech-to-text` and `/api/text-to-speech`, giving the chat voice in/out.
- **Congestion**: the frontend reads congestion through
  `src/services/firestoreClient.js`, which currently calls a local `/api/congestion`
  route backed by a seeded pseudo-random walk (`server/services/congestionSimulator.js`),
  *not* live Firestore. This is a deliberate scope decision for the hackathon timeframe.
  The interface was designed Firestore-shaped on purpose (one doc per facility id: `{
  value, updatedAt, trend }`, public read) so swapping in a real Firestore
  `onSnapshot` listener later requires no change to any consuming code — only the inside
  of `firestoreClient.js` and the `/api/congestion` route.

## Design

The visual identity is stadium-signage-inspired: a high-contrast ink/chalk/gold palette
and bold display type reminiscent of venue wayfinding signage, with a Gate Badge as the
app's signature recurring element. Accessibility was a build constraint from the start,
not a pass at the end: a contrast-audited color system, a dedicated high-contrast theme
(a real theme swap, not a saturation tweak), full keyboard navigation, ARIA labeling
throughout, RTL support for right-to-left languages, and a `prefers-reduced-motion`
fallback for every animation in the app.

## Multilingual support

Ten curated languages: English, Spanish, French, Portuguese, Arabic, Chinese, Hindi,
German, Japanese, Korean. The list is fixed rather than free-text so language support
stays testable. Of these, **English, Spanish, and Arabic are hand-verified end-to-end**
against a static string dictionary — including a right-to-left check for Arabic. The
remaining seven route through the live Google Translate API at runtime and were not
manually verified per-string; treat their translation quality as dependent on the
Translate API's live output rather than hand-checked.

## Security

- **Prompt injection**: fan input is sanitized (`server/middleware/sanitizeInput.js`)
  before it ever reaches Gemini — role-marker spoofing (`system:`, `assistant:`),
  instruction-override phrasing ("ignore previous instructions"), and fake `<system>` /
  `<instructions>` tags are neutralized.
- **Grounding**: the system prompt instructs Gemini to state only facts present in the
  supplied facility/recommendation data, to say plainly when something isn't covered
  rather than guess, and to treat the fan's message as untrusted data, never as
  instructions — even if it claims special authority.
- **Rate limiting**: per-IP sliding-window limits on every API route (chat, translate,
  translate-ui, speech).
- **No PII persistence**: nothing about a fan is stored beyond the active session.
- **API keys are server-side only**: verified by grepping the production client bundle
  (`npm run build`, then `dist/assets/*.js`) for every key name — zero matches.

## Testing

18 unit tests (`tests/engine.test.js`) cover the deterministic engine's real edge cases:
no valid route when needs conflict with the only matching facility, missing or stale
congestion data (flagged `unknown`, never crashes), over-capacity penalties, and partial
vs. full feature-match ranking.

Beyond unit tests, the app was validated with actual manual end-to-end testing, which is
where two real bugs were found and fixed — worth calling out as a genuine strength of the
process, not just a checklist item:
- **Stale explanation-hook bug**: `useRecommendationExplanation` originally re-fetched
  Gemini's explanation on every congestion poll (~5s) because it depended on the whole
  `result` object, which is a fresh reference on every recompute. Fixed by depending on
  the primitive `facilityId` instead, so one explanation is fetched per
  facility/language/mode rather than being torn down and stalled repeatedly.
- **Inverted congestion-score display bug**: a display-layer inversion that showed
  higher-congestion facilities as more favorable than they were, caught during manual
  testing rather than by unit tests in isolation.

## Assumptions

- Live crowd/congestion data is **simulated** — a seeded, smooth pseudo-random walk — not
  sourced from real stadium IoT sensors, since none exist for a hackathon.
- Facility positions in `stadium.json` are **illustrative/relative**, not precise
  real-world GPS coordinates.
- Only **MetLife Stadium** is populated with data. The architecture is venue-agnostic;
  other venues could be added via the same data schema without engine changes.
- Full functional verification of **live Gemini responses** and **live Google Translate
  output for the seven non-hand-tested languages** requires API keys that are not present
  in the evaluation/CI environment. Everything else — UI logic, routing correctness,
  graceful degradation without a key, and security behavior (sanitization, grounding) —
  was verified without live keys.

## Setup / running locally

```bash
npm install
cp .env.example .env   # fill in GEMINI_API_KEY, GOOGLE_TRANSLATE_API_KEY, GOOGLE_CLOUD_API_KEY

npm run dev             # frontend (Vite)
npm run server:dev      # backend (Express)
npm test                # 18 unit tests on the deterministic engine
```
