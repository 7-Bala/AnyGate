import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { startCongestionSimulator, getCongestionSnapshot } from './services/congestionSimulator.js'

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

// TODO: /api/chat -> Claude, /api/translate -> Google Translate, /api/speech -> Google Speech

startCongestionSimulator()

app.listen(PORT, () => {
  console.log(`Any Gate server listening on port ${PORT}`)
})
