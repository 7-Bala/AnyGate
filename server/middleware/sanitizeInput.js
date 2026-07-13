const MAX_LENGTH = 2000

// Breaks common conversation-turn-spoofing markers ("System:", "Assistant:")
// so free text can't masquerade as a new prompt turn.
const ROLE_MARKER_PATTERN = /\b(system|assistant|user|human)\s*:/gi
const INSTRUCTION_OVERRIDE_PATTERN =
  /\b(ignore|disregard|forget)\s+(all\s+|the\s+)?(previous|prior|above|earlier)\s+(instructions?|prompts?|rules?)\b/gi
const FAKE_TAG_PATTERN = /<\s*\/?\s*(system|instructions?)\s*>/gi

// Basic defense-in-depth against prompt injection in free text. This is not
// a complete guard on its own — the system prompt additionally instructs
// Claude to treat fan input as untrusted data, never as instructions, and
// to only assert facts present in the supplied facility/score data.
export function sanitizeUserInput(rawInput) {
  if (typeof rawInput !== 'string') return ''

  return rawInput
    .slice(0, MAX_LENGTH)
    .replace(ROLE_MARKER_PATTERN, (match) => match.replace(':', ' -'))
    .replace(INSTRUCTION_OVERRIDE_PATTERN, '[redacted instruction-override attempt]')
    .replace(FAKE_TAG_PATTERN, '')
    .trim()
}
