import { useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { t, BCP47_LOCALE } from '../i18n/strings.js'
import stadium from '../data/stadium.json'
import StaffAssistanceButton from './StaffAssistanceButton.jsx'

let nextId = 0

export default function Chat() {
  const { language, simpleLanguage, currentRecommendation, requestStaffAssistance } = useAppContext()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [recording, setRecording] = useState(false)
  const [voiceError, setVoiceError] = useState('')
  const [playingId, setPlayingId] = useState(null)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const audioPlayerRef = useRef(null)

  async function sendMessage(text) {
    const trimmed = text.trim()
    if (!trimmed || sending) return

    const userMessage = { id: nextId++, role: 'fan', text: trimmed }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setSending(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          facilityData: stadium.facilities,
          recommendation: currentRecommendation,
          language,
          simpleLanguage,
        }),
      })
      if (!res.ok) throw new Error('chat failed')
      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', text: data.reply, urgent: data.escalate },
      ])
      if (data.escalate) requestStaffAssistance()
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: 'assistant', text: t('explanationError', language), urgent: false },
      ])
    } finally {
      setSending(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    sendMessage(input)
  }

  async function startRecording() {
    setVoiceError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      audioChunksRef.current = []

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data)
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const base64 = await blobToBase64(blob)

        try {
          const res = await fetch('/api/speech-to-text', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
              audioContent: base64,
              languageCode: BCP47_LOCALE[language],
              encoding: 'WEBM_OPUS',
            }),
          })
          if (!res.ok) throw new Error('speech-to-text failed')
          const data = await res.json()
          if (data.transcript) setInput(data.transcript)
          else setVoiceError('No speech detected — please try again.')
        } catch {
          setVoiceError('Voice input is temporarily unavailable.')
        }
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      setVoiceError('Microphone access was denied or unavailable.')
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  async function toggleReadAloud(message) {
    if (playingId === message.id) {
      audioPlayerRef.current?.pause()
      setPlayingId(null)
      return
    }

    try {
      const res = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          text: message.text,
          languageCode: BCP47_LOCALE[language],
          audioEncoding: 'MP3',
        }),
      })
      if (!res.ok) throw new Error('text-to-speech failed')
      const data = await res.json()
      if (!data.audioContent) return

      const audio = new Audio(`data:audio/mp3;base64,${data.audioContent}`)
      audioPlayerRef.current = audio
      audio.onended = () => setPlayingId(null)
      setPlayingId(message.id)
      audio.play()
    } catch {
      setVoiceError('Read-aloud is temporarily unavailable.')
    }
  }

  return (
    <section aria-labelledby="chat-heading" className="flex flex-col gap-4 rounded-xl border border-slate-300 p-5 dark:border-slate-600">
      <h2 id="chat-heading" className="text-lg font-semibold">
        {t('chatTitle', language)}
      </h2>

      <ol aria-live="polite" aria-label={t('chatTitle', language)} className="flex max-h-80 flex-col gap-3 overflow-y-auto">
        {messages.map((message) => (
          <li
            key={message.id}
            className={`rounded-lg p-3 text-sm ${
              message.role === 'fan'
                ? 'self-end bg-blue-100 dark:bg-blue-900'
                : 'self-start bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {message.urgent && (
              <p className="mb-2 font-semibold text-red-700 dark:text-red-300">{t('urgentBanner', language)}</p>
            )}
            <p>{message.text}</p>
            {message.role === 'assistant' && (
              <button
                type="button"
                onClick={() => toggleReadAloud(message)}
                className="mt-2 text-xs font-medium underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
              >
                {playingId === message.id ? t('stopReading', language) : t('readAloud', language)}
              </button>
            )}
            {message.urgent && (
              <div className="mt-2">
                <StaffAssistanceButton />
              </div>
            )}
          </li>
        ))}
      </ol>

      {voiceError && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-300">
          {voiceError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor="chat-input" className="sr-only">
          {t('chatPlaceholder', language)}
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chatPlaceholder', language)}
          className="flex-1 rounded-lg border border-slate-400 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        />
        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          aria-pressed={recording}
          aria-label={recording ? t('micStop', language) : t('micStart', language)}
          className="rounded-lg border border-slate-400 px-3 py-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          {recording ? '⏹' : '🎤'}
        </button>
        <button
          type="submit"
          disabled={sending}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-800"
        >
          {t('send', language)}
        </button>
      </form>
    </section>
  )
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
