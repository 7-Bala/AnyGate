import { NEED_DEFINITIONS } from './needs.js'

// Deterministic, zero-LLM safety filter. Excludes any facility under
// maintenance and any facility that structurally fails a stated need's hard
// requirement (e.g. a wheelchair need requires accessible: true). Unknown
// need keys are ignored rather than treated as failures, so a typo in a
// caller's need list can never silently zero out every option. Returns []
// when nothing qualifies — never throws, never guesses.
export function filterValidOptions(facilities, fanNeeds = []) {
  if (!Array.isArray(facilities)) return []
  const needs = Array.isArray(fanNeeds) ? fanNeeds : []

  return facilities.filter((facility) => {
    if (!facility || facility.under_maintenance) return false

    for (const need of needs) {
      const definition = NEED_DEFINITIONS[need]
      if (!definition) continue
      if (definition.requiresAccessible && !facility.accessible) return false
    }

    return true
  })
}
