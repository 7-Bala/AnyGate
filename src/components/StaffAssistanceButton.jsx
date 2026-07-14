import { useAppContext } from '../context/useAppContext.js'
import { useT } from '../i18n/useT.js'
import { CheckCircleIcon, BellIcon } from './icons.jsx'

export default function StaffAssistanceButton({ className = '' }) {
  const { staffAssistanceRequested, requestStaffAssistance } = useAppContext()
  const t = useT()

  if (staffAssistanceRequested) {
    return (
      <p role="status" className="flex items-center justify-center gap-2 rounded-full bg-teal px-4 py-3 font-medium text-ink">
        <CheckCircleIcon className="h-5 w-5 shrink-0" />
        <span>{t('staffRequested')}</span>
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={requestStaffAssistance}
      className={`flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 font-semibold text-ink transition-transform hover:scale-[1.01] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-chalk ${className}`}
    >
      <BellIcon className="h-5 w-5 shrink-0" />
      <span>{t('requestStaff')}</span>
    </button>
  )
}
