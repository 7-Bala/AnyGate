import { useEffect } from 'react'
import { AppProvider, useAppContext } from './context/AppContext.jsx'
import { t, RTL_LANGUAGES } from './i18n/strings.js'
import Onboarding from './components/Onboarding.jsx'
import RouteView from './components/RouteView.jsx'
import Chat from './components/Chat.jsx'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
]

function Toolbar() {
  const { language, setLanguage, highContrast, setHighContrast, simpleLanguage, setSimpleLanguage } = useAppContext()

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-slate-300 px-6 py-3 dark:border-slate-600">
      <label className="flex items-center gap-2 text-sm">
        <span>{t('languageLabel', language)}</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded border border-slate-400 px-2 py-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code}>
              {label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        aria-pressed={highContrast}
        onClick={() => setHighContrast((v) => !v)}
        className="rounded border border-slate-400 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        {t('highContrast', language)}
      </button>

      <button
        type="button"
        aria-pressed={simpleLanguage}
        onClick={() => setSimpleLanguage((v) => !v)}
        className="rounded border border-slate-400 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
      >
        {t('simpleLanguage', language)}
      </button>
    </div>
  )
}

function AppShell() {
  const { onboarded, language, highContrast } = useAppContext()
  const isRtl = RTL_LANGUAGES.has(language)

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr'
  }, [language, isRtl])

  return (
    <div className={`min-h-screen bg-white text-slate-900 dark:bg-slate-900 dark:text-white ${highContrast ? 'hc' : ''}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white"
      >
        {t('skipToContent', language)}
      </a>

      {onboarded ? (
        <>
          <header>
            <h1 className="px-6 pt-6 text-2xl font-semibold">{t('appName', language)}</h1>
            <p className="px-6 pb-2 text-sm text-slate-600 dark:text-slate-300">{t('tagline', language)}</p>
            <Toolbar />
          </header>
          <main id="main-content" className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-8">
            <RouteView />
            <Chat />
          </main>
        </>
      ) : (
        <Onboarding />
      )}
    </div>
  )
}

function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}

export default App
