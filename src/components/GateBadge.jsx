import { useMemo } from 'react'
import FacilityGlyph from './FacilityGlyph.jsx'
import { useReducedMotion } from '../hooks/useReducedMotion.js'

const SIZES = {
  hero: { plate: 132, letter: 'text-6xl', glyph: 'h-12 w-12', ring: 3 },
  md: { plate: 72, letter: 'text-2xl', glyph: 'h-7 w-7', ring: 2.5 },
  sm: { plate: 40, letter: 'text-base', glyph: 'h-4 w-4', ring: 2 },
}

function gateLetter(facilityName) {
  const match = facilityName?.match(/([A-Za-z0-9])\s*$/)
  return match ? match[1].toUpperCase() : '?'
}

// The signature element: a stadium-sign badge that is always an ink
// plate (regardless of page light/dark theme), so the gold/coral/teal
// glow ring is always displayed on a dark backdrop where those colors
// are contrast-safe as bright accents — this was a direct consequence
// of the contrast audit, not just an aesthetic choice.
export default function GateBadge({
  facilityType,
  facilityName,
  congestionValue,
  congestionStatus,
  overCapacity,
  size = 'md',
  animate = false,
  statusLabel,
  liveLabel,
  unknownLabel,
}) {
  const reducedMotion = useReducedMotion()
  const dims = SIZES[size]

  const ringColorClass = useMemo(() => {
    if (congestionStatus !== 'live') return 'text-white/30'
    if (overCapacity) return 'text-coral'
    return 'text-gold'
  }, [congestionStatus, overCapacity])

  // Preserves the ring's semantic color in high-contrast mode (see the
  // .hc [data-accent] rules in index.css) instead of collapsing every
  // state to plain white — high contrast should still be legible as a
  // deliberate theme, not just a grayscale filter.
  const accentAttr = congestionStatus !== 'live' ? undefined : overCapacity ? 'coral' : 'gold'

  const pulseDuration = useMemo(() => {
    if (typeof congestionValue !== 'number') return null
    const t = Math.min(1, Math.max(0, congestionValue / 100))
    return (4.2 - t * 3).toFixed(2) + 's'
  }, [congestionValue])

  const showGateLetter = facilityType === 'gate'
  const label = showGateLetter ? gateLetter(facilityName) : null

  const congestionCaption =
    congestionStatus === 'live'
      ? `${congestionValue}% · ${liveLabel ?? 'live'}`
      : `— · ${unknownLabel ?? 'unknown'}`

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div
        data-badge-plate
        className="relative flex items-center justify-center rounded-2xl bg-ink shadow-lg"
        style={{ width: dims.plate, height: dims.plate }}
      >
        <svg
          data-accent={accentAttr}
          className={`absolute inset-[-6px] ${ringColorClass} ${
            !reducedMotion && congestionStatus === 'live' ? 'gate-badge-pulse' : ''
          }`}
          style={pulseDuration ? { '--pulse-duration': pulseDuration } : undefined}
          viewBox="0 0 100 100"
          aria-hidden="true"
        >
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="20"
            fill="none"
            stroke="currentColor"
            strokeWidth={
              reducedMotion && typeof congestionValue === 'number'
                ? 3 + (congestionValue / 100) * 5
                : dims.ring
            }
          />
        </svg>

        <div className={`relative z-10 text-chalk ${animate && !reducedMotion ? 'gate-badge-power-on' : ''}`}>
          {showGateLetter ? (
            <span className={`font-display font-black leading-none ${dims.letter}`}>{label}</span>
          ) : (
            <FacilityGlyph type={facilityType} className={dims.glyph} />
          )}
        </div>

        {reducedMotion && congestionStatus === 'live' && (
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-current" style={{ color: overCapacity ? '#FF6469' : '#FFB627' }} aria-hidden="true" />
        )}
      </div>

      <span className="font-mono text-xs tabular-nums text-ink/70 dark:text-chalk/70">
        <bdi>{statusLabel ?? congestionCaption}</bdi>
      </span>
    </div>
  )
}
