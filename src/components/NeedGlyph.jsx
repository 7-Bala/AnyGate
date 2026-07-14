/**
 * NeedGlyph — clean, universally-recognised accessibility icons.
 * Uses proven Lucide-compatible path geometry tuned for 24×24 viewbox.
 */
const PATHS = {
  // ISA wheelchair symbol - matching user image
  wheelchair: (
    <>
      {/* head */}
      <circle cx="10" cy="4.5" r="1.5" fill="currentColor" stroke="none" />
      {/* body: torso, thigh, and shin/leg in a single connected path */}
      <path d="M 10,7 L 10,13.5 L 17,13.5 L 21,19.5" strokeWidth="1.9" />
      {/* arm */}
      <path d="M 10,9.5 L 16,9.5" strokeWidth="1.9" />
      {/* wheel (3/4 circular arc) */}
      <path d="M 9,10 A 5.5 5.5 0 1 0 15.5,15.5" strokeWidth="1.9" />
    </>
  ),

  // Elderly couple with canes - matching the 2nd user image
  limited_mobility: (
    <g transform="scale(0.24)" fill="currentColor">
      {/* Woman (left) */}
      <circle cx="24" cy="11.5" r="4.5" />
      <circle cx="24" cy="21" r="8" />
      <path d="M 14,27 C 9,27 6,32 6,38 L 12,68 L 38,68 L 32,36 L 44,48 C 45,49.5 47,49.5 48,48 C 49,46.5 48.5,44.5 47,43 L 37,28 C 35.5,26 33.5,25 31.5,25 Z" />
      <rect x="12" y="68" width="6.5" height="22" rx="3" />
      <rect x="27.5" y="68" width="6.5" height="22" rx="3" />
      <path d="M 42,57 C 40,55 40,51 45,51 C 50,51 50,55 50,58 L 50,88" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />

      {/* Man (right) */}
      <circle cx="68" cy="20" r="8" />
      <path d="M 58,27 C 53,27 50,32 50,38 L 57,68 L 80,68 L 80,36 L 89,48 C 90,49.5 92,49.5 93,48 C 94,46.5 93.5,44.5 92,43 L 82,28 C 80.5,26 78.5,25 76.5,25 Z" />
      <rect x="57" y="68" width="6.5" height="22" rx="3" />
      <rect x="72.5" y="68" width="6.5" height="22" rx="3" />
      <path d="M 83,57 C 81,55 81,51 86,51 C 91,51 91,55 91,58 L 91,88" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    </g>
  ),

  // Visual impairment - eye with vertical bars and diagonal slash matching the 1st user image
  visual_impairment: (
    <g transform="scale(0.24)" fill="currentColor">
      <path d="M93.3,49c-0.8-0.8-19.5-19.9-43-20.1h-0.1c0,0,0,0-0.1,0H50c-3.1,0-6.1,0.3-9,0.9l-9.1-17.1l-2.6,1.4L38,30.5 C19.1,35.4,5.8,50,5.8,50s2.3,2.6,4.2,4.1c2.2,1.8,7.7,5.9,7.7,5.9l-5.8-11.8c1.5-1.3,3.4-2.8,5.7-4.5l12.2,22.9l4.3,1.7L20.1,42 c2.3-1.5,5-3.1,7.8-4.5l17.8,33.4l3.5,0.2L44.3,62c1.8,0.9,3.8,1.4,5.9,1.4c1.7,0,3.3-0.3,4.8-0.9l13.2,24.9l2.6-1.4l-8.7-16.4 c17.8-4.8,30.6-18,31.2-18.6l1-1L93.3,49z M68.3,50c0,6.2-3.2,12-8.4,15.3l-2.3-4.2c3.6-2.4,5.9-6.5,5.9-11.1 c0-7.4-6-13.3-13.3-13.3c-1.8,0-3.5,0.4-5,1l-2.3-4.3c2.3-1,4.7-1.5,7.2-1.5c0.1,0,0.1,0,0.2,0C60.2,32,68.3,40,68.3,50z M37,48.2 l-6.3-11.9c2.8-1.2,5.7-2.3,8.8-3l3.1,5.8C39.5,41.2,37.5,44.4,37,48.2z M64.2,65.7c4.4-4,7-9.6,7-15.7c0-6.2-2.7-11.8-7.1-15.7 C77,38.5,86.9,47,90.1,50C86.9,53,77,61.5,64.2,65.7z" />
    </g>
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
