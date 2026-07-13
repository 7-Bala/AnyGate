import { speechToText, textToSpeech } from '../services/speechClient.js'

const MAX_TEXT_LENGTH = 2000

export async function handleSpeechToText(req, res) {
  const { audioContent, languageCode, encoding, sampleRateHertz } = req.body ?? {}

  if (typeof audioContent !== 'string' || !audioContent.trim()) {
    return res.status(400).json({ error: 'audioContent (base64) is required' })
  }

  try {
    const transcript = await speechToText({ audioContent, languageCode, encoding, sampleRateHertz })
    res.json({ transcript })
  } catch (err) {
    console.error('speech-to-text proxy error:', err.message)
    res.status(502).json({ error: 'Speech-to-text is temporarily unavailable.' })
  }
}

export async function handleTextToSpeech(req, res) {
  const { text, languageCode, voiceName, audioEncoding } = req.body ?? {}

  if (typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' })
  }

  try {
    const audioContent = await textToSpeech({
      text: text.slice(0, MAX_TEXT_LENGTH),
      languageCode,
      voiceName,
      audioEncoding,
    })
    res.json({ audioContent })
  } catch (err) {
    console.error('text-to-speech proxy error:', err.message)
    res.status(502).json({ error: 'Text-to-speech is temporarily unavailable.' })
  }
}
