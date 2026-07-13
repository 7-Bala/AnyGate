import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import { useTranslated } from '../hooks/useTranslated.js'

// Watches the live-ranked list for the facility that was actually shown to
// the fan (shownFacilityId, frozen by RouteView at display time) crossing
// its own capacity_threshold. Reuses RouteView's existing congestion
// subscription/ranking rather than polling /api/congestion a second time,
// so the banner and the recommendation never disagree with each other.
export default function AlertBanner({ rankedGates, shownFacilityId, onSwitch }) {
  const { language } = useAppContext()

  const shown = rankedGates.find((r) => r.facility.id === shownFacilityId)
  const alternate = rankedGates.find((r) => r.facility.id !== shownFacilityId)

  const facilityName = useTranslated(shown?.facility.name ?? '', language)
  const alternateName = useTranslated(alternate?.facility.name ?? '', language)

  if (!shown?.breakdown.overCapacity || !alternate) return null

  return (
    <div
      role="alert"
      className="flex flex-col gap-3 rounded-xl border-2 border-red-500 bg-red-50 p-4 dark:bg-red-950 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <p className="font-semibold text-red-900 dark:text-red-100">{t('congestionAlertTitle', language)}</p>
        <p className="text-red-900 dark:text-red-100">
          {facilityName} {t('congestionAlertBody', language)} <strong>{alternateName}</strong>
        </p>
      </div>
      <button
        type="button"
        onClick={() => onSwitch(alternate.facility.id)}
        className="shrink-0 rounded-lg bg-red-600 px-4 py-2 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-900"
      >
        {t('switchTo', language)}
      </button>
    </div>
  )
}
