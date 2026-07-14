const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const MAX_TOKENS = 512

export async function sendChatMessage({ systemPrompt, userMessage }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured')
  }

  const res = await fetch(`${GEMINI_API_URL}?key=${process.env.GEMINI_API_KEY}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userMessage }] }],
      generationConfig: { maxOutputTokens: MAX_TOKENS },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
