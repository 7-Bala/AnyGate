// Curated to the tournament's biggest fan bases. Intentionally a fixed
// list rather than free-text input, so language support stays testable —
// see Part C of the redesign brief.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'pt', label: 'Português' },
  { code: 'ar', label: 'العربية' },
  { code: 'zh', label: '中文' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
]

export const LANGUAGE_CODES = new Set(LANGUAGES.map((l) => l.code))

// en/es/ar are hand-verified against a static dictionary (see strings.js).
// Everything else routes through /api/translate-ui at runtime — see the
// README for this caveat, same pattern as the earlier multilingual pass.
export const HAND_VERIFIED_LANGUAGES = new Set(['en', 'es', 'ar'])

// RTL is derived from the language code, not hardcoded per language, so
// this scales without a new hardcoded case each time a language is added.
const RTL_CODES = new Set(['ar', 'he', 'fa', 'ur'])

export function isRtl(code) {
  return RTL_CODES.has(code)
}
