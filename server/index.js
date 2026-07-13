import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// TODO: /api/chat -> Claude, /api/translate -> Google Translate, /api/speech -> Google Speech

app.listen(PORT, () => {
  console.log(`Any Gate server listening on port ${PORT}`)
})
