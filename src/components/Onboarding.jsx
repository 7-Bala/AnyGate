import { useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'
import { LANGUAGES } from '../i18n/languages.js'
import { VALID_NEEDS } from '../engine/needs.js'
import NeedGlyph from './NeedGlyph.jsx'

const NEED_LABEL_KEYS = {
  wheelchair: 'needWheelchair',
  visual_impairment: 'needVisual',
  hearing_impairment: 'needHearing',
  sensory_sensitive: 'needSensory',
  limited_mobility: 'needMobility',
}

export default function Onboarding() {
  const { needs, setNeeds, language, setLanguage, completeOnboarding } = useAppContext()
  const t = useT()
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
      className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-6 bg-ink px-6 py-12 text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
      style={{
        backgroundImage: 'radial-gradient(ellipse 70% 50% at 85% 0%, rgba(255,182,39,0.14), transparent 60%)',
      }}
      aria-labelledby="onboarding-heading"
    >
      <h1 id="onboarding-heading" className="font-display text-4xl font-black tracking-tight">
        {t('appName')}
      </h1>

      {step === 1 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="font-display text-xl font-bold">{t('onboardNeedsTitle')}</legend>
          <p className="text-sm text-chalk/70">{t('onboardNeedsHint')}</p>

          <div className="flex flex-col gap-3">
            {VALID_NEEDS.map((need) => (
              <label
                key={need}
                className="flex items-center gap-3 rounded-xl border border-chalk/20 p-3 transition-colors has-checked:border-gold has-checked:bg-gold/10 focus-within:ring-2 focus-within:ring-gold"
              >
                <input
                  type="checkbox"
                  checked={selectedNeeds.includes(need)}
                  onChange={() => toggleNeed(need)}
                  className="h-5 w-5 accent-gold"
                />
                <NeedGlyph type={need} className="h-5 w-5 shrink-0 text-gold" />
                <span>{t(NEED_LABEL_KEYS[need])}</span>
              </label>
            ))}
            <label className="flex items-center gap-3 rounded-xl border border-chalk/20 p-3 transition-colors has-checked:border-gold has-checked:bg-gold/10 focus-within:ring-2 focus-within:ring-gold">
              <input
                type="checkbox"
                checked={selectedNeeds.length === 0}
                onChange={() => setSelectedNeeds([])}
                className="h-5 w-5 accent-gold"
              />
              <span>{t('needNone')}</span>
            </label>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="mt-2 rounded-full bg-gold px-4 py-3 font-semibold text-ink transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
          >
            {t('next')}
          </button>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="flex flex-col gap-4">
          <legend className="font-display text-xl font-bold">{t('onboardLanguageTitle')}</legend>

          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto" role="radiogroup" aria-label={t('languageLabel')}>
            {LANGUAGES.map(({ code, label }) => (
              <label
                key={code}
                className="flex items-center gap-3 rounded-xl border border-chalk/20 p-3 transition-colors has-checked:border-gold has-checked:bg-gold/10 focus-within:ring-2 focus-within:ring-gold"
              >
                <input
                  type="radio"
                  name="language"
                  checked={language === code}
                  onChange={() => setLanguage(code)}
                  className="h-5 w-5 accent-gold"
                />
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-full border border-chalk/30 px-4 py-3 font-medium text-chalk focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            >
              {t('back')}
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="flex-1 rounded-full bg-gold px-4 py-3 font-semibold text-ink transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk"
            >
              {t('finish')}
            </button>
          </div>
        </fieldset>
      )}
    </main>
  )
}
