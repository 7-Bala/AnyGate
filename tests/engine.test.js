import { describe, it, expect } from 'vitest'
import { filterValidOptions } from '../src/engine/filterValidOptions.js'
import { scoreAndRank } from '../src/engine/scoreAndRank.js'
import stadium from '../src/data/stadium.json' with { type: 'json' }

const facilities = stadium.facilities
const byId = (id) => facilities.find((f) => f.id === id)

describe('filterValidOptions', () => {
  it('excludes facilities flagged under_maintenance even if otherwise accessible', () => {
    const result = filterValidOptions(facilities, ['wheelchair'])
    expect(result.find((f) => f.id === 'gate-b')).toBeUndefined()
  })

  it('excludes non-accessible facilities for a wheelchair need', () => {
    const result = filterValidOptions(facilities, ['wheelchair'])
    expect(result.find((f) => f.id === 'gate-d')).toBeUndefined()
    expect(result.find((f) => f.id === 'quiet-room-east')).toBeUndefined()
  })

  it('includes accessible facilities for a wheelchair need', () => {
    const result = filterValidOptions(facilities, ['wheelchair'])
    expect(result.find((f) => f.id === 'gate-a')).toBeDefined()
    expect(result.find((f) => f.id === 'quiet-room-west')).toBeDefined()
  })

  it('returns an empty array, never throws, when nothing qualifies', () => {
    const onlyMaintenance = [byId('gate-b')]
    const result = filterValidOptions(onlyMaintenance, ['wheelchair'])
    expect(result).toEqual([])
  })

  it('returns an empty array for an empty facilities list', () => {
    expect(filterValidOptions([], ['wheelchair'])).toEqual([])
  })

  it('handles conflicting needs (wheelchair + sensory_sensitive) correctly', () => {
    const quietRooms = [byId('quiet-room-east'), byId('quiet-room-west')]
    const result = filterValidOptions(quietRooms, ['wheelchair', 'sensory_sensitive'])
    expect(result.map((f) => f.id)).toEqual(['quiet-room-west'])
  })

  it('excludes everything when conflicting needs have no valid facility', () => {
    // quiet-room-east is the only non-accessible quiet room; isolating it
    // proves the filter returns empty rather than falling back to a guess.
    const result = filterValidOptions([byId('quiet-room-east')], ['wheelchair', 'sensory_sensitive'])
    expect(result).toEqual([])
  })

  it('does not apply hard filtering for needs without a structural requirement', () => {
    const result = filterValidOptions(facilities, ['visual_impairment'])
    // gate-d is not accessible but visual_impairment has no accessible requirement
    expect(result.find((f) => f.id === 'gate-d')).toBeDefined()
  })

  it('ignores unknown need keys instead of failing everything', () => {
    const result = filterValidOptions(facilities, ['made_up_need'])
    expect(result.length).toBeGreaterThan(0)
  })
})

describe('scoreAndRank', () => {
  it('returns an empty array for an empty input, never throws', () => {
    expect(scoreAndRank([], {}, ['wheelchair'])).toEqual([])
  })

  it('flags missing/stale congestion data as unknown without crashing', () => {
    const valid = filterValidOptions([byId('restroom-west-stale')], ['wheelchair'])
    const results = scoreAndRank(valid, {}, ['wheelchair'])
    expect(results).toHaveLength(1)
    expect(results[0].breakdown.congestionStatus).toBe('unknown')
    expect(Number.isFinite(results[0].score)).toBe(true)
  })

  it('treats present congestion data as live and scores lower congestion higher', () => {
    const valid = [byId('gate-a'), byId('gate-c')]
    const congestion = {
      'gate-a': { value: 10, updatedAt: new Date().toISOString(), trend: 0 },
      'gate-c': { value: 90, updatedAt: new Date().toISOString(), trend: 0 },
    }
    const results = scoreAndRank(valid, congestion, [])
    const gateA = results.find((r) => r.facility.id === 'gate-a')
    const gateC = results.find((r) => r.facility.id === 'gate-c')
    expect(gateA.breakdown.congestionStatus).toBe('live')
    expect(gateA.breakdown.congestionScore).toBeGreaterThan(gateC.breakdown.congestionScore)
  })

  it('flags over-capacity facilities and penalizes their score', () => {
    const valid = [byId('gate-a')]
    const congestion = {
      'gate-a': { value: 95, updatedAt: new Date().toISOString(), trend: 0 },
    }
    const results = scoreAndRank(valid, congestion, [])
    expect(results[0].breakdown.overCapacity).toBe(true)
  })

  it('ranks a full feature match above a partial match for the same need', () => {
    // gate-a has ramp+wide_turnstile+braille_signage+audio_beacon (full
    // match for visual_impairment); gate-c has only ramp+wide_turnstile
    // (no braille_signage/audio_beacon) — a partial match.
    const valid = [byId('gate-a'), byId('gate-c')]
    const congestion = {
      'gate-a': { value: 40, updatedAt: new Date().toISOString(), trend: 0 },
      'gate-c': { value: 40, updatedAt: new Date().toISOString(), trend: 0 },
    }
    const results = scoreAndRank(valid, congestion, ['visual_impairment'])
    const gateA = results.find((r) => r.facility.id === 'gate-a')
    const gateC = results.find((r) => r.facility.id === 'gate-c')
    expect(gateA.breakdown.featureMatchScore).toBeGreaterThan(gateC.breakdown.featureMatchScore)
    expect(gateA.score).toBeGreaterThan(gateC.score)
    // Partial match is still included and ranked, never excluded outright.
    expect(results.map((r) => r.facility.id)).toContain('gate-c')
  })

  it('every result includes a human-readable breakdown', () => {
    const valid = [byId('gate-a')]
    const results = scoreAndRank(valid, {}, ['wheelchair'])
    expect(results[0].notes.length).toBeGreaterThan(0)
    expect(typeof results[0].notes[0]).toBe('string')
  })

  it('sorts results by score descending', () => {
    const valid = [byId('gate-a'), byId('gate-c'), byId('gate-f')]
    const congestion = {
      'gate-a': { value: 20, updatedAt: new Date().toISOString(), trend: 0 },
      'gate-c': { value: 80, updatedAt: new Date().toISOString(), trend: 0 },
      'gate-f': { value: 50, updatedAt: new Date().toISOString(), trend: 0 },
    }
    const results = scoreAndRank(valid, congestion, [])
    const scores = results.map((r) => r.score)
    expect(scores).toEqual([...scores].sort((a, b) => b - a))
  })
})

describe('end-to-end: filter then score', () => {
  it('produces no valid route when needs conflict with the only matching facility type', () => {
    const filtered = filterValidOptions([byId('quiet-room-east')], ['wheelchair', 'sensory_sensitive'])
    const ranked = scoreAndRank(filtered, {}, ['wheelchair', 'sensory_sensitive'])
    expect(ranked).toEqual([])
  })

  it('resolves conflicting needs to the one valid quiet room, ranked with a breakdown', () => {
    const quietRooms = [byId('quiet-room-east'), byId('quiet-room-west')]
    const filtered = filterValidOptions(quietRooms, ['wheelchair', 'sensory_sensitive'])
    const ranked = scoreAndRank(filtered, {}, ['wheelchair', 'sensory_sensitive'])
    expect(ranked).toHaveLength(1)
    expect(ranked[0].facility.id).toBe('quiet-room-west')
  })
})
