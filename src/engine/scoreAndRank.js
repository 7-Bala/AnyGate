import { NEED_DEFINITIONS } from './needs.js'

const DEFAULT_WEIGHTS = { distance: 0.3, congestion: 0.4, featureMatch: 0.3 }
const DEFAULT_ORIGIN = { x: 18, y: 14 } // central zone, see stadium.json _assumptions
const OVER_CAPACITY_PENALTY = 15
const NEUTRAL_CONGESTION_SCORE = 50
const DISTANCE_SCALE = 2 // relative-position units are illustrative, not metric

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function distanceBetween(position, origin) {
  const x = position?.x ?? origin.x
  const y = position?.y ?? origin.y
  return Math.sqrt((x - origin.x) ** 2 + (y - origin.y) ** 2)
}

function relevantFeaturesFor(fanNeeds) {
  const seen = new Set()
  for (const need of fanNeeds) {
    for (const feature of NEED_DEFINITIONS[need]?.relevantFeatures ?? []) {
      seen.add(feature)
    }
  }
  return [...seen]
}

// Deterministic, zero-LLM ranking over facilities that already passed
// filterValidOptions. Missing/stale live congestion never crashes the
// scorer — it degrades to a neutral score and is flagged in the breakdown
// so callers (including the GenAI explanation layer) can surface that
// caveat honestly instead of presenting a guess as fact.
export function scoreAndRank(validFacilities, liveCongestion = {}, fanNeeds = [], options = {}) {
  if (!Array.isArray(validFacilities) || validFacilities.length === 0) return []

  const needs = Array.isArray(fanNeeds) ? fanNeeds : []
  const origin = options.origin ?? DEFAULT_ORIGIN
  const weights = { ...DEFAULT_WEIGHTS, ...options.weights }
  const congestionMap = liveCongestion ?? {}
  const relevantFeatures = relevantFeaturesFor(needs)

  const results = validFacilities.map((facility) => {
    const distance = distanceBetween(facility.relative_position, origin)
    const distanceScore = clamp(100 - distance * DISTANCE_SCALE, 0, 100)

    const congestionEntry = congestionMap[facility.id]
    const hasLiveCongestion = typeof congestionEntry?.value === 'number'
    const congestionScore = hasLiveCongestion
      ? clamp(100 - congestionEntry.value, 0, 100)
      : NEUTRAL_CONGESTION_SCORE
    const overCapacity =
      hasLiveCongestion &&
      typeof facility.capacity_threshold === 'number' &&
      congestionEntry.value > facility.capacity_threshold

    const matchedFeatures = relevantFeatures.filter((feature) =>
      facility.accessibility_features?.includes(feature),
    )
    const featureMatchRatio = relevantFeatures.length === 0 ? 1 : matchedFeatures.length / relevantFeatures.length
    const featureMatchScore = featureMatchRatio * 100

    let total =
      distanceScore * weights.distance +
      congestionScore * weights.congestion +
      featureMatchScore * weights.featureMatch
    if (overCapacity) total -= OVER_CAPACITY_PENALTY
    total = Math.round(clamp(total, 0, 100))

    const notes = [
      hasLiveCongestion
        ? `Live congestion is ${congestionEntry.value}/100${
            overCapacity ? ` — over this facility's comfort threshold of ${facility.capacity_threshold}` : ''
          }.`
        : `Live congestion data is unavailable right now — treated as neutral until a fresh reading arrives.`,
      relevantFeatures.length > 0
        ? `Matches ${matchedFeatures.length} of ${relevantFeatures.length} relevant accessibility features.`
        : `No specific accessibility features were required for this search.`,
      `${Math.round(distance)} relative units from the reference point.`,
    ]

    return {
      facility,
      score: total,
      breakdown: {
        distanceScore: Math.round(distanceScore),
        congestionScore: Math.round(congestionScore),
        featureMatchScore: Math.round(featureMatchScore),
        congestionStatus: hasLiveCongestion ? 'live' : 'unknown',
        overCapacity,
      },
      notes,
    }
  })

  return results.sort((a, b) => b.score - a.score)
}
