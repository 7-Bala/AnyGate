const SPEECH_TO_TEXT_URL = 'https://speech.googleapis.com/v1/speech:recognize'
const TEXT_TO_SPEECH_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize'

function requireApiKey() {
  if (!process.env.GOOGLE_CLOUD_API_KEY) {
    throw new Error('GOOGLE_CLOUD_API_KEY is not configured')
  }
  return process.env.GOOGLE_CLOUD_API_KEY
}

export async function speechToText({
  audioContent,
  languageCode = 'en-US',
  encoding = 'WEBM_OPUS',
  sampleRateHertz,
}) {
  const key = requireApiKey()
  const url = new URL(SPEECH_TO_TEXT_URL)
  url.searchParams.set('key', key)

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
  const key = requireApiKey()
  const url = new URL(TEXT_TO_SPEECH_URL)
  url.searchParams.set('key', key)

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
  return data.audioContent ?? ''
}
