import { createContext, useContext, useMemo, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [onboarded, setOnboarded] = useState(false)
  const [needs, setNeeds] = useState([])
  const [language, setLanguage] = useState('en')
  const [highContrast, setHighContrast] = useState(false)
  const [simpleLanguage, setSimpleLanguage] = useState(false)
  const [currentRecommendation, setCurrentRecommendation] = useState(null)
  const [staffAssistanceRequested, setStaffAssistanceRequested] = useState(false)

  // uiChrome holds a runtime-translated { key: text } dictionary for
  // languages beyond the hand-verified en/es/ar static ones (see
  // useUiChromeLoader). uiChromeStatus lets the UI show a small,
  // non-alarming indicator rather than silently and invisibly falling
  // back to English.
  const [uiChrome, setUiChrome] = useState(null)
  const [uiChromeStatus, setUiChromeStatus] = useState('static')

  const value = useMemo(
    () => ({
      onboarded,
      completeOnboarding: () => setOnboarded(true),
      needs,
      setNeeds,
      language,
      setLanguage,
      highContrast,
      setHighContrast,
      simpleLanguage,
      setSimpleLanguage,
      currentRecommendation,
      setCurrentRecommendation,
      staffAssistanceRequested,
      requestStaffAssistance: () => setStaffAssistanceRequested(true),
      clearStaffAssistanceRequest: () => setStaffAssistanceRequested(false),
      uiChrome,
      setUiChrome,
      uiChromeStatus,
      setUiChromeStatus,
    }),
    [
      onboarded,
      needs,
      language,
      highContrast,
      simpleLanguage,
      currentRecommendation,
      staffAssistanceRequested,
      uiChrome,
      uiChromeStatus,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
