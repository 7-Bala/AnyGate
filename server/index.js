import 'dotenv/config'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import express from 'express'
import cors from 'cors'
import { startCongestionSimulator, getCongestionSnapshot } from './services/congestionSimulator.js'
import { rateLimit } from './middleware/rateLimit.js'
import { handleChat } from './routes/chat.js'
import { handleTranslate } from './routes/translate.js'
import { handleTranslateUi } from './routes/translateUi.js'
import { handleSpeechToText, handleTextToSpeech } from './routes/speech.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Interim stand-in for a Firestore `congestion` collection read (public,
// read-only). See src/services/firestoreClient.js for the client adapter
// this backs — swapping to real Firestore later means changing this route's
// internals only, not its response shape or any caller.
app.get('/api/congestion', (_req, res) => {
  res.json(getCongestionSnapshot())
})

const chatLimiter = rateLimit({ windowMs: 60_000, max: 20 })
const translateLimiter = rateLimit({ windowMs: 60_000, max: 30 })
const translateUiLimiter = rateLimit({ windowMs: 60_000, max: 20 })
const speechLimiter = rateLimit({ windowMs: 60_000, max: 20 })

app.post('/api/chat', chatLimiter, handleChat)
app.post('/api/translate', translateLimiter, handleTranslate)
app.post('/api/translate-ui', translateUiLimiter, handleTranslateUi)
app.post('/api/speech-to-text', speechLimiter, handleSpeechToText)
app.post('/api/text-to-speech', speechLimiter, handleTextToSpeech)

// Serve the Vite build output so one process handles both the frontend and
// the /api routes on the same origin — matching the app's relative
// fetch('/api/...') calls, with no CORS or proxy needed. In development the
// Vite dev server owns the frontend, so this is skipped.
if (process.env.NODE_ENV !== 'development') {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const distDir = join(__dirname, '..', 'dist')

  app.use(express.static(distDir))
  app.get('*splat', (_req, res) => {
    res.sendFile(join(distDir, 'index.html'))
  })
}

startCongestionSimulator()

app.listen(PORT, () => {
  console.log(`AnyGate server listening on port ${PORT}`)
})
