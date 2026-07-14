// Same hand-drawn geometric language as FacilityGlyph.
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
      <path d="M6 18.5c-3-2.5-3-5.2-3-7.5a9 9 0 0 1 18 0c0 4.5-4 8-8 8" />
      <path d="M12 11.5a4 4 0 0 0-4 4" />
    </>
  ),
  sensory_sensitive: (
    <>
      <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
    </>
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
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
