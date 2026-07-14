import { useEffect } from 'react'
import { useAppContext } from '../context/useAppContext.js'
import { HAND_VERIFIED_LANGUAGES } from '../i18n/languages.js'

// Client-side cache on top of the server's own cache — avoids a network
// round trip entirely for a language already fetched this session.
const clientCache = new Map()

export function useUiChromeLoader() {
  const { language, setUiChrome, setUiChromeStatus } = useAppContext()

  useEffect(() => {
    if (HAND_VERIFIED_LANGUAGES.has(language)) {
      setUiChrome(null)
      setUiChromeStatus('static')
      return
    }

    if (clientCache.has(language)) {
      setUiChrome(clientCache.get(language))
      setUiChromeStatus('live')
      return
    }

    let cancelled = false
    setUiChromeStatus('loading')

    fetch('/api/translate-ui', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ language }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('translate-ui failed'))))
      .then((data) => {
        if (cancelled) return
        clientCache.set(language, data.strings)
        setUiChrome(data.strings)
        setUiChromeStatus('live')
      })
      .catch(() => {
        if (cancelled) return
        setUiChrome(null)
        setUiChromeStatus('unavailable')
      })

    return () => {
      cancelled = true
    }
  }, [language, setUiChrome, setUiChromeStatus])
}
