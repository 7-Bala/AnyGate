import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'

export default function StaffAssistanceButton({ className = '' }) {
  const { language, staffAssistanceRequested, requestStaffAssistance } = useAppContext()

  if (staffAssistanceRequested) {
    return (
      <p role="status" className="rounded-full bg-teal px-4 py-3 font-medium text-ink">
        {t('staffRequested', language)}
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={requestStaffAssistance}
      className={`rounded-full bg-gold px-4 py-3 font-semibold text-ink transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${className}`}
    >
      {t('requestStaff', language)}
    </button>
  )
}
