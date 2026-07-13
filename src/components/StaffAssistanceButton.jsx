import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'

export default function StaffAssistanceButton({ className = '' }) {
  const { language, staffAssistanceRequested, requestStaffAssistance } = useAppContext()

  if (staffAssistanceRequested) {
    return (
      <p role="status" className="rounded-lg bg-green-100 p-3 text-green-900 dark:bg-green-900 dark:text-green-100">
        {t('staffRequested', language)}
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={requestStaffAssistance}
      className={`rounded-lg bg-amber-600 px-4 py-3 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900 ${className}`}
    >
      {t('requestStaff', language)}
    </button>
  )
}
