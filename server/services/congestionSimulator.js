import stadium from '../../src/data/stadium.json' with { type: 'json' }

const UPDATE_INTERVAL_MS = 12000
const STEP_SIZE = 14
const SEED = 42

// Facilities intentionally excluded from updates to simulate stale/missing
// live data (mirrors the "restroom-west-stale" edge case in stadium.json).
const STALE_FACILITY_IDS = new Set(['restroom-west-stale'])

function mulberry32(seed) {
  let a = seed
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(SEED)

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

const store = {}

function seedInitialValues() {
  for (const facility of stadium.facilities) {
    if (STALE_FACILITY_IDS.has(facility.id)) continue
    store[facility.id] = {
      value: Math.round(clamp(20 + rand() * 40, 0, 100)),
      updatedAt: new Date().toISOString(),
      trend: 0,
    }
  }
}

function tick() {
  for (const facility of stadium.facilities) {
    if (STALE_FACILITY_IDS.has(facility.id)) continue
    const current = store[facility.id]
    if (!current) continue
    const delta = (rand() - 0.5) * STEP_SIZE
    const nextValue = Math.round(clamp(current.value + delta, 0, 100))
    store[facility.id] = {
      value: nextValue,
      updatedAt: new Date().toISOString(),
      trend: Math.round(nextValue - current.value),
    }
  }
}

let intervalHandle = null

export function startCongestionSimulator() {
  if (intervalHandle) return
  seedInitialValues()
  intervalHandle = setInterval(tick, UPDATE_INTERVAL_MS)
}

export function stopCongestionSimulator() {
  if (!intervalHandle) return
  clearInterval(intervalHandle)
  intervalHandle = null
}

export function getCongestionSnapshot() {
  return { ...store }
}
