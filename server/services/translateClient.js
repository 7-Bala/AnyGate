const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'

export async function translateText({ text, target, source }) {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured')
  }

  const url = new URL(TRANSLATE_API_URL)
  url.searchParams.set('key', process.env.GOOGLE_TRANSLATE_API_KEY)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: text, target, source, format: 'text' }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Google Translate API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.data?.translations?.[0]?.translatedText ?? ''
}

// Google's Translate v2 API accepts `q` as an array and returns
// translations in the same order in a single HTTP call — used to
// translate an entire UI chrome dictionary in one request instead of
// one round trip per string.
export async function translateBatch({ texts, target, source }) {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    throw new Error('GOOGLE_TRANSLATE_API_KEY is not configured')
  }

  const url = new URL(TRANSLATE_API_URL)
  url.searchParams.set('key', process.env.GOOGLE_TRANSLATE_API_KEY)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ q: texts, target, source, format: 'text' }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Google Translate API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return (data.data?.translations ?? []).map((t) => t.translatedText ?? '')
}
