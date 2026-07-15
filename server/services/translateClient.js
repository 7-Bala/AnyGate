const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'

async function translateWithGemini({ text, target, source }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Neither GOOGLE_TRANSLATE_API_KEY nor GEMINI_API_KEY is configured')
  }

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

  const prompt = `Translate the following text to language code "${target}".${source ? ` The source language is "${source}".` : ''}
Provide ONLY the translated text. Do not add any conversational commentary, explanations, markdown, or intro.

Text:
${text}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini translation fallback error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
}

async function translateBatchWithGemini({ texts, target, source }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Neither GOOGLE_TRANSLATE_API_KEY nor GEMINI_API_KEY is configured')
  }

  const model = process.env.GEMINI_MODEL || 'gemini-flash-latest'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

  const prompt = `Translate the following list of strings to language code "${target}".${source ? ` The source language is "${source}".` : ''}
You MUST output ONLY a valid JSON string array of translations in the exact same order.
Do not wrap in markdown \`\`\`json blocks. Just output the raw JSON array.

Strings to translate:
${JSON.stringify(texts)}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json'
      }
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini batch translation fallback error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'
  try {
    const parsed = JSON.parse(rawText)
    if (Array.isArray(parsed)) {
      return parsed.map(String)
    }
  } catch (err) {
    console.error('Failed to parse Gemini batch translation fallback:', rawText, err)
  }
  return texts
}

export async function translateText({ text, target, source }) {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    return translateWithGemini({ text, target, source })
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

export async function translateBatch({ texts, target, source }) {
  if (!process.env.GOOGLE_TRANSLATE_API_KEY) {
    return translateBatchWithGemini({ texts, target, source })
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
