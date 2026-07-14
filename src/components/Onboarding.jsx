import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import { VALID_NEEDS } from '../engine/needs.js'

const NEED_LABEL_KEYS = {
  wheelchair: 'needWheelchair',
  visual_impairment: 'needVisual',
  hearing_impairment: 'needHearing',
  sensory_sensitive: 'needSensory',
  limited_mobility: 'needMobility',
}

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'ar', label: 'العربية' },
]

export default function Onboarding() {
  const { needs, setNeeds, language, setLanguage, completeOnboarding } = useAppContext()
  const [step, setStep] = useState(1)
  const [selectedNeeds, setSelectedNeeds] = useState(needs)

  function toggleNeed(need) {
    setSelectedNeeds((prev) => (prev.includes(need) ? prev.filter((n) => n !== need) : [...prev, need]))
  }

  function handleNext() {
    setNeeds(selectedNeeds)
    setStep(2)
  }

  function handleFinish() {
    completeOnboarding()
  }

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 px-6 py-12 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"
      aria-labelledby="onboarding-heading"
    >
      <h1 id="onboarding-heading" className="text-2xl font-semibold">
        {t('appName', language)}
      </h1>

      {step === 1 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-lg font-medium">{t('onboardNeedsTitle', language)}</legend>
          <p className="text-sm text-slate-600 dark:text-slate-300">{t('onboardNeedsHint', language)}</p>

          <div className="flex flex-col gap-3">
            {VALID_NEEDS.map((need) => (
              <label key={need} className="flex items-center gap-3 rounded-lg border border-slate-300 p-3 focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-600">
                <input
                  type="checkbox"
                  checked={selectedNeeds.includes(need)}
                  onChange={() => toggleNeed(need)}
                  className="h-5 w-5"
                />
                <span>{t(NEED_LABEL_KEYS[need], language)}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 rounded-lg border border-slate-300 p-3 focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-600">
              <input
                type="checkbox"
                checked={selectedNeeds.length === 0}
                onChange={() => setSelectedNeeds([])}
                className="h-5 w-5"
              />
              <span>{t('needNone', language)}</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
          >
            {t('next', language)}
          </button>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="text-lg font-medium">{t('onboardLanguageTitle', language)}</legend>

          <div className="flex flex-col gap-3" role="radiogroup" aria-label={t('languageLabel', language)}>
            {LANGUAGES.map(({ code, label }) => (
              <label key={code} className="flex items-center gap-3 rounded-lg border border-slate-300 p-3 focus-within:ring-2 focus-within:ring-blue-500 dark:border-slate-600">
                <input
                  type="radio"
                  name="language"
                  checked={language === code}
                  onChange={() => setLanguage(code)}
                  className="h-5 w-5"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-slate-400 px-4 py-3 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              {t('back', language)}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
            >
              {t('finish', language)}
            </button>
          </div>
        </fieldset>
      )}
    </main>
  )
}
