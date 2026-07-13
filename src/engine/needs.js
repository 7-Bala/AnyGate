// requiresAccessible: a hard structural requirement — facilities failing it
// are excluded outright in filterValidOptions, never merely down-ranked.
// relevantFeatures: used only for scoring (feature-match completeness),
// never for exclusion.
export const NEED_DEFINITIONS = {
  wheelchair: {
    requiresAccessible: true,
    relevantFeatures: ['ramp', 'wide_turnstile', 'wheelchair_stall', 'wide_doorway'],
  },
  limited_mobility: {
    requiresAccessible: true,
    relevantFeatures: ['ramp', 'wide_doorway', 'grab_bars'],
  },
  visual_impairment: {
    requiresAccessible: false,
    relevantFeatures: ['braille_signage', 'audio_beacon'],
  },
  hearing_impairment: {
    requiresAccessible: false,
    relevantFeatures: ['assistive_listening_devices', 'audio_beacon'],
  },
  sensory_sensitive: {
    requiresAccessible: false,
    relevantFeatures: ['low_light', 'noise_dampening', 'quiet_queue_lane'],
  },
}

export const VALID_NEEDS = Object.keys(NEED_DEFINITIONS)
