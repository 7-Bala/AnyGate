import { useAppContext } from '../context/useAppContext.js'
import { useT } from '../i18n/useT.js'
import { useTranslated } from '../hooks/useTranslated.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import { AlertCircleIcon } from './icons.jsx'

// Watches the live-ranked list for the facility that was actually shown to
// the fan (shownFacilityId, frozen by RouteView at display time) crossing
// its own capacity_threshold. Reuses RouteView's existing congestion
// subscription/ranking rather than polling /api/congestion a second time,
// so the banner and the recommendation never disagree with each other.
export default function AlertBanner({ rankedGates, shownFacilityId, onSwitch }) {
  const { language } = useAppContext()
  const t = useT()
  const reducedMotion = useReducedMotion()

  const shown = rankedGates.find((r) => r.facility.id === shownFacilityId)
  const alternate = rankedGates.find((r) => r.facility.id !== shownFacilityId)

  const facilityName = useTranslated(shown?.facility.name ?? '', language)
  const alternateName = useTranslated(alternate?.facility.name ?? '', language)

  if (!shown?.breakdown.overCapacity || !alternate) return null

  return (
    <div
      role="alert"
      className={`flex flex-col gap-3 rounded-2xl border-2 border-coral-strong bg-coral/10 p-4 dark:border-coral dark:bg-coral/15 sm:flex-row sm:items-center sm:justify-between ${
        reducedMotion ? '' : 'alert-slide-in'
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-coral"
          aria-hidden="true"
        >
          <AlertCircleIcon className="h-4 w-4" />
        </span>
        <div>
          <p className="font-display text-lg font-bold text-coral-strong dark:text-coral">{t('congestionAlertTitle')}</p>
          <p className="text-sm text-ink dark:text-chalk">
            <bdi className="font-semibold">{facilityName}</bdi> {t('congestionAlertBody')}{' '}
            <bdi className="font-semibold">{alternateName}</bdi>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onSwitch(alternate.facility.id)}
        className="shrink-0 rounded-lg bg-coral-strong px-4 py-2 font-medium text-chalk hover:bg-coral-strong/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink dark:bg-coral dark:text-ink dark:hover:bg-coral/90"
      >
        {t('switchTo')}
      </button>
    </div>
  )
}
