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
