import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import { filterValidOptions, scoreAndRank } from '../engine/index.js'
import { subscribeToCongestion } from '../services/firestoreClient.js'
import stadium from '../data/stadium.json'
import RecommendationCard from './RecommendationCard.jsx'
import NoValidRoute from './NoValidRoute.jsx'
import AlertBanner from './AlertBanner.jsx'
import { useRecommendationExplanation } from '../hooks/useRecommendationExplanation.js'

const gates = stadium.facilities.filter((f) => f.type === 'gate')

export default function RouteView() {
  const { needs, language, simpleLanguage, setCurrentRecommendation } = useAppContext()
  const [congestion, setCongestion] = useState({})
  const [shownFacilityId, setShownFacilityId] = useState(null)

  useEffect(() => {
    const unsubscribe = subscribeToCongestion(setCongestion, { intervalMs: 5000 })
    return unsubscribe
  }, [])

  const rankedGates = useMemo(() => {
    const valid = filterValidOptions(gates, needs)
    return scoreAndRank(valid, congestion, needs)
  }, [needs, congestion])

  // Freeze the shown recommendation at first computation so the fan sees a
  // stable pick; AlertBanner separately watches live congestion for that
  // pick crossing capacity and offers a proactive switch instead of the
  // top choice silently changing under them.
  useEffect(() => {
    if (!shownFacilityId && rankedGates.length > 0) {
      setShownFacilityId(rankedGates[0].facility.id)
    }
  }, [rankedGates, shownFacilityId])

  const shownResult = rankedGates.find((r) => r.facility.id === shownFacilityId) ?? rankedGates[0] ?? null

  useEffect(() => {
    setCurrentRecommendation(shownResult ?? null)
  }, [shownResult, setCurrentRecommendation])

  const explanation = useRecommendationExplanation({
    result: shownResult,
    allFacilities: stadium.facilities,
    language,
    simpleLanguage,
  })

  if (rankedGates.length === 0) {
    return <NoValidRoute />
  }

  const alternates = rankedGates.filter((r) => r.facility.id !== shownResult.facility.id).slice(0, 2)

  return (
    <section aria-labelledby="recommendation-heading" className="flex flex-col gap-6">
      <AlertBanner
        rankedGates={rankedGates}
        shownFacilityId={shownResult.facility.id}
        onSwitch={setShownFacilityId}
      />

      <div>
        <h2 id="recommendation-heading" className="mb-3 text-xl font-semibold">
          {t('recommendationTitle', language)}
        </h2>
        <RecommendationCard
          result={shownResult}
          explanation={explanation.loading ? t('explanationLoading', language) : explanation.error ? t('explanationError', language) : explanation.text}
          headingId="top-recommendation-name"
        />
      </div>

      {alternates.length > 0 && (
        <div>
          <h2 className="mb-3 text-lg font-semibold">{t('alternatesTitle', language)}</h2>
          <div className="flex flex-col gap-4">
            {alternates.map((result) => (
              <RecommendationCard key={result.facility.id} result={result} headingId={`alt-${result.facility.id}`} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
