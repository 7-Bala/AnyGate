import { useAppContext } from '../context/AppContext.jsx'
import { useT } from '../i18n/useT.js'

export default function StaffAssistanceButton({ className = '' }) {
  const { staffAssistanceRequested, requestStaffAssistance } = useAppContext()
  const t = useT()

  if (staffAssistanceRequested) {
    return (
      <p role="status" className="flex items-center justify-center gap-2 rounded-full bg-teal px-4 py-3 font-medium text-ink">
        <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
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
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span>{t('requestStaff')}</span>
    </button>
  )
}
