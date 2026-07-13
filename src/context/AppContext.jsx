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
    }),
    [onboarded, needs, language, highContrast, simpleLanguage, currentRecommendation, staffAssistanceRequested],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
