import { sendChatMessage } from '../services/claudeClient.js'
import { sanitizeUserInput } from '../middleware/sanitizeInput.js'
import { buildChatSystemPrompt } from '../prompts/chatSystemPrompt.js'

const VALID_URGENCY = new Set(['normal', 'elevated', 'urgent'])

function parseChatResponse(raw) {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed.reply === 'string') {
      return {
        reply: parsed.reply,
        urgency: VALID_URGENCY.has(parsed.urgency) ? parsed.urgency : 'normal',
        escalate: Boolean(parsed.escalate),
      }
    }
  } catch {
    // Claude didn't return valid JSON — fall back to the raw text below
    // rather than failing the request.
  }
  return { reply: raw, urgency: 'normal', escalate: false }
}

export async function handleChat(req, res) {
  const { message, facilityData, recommendation, language, simpleLanguage } = req.body ?? {}

  if (typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  const sanitized = sanitizeUserInput(message)
  const systemPrompt = buildChatSystemPrompt({
    facilityData,
    recommendation,
    language,
    simpleLanguage: Boolean(simpleLanguage),
  })

  try {
    const raw = await sendChatMessage({
      systemPrompt,
      userMessage: `<fan_message>${sanitized}</fan_message>`,
    })
    res.json(parseChatResponse(raw))
  } catch (err) {
    console.error('chat proxy error:', err.message)
    res.status(502).json({
      error: 'The assistant is temporarily unavailable. Please request staff assistance if this is urgent.',
      escalate: true,
    })
  }
}
