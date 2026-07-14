import { translateBatch } from '../services/translateClient.js'
import { UI_STRINGS } from '../../src/i18n/strings.js'
import { LANGUAGE_CODES, HAND_VERIFIED_LANGUAGES } from '../../src/i18n/languages.js'

const UI_KEYS = Object.keys(UI_STRINGS.en)
const UI_VALUES = UI_KEYS.map((key) => UI_STRINGS.en[key])

// Server-side cache, keyed by language code — translating the ~40-string
// UI chrome dictionary once per language per process lifetime, not once
// per request, is both a latency win and what keeps Translation API
// quota/cost bounded regardless of how many fans pick that language.
const cache = new Map()

export async function handleTranslateUi(req, res) {
  const { language } = req.body ?? {}

  if (typeof language !== 'string' || !LANGUAGE_CODES.has(language)) {
    return res.status(400).json({ error: 'language must be one of the supported language codes' })
  }

  if (HAND_VERIFIED_LANGUAGES.has(language)) {
    // The client only calls this endpoint for non-hand-verified
    // languages, but handle it defensively rather than assuming.
    return res.json({ strings: UI_STRINGS[language] ?? UI_STRINGS.en, cached: true })
  }

  if (cache.has(language)) {
    return res.json({ strings: cache.get(language), cached: true })
  }

  try {
    const translatedValues = await translateBatch({ texts: UI_VALUES, target: language, source: 'en' })
    const strings = {}
    UI_KEYS.forEach((key, i) => {
      strings[key] = translatedValues[i] || UI_STRINGS.en[key]
    })
    cache.set(language, strings)
    res.json({ strings, cached: false })
  } catch (err) {
    console.error('translate-ui proxy error:', err.message)
    res.status(502).json({ error: 'UI translation is temporarily unavailable.' })
  }
}
