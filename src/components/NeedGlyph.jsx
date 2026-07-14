// Same hand-drawn geometric language as FacilityGlyph. The sensory-
// sensitivity glyph deliberately reuses the quiet-room wave shape —
// they mean the same thing wherever they appear.
const PATHS = {
  wheelchair: (
    <>
      <circle cx="16" cy="4" r="1.5" />
      <path d="m18 19 1-7-6 1" />
      <path d="m5 8 3-3 5.5 3-2.36 3.5" />
      <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
      <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
    </>
  ),
  visual_impairment: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  hearing_impairment: (
    <>
      <path d="M6 18.5c-1.4-1.2-2.1-2.9-2.1-4.7 0-3.3 2.7-6 6-6 .5 0 1 .1 1.5.2" />
      <path d="M12 7.7a8.4 8.4 0 0 1 2.3-1.6" />
      <path d="M16.1 16.1c-1.3 1.3-3.1 2-4.9 2-3.3 0-6-2.7-6-6 0-1.8.7-3.5 2.1-4.7" />
      <path d="M2 2l20 20" />
      <path d="M8.2 12a4 4 0 0 0 4 4" />
    </>
  ),
  sensory_sensitive: (
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
  ),
  limited_mobility: (
    <>
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v8" />
      <path d="m10 20 2-6 2 6" />
      <path d="m9 9 3 1 3-2" />
      <path d="M16 8h1a1 1 0 0 1 1 1v12" />
    </>
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
