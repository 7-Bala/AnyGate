import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import StaffAssistanceButton from './StaffAssistanceButton.jsx'

export default function NoValidRoute() {
  const { language } = useAppContext()

  return (
    <section
      role="alert"
      aria-labelledby="no-route-heading"
      className="flex flex-col gap-4 rounded-2xl border-2 border-gold bg-ink p-6 text-chalk"
    >
      <h2 id="no-route-heading" className="font-display text-2xl font-bold text-gold">
        {t('noRouteTitle', language)}
      </h2>
      <p className="text-chalk/85">{t('noRouteBody', language)}</p>
      <StaffAssistanceButton />
    </section>
  )
}
