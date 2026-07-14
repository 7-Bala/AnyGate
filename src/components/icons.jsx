// Shared icon set — every icon renders through the same base attributes
// (feather-style: 24x24 viewBox, stroke-only, round caps/joins) instead of
// each call site repeating the same six SVG attributes. Consistent with
// FacilityGlyph.jsx and NeedGlyph.jsx: hand-drawn glyphs, not a stock pack.
function IconBase({ className, strokeWidth = 2, children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export function PlayIcon(props) {
  return (
    <IconBase {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </IconBase>
  )
}

export function StopIcon(props) {
  return (
    <IconBase {...props}>
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </IconBase>
  )
}

export function MicIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="22" />
    </IconBase>
  )
}

export function RecordingIcon(props) {
  return (
    <IconBase {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </IconBase>
  )
}

export function SendIcon(props) {
  return (
    <IconBase {...props}>
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </IconBase>
  )
}

export function BellIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </IconBase>
  )
}

export function CheckCircleIcon(props) {
  return (
    <IconBase {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </IconBase>
  )
}

export function AlertCircleIcon(props) {
  return (
    <IconBase {...props} strokeWidth={props.strokeWidth ?? 2.5}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </IconBase>
  )
}

export function CompassIcon(props) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9.5" strokeWidth="1.8" />
      <polygon points="12,4 10.5,12 12,10.5 13.5,12" fill="currentColor" stroke="none" />
      <polygon points="12,20 13.5,12 12,13.5 10.5,12" fill="none" strokeWidth="1.5" />
      <line x1="12" y1="3" x2="12" y2="5" strokeWidth="1.8" />
      <line x1="12" y1="19" x2="12" y2="21" strokeWidth="1.8" />
      <line x1="3" y1="12" x2="5" y2="12" strokeWidth="1.8" />
      <line x1="19" y1="12" x2="21" y2="12" strokeWidth="1.8" />
    </IconBase>
  )
}
