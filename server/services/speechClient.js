const SPEECH_TO_TEXT_URL = 'https://speech.googleapis.com/v1/speech:recognize'
const TEXT_TO_SPEECH_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize'

async function speechToTextWithGemini({ audioContent, languageCode }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Neither GOOGLE_CLOUD_API_KEY nor GEMINI_API_KEY is configured')
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

  // Clean the base64 string if it contains the data: URL prefix
  let base64Data = audioContent
  if (base64Data.includes('base64,')) {
    base64Data = base64Data.split('base64,')[1]
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: base64Data
            }
          },
          {
            text: `Transcribe this audio file. The speaker is talking in or around language "${languageCode}". Output ONLY the exact transcription. If there is no speech or only noise, output absolutely nothing.`
          }
        ]
      }]
    })
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini speech-to-text fallback error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? ''
}

async function textToSpeechWithGemini({ text, languageCode }) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('Neither GOOGLE_CLOUD_API_KEY nor GEMINI_API_KEY is configured')
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Read the following text out loud in language "${languageCode}". Read ONLY the text verbatim. Do not translate, explain, or add commentary.

Text to read:
${text}`
        }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO']
      }
    })
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Gemini text-to-speech fallback error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  // Locate the inlineData chunk of audio in response
  const part = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)
  if (!part || !part.inlineData || !part.inlineData.data) {
    throw new Error('Gemini did not return audio content')
  }

  return {
    audioContent: part.inlineData.data,
    mimeType: part.inlineData.mimeType || 'audio/wav'
  }
}

export async function speechToText({
  audioContent,
  languageCode = 'en-US',
  encoding = 'WEBM_OPUS',
  sampleRateHertz,
}) {
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    return speechToTextWithGemini({ audioContent, languageCode })
  }

  const url = new URL(SPEECH_TO_TEXT_URL)
  url.searchParams.set('key', process.env.GOOGLE_CLOUD_API_KEY)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      config: { languageCode, encoding, sampleRateHertz },
      audio: { content: audioContent },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Google Speech-to-Text API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return data.results?.map((r) => r.alternatives?.[0]?.transcript).join(' ').trim() ?? ''
}

export async function textToSpeech({
  text,
  languageCode = 'en-US',
  voiceName,
  audioEncoding = 'MP3',
}) {
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    return textToSpeechWithGemini({ text, languageCode })
  }

  const url = new URL(TEXT_TO_SPEECH_URL)
  url.searchParams.set('key', process.env.GOOGLE_CLOUD_API_KEY)

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      input: { text },
      voice: { languageCode, name: voiceName },
      audioConfig: { audioEncoding },
    }),
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`Google Text-to-Speech API error ${res.status}: ${detail}`)
  }

  const data = await res.json()
  return {
    audioContent: data.audioContent ?? '',
    mimeType: audioEncoding === 'MP3' ? 'audio/mp3' : 'audio/wav'
  }
}
