import { useEffect, useMemo, useState } from 'react'
import { useAppContext } from '../context/useAppContext.js'
import { useT } from '../i18n/useT.js'
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
  const t = useT()
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
        <h2 id="recommendation-heading" className="mb-3 font-display text-2xl font-bold">
          {t('recommendationTitle')}
        </h2>
        <RecommendationCard
          key={shownResult.facility.id}
          result={shownResult}
          explanation={explanation.loading ? t('explanationLoading') : explanation.error ? t('explanationError') : explanation.text}
          headingId="top-recommendation-name"
          variant="hero"
          animate
        />
      </div>

      {alternates.length > 0 && (
        <div>
          <h2 className="mb-3 font-display text-xl font-bold">{t('alternatesTitle')}</h2>
          <div className="flex flex-col gap-3">
            {alternates.map((result, i) => (
              <RecommendationCard
                key={result.facility.id}
                result={result}
                headingId={`alt-${result.facility.id}`}
                variant="alternate"
                className="stagger-in"
                style={{ animationDelay: `${i * 90}ms` }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
