import { useAppContext } from '../context/AppContext.jsx'
import { UI_STRINGS } from './strings.js'
import { HAND_VERIFIED_LANGUAGES } from './languages.js'

// English UI chrome strings (UI_STRINGS.en) are the single source of
// truth. en/es/ar are hand-verified static dictionaries. Every other
// curated language resolves through uiChrome — a runtime dictionary
// fetched once per language via /api/translate-ui and cached both
// server-side and in AppContext (see useUiChromeLoader) — falling back
// to English if translation is unavailable.
export function useT() {
  const { language, uiChrome } = useAppContext()

  return function t(key) {
    if (!HAND_VERIFIED_LANGUAGES.has(language) && uiChrome?.[key]) {
      return uiChrome[key]
    }
    return UI_STRINGS[language]?.[key] ?? UI_STRINGS.en[key] ?? key
  }
}
