import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import StaffAssistanceButton from './StaffAssistanceButton.jsx'

export default function NoValidRoute() {
  const { language } = useAppContext()

  return (
    <section
      role="alert"
      aria-labelledby="no-route-heading"
      className="flex flex-col gap-4 rounded-xl border-2 border-amber-500 bg-amber-50 p-6 dark:bg-amber-950"
    >
      <h2 id="no-route-heading" className="text-xl font-semibold text-amber-900 dark:text-amber-100">
        {t('noRouteTitle', language)}
      </h2>
      <p className="text-amber-900 dark:text-amber-100">{t('noRouteBody', language)}</p>
      <StaffAssistanceButton />
    </section>
  )
}
