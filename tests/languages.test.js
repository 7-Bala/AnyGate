import { describe, it, expect } from 'vitest'
import { isRtl, LANGUAGES, LANGUAGE_CODES, HAND_VERIFIED_LANGUAGES } from '../src/i18n/languages.js'

describe('isRtl', () => {
  it('identifies Arabic as RTL', () => {
    expect(isRtl('ar')).toBe(true)
  })

  it('identifies RTL languages beyond the curated list — proves the logic is derived from the code, not hardcoded per language', () => {
    expect(isRtl('he')).toBe(true)
    expect(isRtl('fa')).toBe(true)
    expect(isRtl('ur')).toBe(true)
  })

  it('identifies every curated non-Arabic language as LTR', () => {
    const ltrCodes = LANGUAGES.map((l) => l.code).filter((c) => c !== 'ar')
    for (const code of ltrCodes) {
      expect(isRtl(code)).toBe(false)
    }
  })

  it('returns false for an unrecognized code rather than throwing', () => {
    expect(isRtl('xx')).toBe(false)
    expect(isRtl(undefined)).toBe(false)
  })
})

describe('LANGUAGES / LANGUAGE_CODES / HAND_VERIFIED_LANGUAGES', () => {
  it('has exactly ten curated languages, each with a code and a native label', () => {
    expect(LANGUAGES).toHaveLength(10)
    for (const lang of LANGUAGES) {
      expect(typeof lang.code).toBe('string')
      expect(lang.code.length).toBeGreaterThan(0)
      expect(typeof lang.label).toBe('string')
      expect(lang.label.length).toBeGreaterThan(0)
    }
  })

  it('has no duplicate language codes', () => {
    const codes = LANGUAGES.map((l) => l.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('LANGUAGE_CODES contains every curated code', () => {
    for (const lang of LANGUAGES) {
      expect(LANGUAGE_CODES.has(lang.code)).toBe(true)
    }
  })

  it('every hand-verified language is part of the curated list', () => {
    for (const code of HAND_VERIFIED_LANGUAGES) {
      expect(LANGUAGE_CODES.has(code)).toBe(true)
    }
  })

  it('hand-verified set is exactly en/es/ar, matching the static string dictionary', () => {
    expect([...HAND_VERIFIED_LANGUAGES].sort()).toEqual(['ar', 'en', 'es'])
  })
})
