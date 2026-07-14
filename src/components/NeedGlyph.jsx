// Same hand-drawn geometric language as FacilityGlyph. The sensory-
// sensitivity glyph deliberately reuses the quiet-room wave shape —
// they mean the same thing wherever they appear.
const PATHS = {
  wheelchair: (
    <>
      <circle cx="17" cy="17" r="4.5" />
      <path d="M10 4v9h7M10 6.5h4M10 13l4 4" />
    </>
  ),
  visual_impairment: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  hearing_impairment: (
    <path d="M7 18a6 6 0 0 1 0-8.5c1.6-1.6 1.6-4.4 0-6M11 18a10 10 0 0 1 0-14M15 15.5a5 5 0 0 1 0-7" />
  ),
  sensory_sensitive: <path d="M4 15c2-4 4-4 6 0s4 4 6 0 4-4 4 0" />,
  limited_mobility: (
    <path d="M12 3v3M12 10v11M8 21h8M9 7h6l3 6-8 1" />
  ),
}

export default function NeedGlyph({ type, className = 'h-6 w-6' }) {
  const path = PATHS[type]
  if (!path) return null
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
