/**
 * NeedGlyph — clean, universally-recognised accessibility icons.
 * Uses proven Lucide-compatible path geometry tuned for 24×24 viewbox.
 */
const PATHS = {
  // ISA-style active wheelchair user (forward-leaning, sport pose)
  wheelchair: (
    <>
      {/* head */}
      <circle cx="12" cy="3.5" r="1.6" fill="currentColor" stroke="none" />
      {/* body leaning forward */}
      <path d="M12 5.1 L11 10" strokeWidth="1.9" />
      {/* outstretched arm pushing wheel */}
      <path d="M11.5 7.5 L16 9" strokeWidth="1.9" />
      {/* seat */}
      <path d="M11 10 L11 13.5 L15.5 13.5" strokeWidth="1.9" />
      {/* large rear wheel */}
      <circle cx="11" cy="18" r="4.5" strokeWidth="1.9" />
      {/* small front caster */}
      <circle cx="17.5" cy="19.5" r="1.3" strokeWidth="1.7" />
    </>
  ),

  // Person leaning on a walker - matching user image
  limited_mobility: (
    <>
      {/* head */}
      <circle cx="13.5" cy="5.5" r="2" strokeWidth="1.9" />
      {/* back, shoulder, and arm reaching down/right to walker */}
      <path d="M8.5 13 C8 9.5 10.5 7.5 11.5 8 C12.5 8.5 13.5 10.5 14.5 12" strokeWidth="1.9" />
      {/* bent leg */}
      <path d="M8.5 13 L6.5 16.5 C5.8 18.5 7 20.5 8.5 20.5 C10 20.5 10.2 18.5 9.8 13" strokeWidth="1.9" fill="none" />
      {/* walker frame */}
      <path d="M12.5 21 L13.2 13.5 C13.4 12.2 16.6 12.2 16.8 13.5 L17.5 21" strokeWidth="1.9" />
      {/* walker horizontal bar */}
      <path d="M13.1 16.2 L16.9 16.2" strokeWidth="1.9" />
    </>
  ),

  // Eye crossed out — visual impairment (Lucide "eye-off" style)
  visual_impairment: (
    <>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeWidth="1.9" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeWidth="1.9" />
      <path d="M10.73 10.73A3 3 0 0 0 15 15" strokeWidth="1.9" />
      <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  // Speaker / ear with waves + slash — "sound off" = hearing impairment
  hearing_impairment: (
    <>
      {/* speaker box */}
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeWidth="1.9" />
      {/* sound wave 1 */}
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" strokeWidth="1.9" />
      {/* sound wave 2 */}
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" strokeWidth="1.9" />
      {/* slash across it */}
      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" />
    </>
  ),

  // Headphones + wavy lines = sensory overload / noise sensitivity
  sensory_sensitive: (
    <>
      {/* headband arc */}
      <path d="M6 12 A6 6 0 0 1 18 12" strokeWidth="1.9" />
      {/* left earpad */}
      <rect x="3.5" y="12" width="4.5" height="6" rx="1.5" strokeWidth="1.9" />
      {/* right earpad */}
      <rect x="16" y="12" width="4.5" height="6" rx="1.5" strokeWidth="1.9" />
      {/* stimulus waves at top (sensory input) */}
      <path d="M9 7 Q10 5 11 7 Q12 9 13 7 Q14 5 15 7" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10.5 4 Q11.25 2.5 12 4 Q12.75 5.5 13.5 4" strokeWidth="1.3" strokeLinecap="round" />
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {path}
    </svg>
  )
}
