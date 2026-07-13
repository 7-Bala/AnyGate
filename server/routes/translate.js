import { translateText } from '../services/translateClient.js'

const MAX_LENGTH = 2000

export async function handleTranslate(req, res) {
  const { text, target, source } = req.body ?? {}

  if (typeof text !== 'string' || !text.trim() || typeof target !== 'string' || !target.trim()) {
    return res.status(400).json({ error: 'text and target are required' })
  }

  try {
    const translatedText = await translateText({ text: text.slice(0, MAX_LENGTH), target, source })
    res.json({ translatedText })
  } catch (err) {
    console.error('translate proxy error:', err.message)
    res.status(502).json({ error: 'Translation is temporarily unavailable.' })
  }
}
