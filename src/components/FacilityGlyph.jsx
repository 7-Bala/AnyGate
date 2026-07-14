// Custom geometric glyphs for facility types — a consistent hand-drawn
// visual language (not a stock icon pack) that recurs everywhere a
// facility type needs to be shown without relying on color alone.
const PATHS = {
  gate: (
    <path d="M7 21V11a5 5 0 0 1 10 0v10M5 21h14M9 21v-6M15 21v-6" />
  ),
  restroom: (
    <>
      <circle cx="12" cy="6.5" r="2.5" />
      <path d="M7.5 21v-7.5a4.5 4.5 0 0 1 9 0V21" />
    </>
  ),
  quiet_room: (
    <path d="M4 15c2-4 4-4 6 0s4 4 6 0 4-4 4 0" />
  ),
  medical: (
    <path d="M12 5v14M5 12h14" />
  ),
  guest_services: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
}

export default function FacilityGlyph({ type, className = 'h-6 w-6' }) {
  const path = PATHS[type] ?? PATHS.guest_services
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
