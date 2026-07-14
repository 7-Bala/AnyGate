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

  // International Symbol for Deafness - matching the 2nd user image
  hearing_impairment: (
    <g transform="scale(0.065)" fill="currentColor">
      <path d="M48.8 369H0v-55.9l85.7-86.7c22.2 12.8 45.8 27.2 64.9 39.5L48.8 369Zm10.4-220.7c-.7-.6-1.3-1.5-1-2.9 4.4-20.9 13.7-40.4 28.5-55.9 12.3-12.8 28.2-22.4 45.4-28.1 11.4-3.8 23.3-5.4 35.3-5.4 36.8.2 71.9 19.5 92 50.3 21.5 32.8 24.6 73.8 6.2 112.2-7 14.5-15.9 23.4-26.6 33.4-10 9.2-17.6 18-23.9 25.9-7.6 9.4-13.2 17.9-16.5 25.8-5.7 13.5-9 22.2-19.5 31.6-7.6 6.8-16.6 11.2-26.8 12.1-16.4 1.6-28.8-2.7-38-10.2-1.4-1.1-3.2-4.1-3.3-7-.1-5.2 2.8-8.4 8.1-8.5 3.1 0 4.9 1.9 7.7 3.8 10 6.8 23 8.8 36.3.5 11.6-7.4 16.8-25.2 23.5-37.7 10.8-20.4 26.3-38.1 43.2-53.6 25.1-23.2 36-58.6 24.9-94.6-5.8-19.1-17.9-36.1-34.3-47.8-10.5-7.5-23.3-13.1-36.4-15.5-19.7-3.7-38.2-2.3-58.6 8-13.6 6.8-26 18.2-34.4 30.5-8.4 12.2-13.4 25.9-15.1 40.7-.1.5-.5.8-1.1.6-.5-.2-1.1-.4-1.6-.7-5.6-2.3-9.8-4.5-14-7.5Zm39.4-9.5c-.9-.7-1.1-1.6-.6-2.8 7.7-17.1 21.1-31 38.2-38.8 10.1-4.5 21.2-7 32.3-6.9 19.4.1 38.5 7.8 52.6 21.2 17.7 16.9 26.3 42.1 22.9 66.3-1.9 13.8-7.2 28.6-16.3 37.4-.2.2-.5.4-1 .4-3.1-.4-6-1.3-9.4-4.2-1.2-1-1.7-1.5-2.3-2.3-.3-.4-.4-1.2.1-1.9 7.3-8.6 12.3-20.6 13.9-31.8 2.6-18.7-6-38.6-19.7-51.7-10.9-10.4-19.9-16.6-41.7-16.5-21.8.2-41.7 10.5-52.9 32-.8 1.6-1.6 3.3-2.2 4.9-.3.7-1 1-2 .7-1.6-.4-3.2-.7-4.7-1.4-3.1-1.4-5-2.9-7.2-4.6ZM244 66l65.3-66H360v53.9s-59.3 60.2-71.4 72.3c-.7.7-1.1.7-1.3-.1C279.1 102 263.8 81.2 244 66Z"/>
    </g>
  ),

  // Sensory sensitivity (tactile sensitivity/overload) - matching the 1st user image
  sensory_sensitive: (
    <g transform="scale(0.24)" fill="currentColor">
      {/* Hand silhouette */}
      <path d="M38 90h24V78c0-3 4-6 7-12V34c0-2.5-4.5-2.5-4.5 0v24h-1.5V22c0-2.5-4.5-2.5-4.5 0v24h-1.5V17c0-2.5-4.5-2.5-4.5 0v24h-1.5V12c0-2.5-4.5-2.5-4.5 0v48h-3c-3 0-6-5-8-10l-6-12c-2-4-5-1-5 2 0 7 7 17 10 25v13z" />
      {/* 6 wavy sensory lines around the hand */}
      <path d="M 11 5 C 15 13 25 9 26 21" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M 2 32 C 8 28 14 38 20 34" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M 2 54 C 8 50 14 60 20 56" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M 89 7 C 85 15 75 11 74 23" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M 78 38 C 84 34 90 44 96 40" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
      <path d="M 78 60 C 84 56 90 66 96 62" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    </g>
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
