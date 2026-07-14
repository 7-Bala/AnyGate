import { useEffect, useState } from 'react'

// Fetches a plain-language GenAI explanation of a recommendation the
// deterministic engine already computed. Gemini explains an existing
// score/breakdown here — it never computes or overrides it.
//
// Depends on facilityId (a primitive), not the `result` object itself:
// `result` is a fresh object every time live congestion recomputes the
// ranking (every ~5s), and depending on that reference would tear down
// and cancel the in-flight fetch on every poll, permanently stalling the
// explanation. One explanation per facility/language/mode is what we want.
export function useRecommendationExplanation({ result, allFacilities, language, simpleLanguage }) {
  const [state, setState] = useState({ text: '', loading: false, error: false })
  const facilityId = result?.facility.id ?? null

  /* oxlint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!facilityId) {
      setState({ text: '', loading: false, error: false })
      return
    }

    let cancelled = false
    setState({ text: '', loading: true, error: false })

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        message: 'Please explain this recommendation to the fan in plain, warm language.',
        facilityData: allFacilities,
        recommendation: result,
        language,
        simpleLanguage,
      }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('chat failed'))))
      .then((data) => {
        if (!cancelled) setState({ text: data.reply, loading: false, error: false })
      })
      .catch(() => {
        if (!cancelled) setState({ text: '', loading: false, error: true })
      })

    return () => {
      cancelled = true
    }
  }, [facilityId, language, simpleLanguage])
  /* oxlint-enable react-hooks/exhaustive-deps */

  return state
}
