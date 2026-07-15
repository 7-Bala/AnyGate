// gemini-2.5-flash returns 404 "no longer available to new users" on newly
// created API keys (verified directly against the live API) — the rolling
// alias is what Google intends new keys to target instead.
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`
const MAX_TOKENS = 1024

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
      generationConfig: {
        maxOutputTokens: MAX_TOKENS,
        // Without this, Gemini wraps its JSON reply in a markdown ```json
        // fence by default (verified directly against the live API) even
        // though the system prompt says "no text outside the JSON" — that
        // instruction alone isn't enough; this is the actual API-level
        // control for it, same technique already used in translateClient.js.
        responseMimeType: 'application/json',
        // The default model reasons internally before answering, consuming
        // a separate hidden token budget (usageMetadata.thoughtsTokenCount)
        // on top of maxOutputTokens — verified directly against the live
        // API, this was silently truncating the JSON reply before its
        // closing braces on the full system prompt. This task (explain an
        // already-computed recommendation, ground answers in given data)
        // doesn't need multi-step reasoning, so disabling it removes the
        // truncation risk at its source rather than just raising the cap.
        thinkingConfig: { thinkingBudget: 0 },
      },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
