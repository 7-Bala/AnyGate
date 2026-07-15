import { describe, it, expect } from 'vitest'
import { UI_STRINGS, BCP47_LOCALE } from '../src/i18n/strings.js'
import { LANGUAGES, HAND_VERIFIED_LANGUAGES } from '../src/i18n/languages.js'

describe('UI_STRINGS', () => {
  const enKeys = Object.keys(UI_STRINGS.en).sort()

  it('has a non-empty English dictionary as the single source of truth', () => {
    expect(enKeys.length).toBeGreaterThan(0)
  })

  for (const lang of Object.keys(UI_STRINGS)) {
    it(`"${lang}" has exactly the same keys as English — no silent gaps that would fall back unexpectedly`, () => {
      const keys = Object.keys(UI_STRINGS[lang]).sort()
      expect(keys).toEqual(enKeys)
    })

    it(`"${lang}" has no empty string values`, () => {
      for (const [key, value] of Object.entries(UI_STRINGS[lang])) {
        expect(value, `${lang}.${key} should not be empty`).not.toBe('')
      }
    })
  }

  it('every hand-verified language actually has a static dictionary', () => {
    for (const code of HAND_VERIFIED_LANGUAGES) {
      expect(UI_STRINGS[code]).toBeDefined()
    }
  })
})

describe('BCP47_LOCALE', () => {
  it('has a locale entry for every curated language, for speech APIs to key off', () => {
    for (const { code } of LANGUAGES) {
      expect(BCP47_LOCALE[code], `missing BCP47 locale for "${code}"`).toBeDefined()
    }
  })
})
