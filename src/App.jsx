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
    <div className="flex flex-wrap items-center gap-3 border-t border-chalk/15 px-6 py-3">
      <label className="flex items-center gap-2 text-sm text-chalk/85">
        <span className="sr-only sm:not-sr-only">{t('languageLabel', language)}</span>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-full border border-chalk/30 bg-transparent px-3 py-1.5 text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
        >
          {LANGUAGES.map(({ code, label }) => (
            <option key={code} value={code} className="text-ink">
              {label}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        aria-pressed={highContrast}
        onClick={() => setHighContrast((v) => !v)}
        className="rounded-full border border-chalk/30 px-3 py-1.5 text-sm text-chalk transition-colors hover:border-gold hover:text-gold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold aria-pressed:border-gold aria-pressed:bg-gold aria-pressed:text-ink"
      >
        {t('highContrast', language)}
      </button>

      <button
        type="button"
        aria-pressed={simpleLanguage}
        onClick={() => setSimpleLanguage((v) => !v)}
        className="rounded-full border border-chalk/30 px-3 py-1.5 text-sm text-chalk transition-colors hover:border-teal hover:text-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal aria-pressed:border-teal aria-pressed:bg-teal aria-pressed:text-ink"
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
    <div className={`min-h-screen bg-chalk text-ink dark:bg-ink dark:text-chalk ${highContrast ? 'hc' : ''}`}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
      >
        {t('skipToContent', language)}
      </a>

      {onboarded ? (
        <>
          <header
            className="relative overflow-hidden bg-ink text-chalk"
            style={{
              backgroundImage:
                'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(255,182,39,0.16), transparent 60%)',
            }}
          >
            <div className="px-6 pt-6">
              <h1 className="font-display text-3xl font-black tracking-tight">{t('appName', language)}</h1>
              <p className="pb-2 pt-1 text-sm text-chalk/70">{t('tagline', language)}</p>
            </div>
            <Toolbar />
          </header>
          <main
            id="main-content"
            tabIndex={-1}
            className="mx-auto flex max-w-2xl flex-col gap-8 px-6 py-8 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
          >
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
