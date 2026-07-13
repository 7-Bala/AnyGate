import { useEffect, useState } from 'react'

const cache = new Map()

// Translates a single factual string (facility name, transit note, engine
// breakdown text) via the server's /api/translate proxy. Falls back to the
// original English text on any failure so a missing API key or network
// error never blocks the deterministic recommendation from rendering.
export function useTranslated(text, language) {
  const [translated, setTranslated] = useState(text)

  useEffect(() => {
    if (!text || language === 'en') {
      setTranslated(text)
      return
    }

    const cacheKey = `${language}:${text}`
    if (cache.has(cacheKey)) {
      setTranslated(cache.get(cacheKey))
      return
    }

    let cancelled = false
    fetch('/api/translate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text, target: language, source: 'en' }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('translate failed'))))
      .then((data) => {
        if (cancelled) return
        cache.set(cacheKey, data.translatedText)
        setTranslated(data.translatedText)
      })
      .catch(() => {
        if (!cancelled) setTranslated(text)
      })

    return () => {
      cancelled = true
    }
  }, [text, language])

  return translated
}
