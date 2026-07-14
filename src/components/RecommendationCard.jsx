import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import { useTranslated } from '../hooks/useTranslated.js'
import { useReducedMotion } from '../hooks/useReducedMotion.js'
import GateBadge from './GateBadge.jsx'

function TranslatedNote({ note, language }) {
  const translated = useTranslated(note, language)
  return (
    <li>
      <bdi>{translated}</bdi>
    </li>
  )
}

export default function RecommendationCard({
  result,
  explanation,
  headingId,
  variant = 'alternate',
  animate = false,
  className = '',
  style,
}) {
  const { language } = useAppContext()
  const name = useTranslated(result.facility.name, language)
  const transitNote = useTranslated(result.facility.nearest_transit_note, language)
  const reducedMotion = useReducedMotion()
  const isHero = variant === 'hero'

  return (
    <article
      className={`flex gap-4 rounded-2xl border p-5 ${
        isHero
          ? 'border-ink/15 bg-chalk shadow-md dark:border-chalk/15 dark:bg-ink/40'
          : 'border-ink/10 bg-chalk/60 dark:border-chalk/10 dark:bg-ink/20'
      } ${isHero ? 'flex-col sm:flex-row sm:items-start' : 'flex-row items-center'} ${
        !reducedMotion ? className : ''
      }`}
      style={!reducedMotion ? style : undefined}
    >
      <GateBadge
        facilityType={result.facility.type}
        facilityName={result.facility.name}
        congestionValue={result.breakdown.congestionValue}
        congestionStatus={result.breakdown.congestionStatus}
        overCapacity={result.breakdown.overCapacity}
        size={isHero ? 'hero' : 'md'}
        animate={animate}
        liveLabel={t('liveLabel', language)}
        unknownLabel={t('unknownLabel', language)}
      />

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h3 id={headingId} className={isHero ? 'font-display text-2xl font-bold leading-tight' : 'font-display text-lg font-bold leading-tight'}>
          <bdi>{name}</bdi>
        </h3>
        <p className="text-sm text-ink/70 dark:text-chalk/70">
          <bdi>{transitNote}</bdi>
        </p>
        <p className="font-mono text-xs tabular-nums text-ink/60 dark:text-chalk/60">
          {t('scoreLabel', language)} {result.score}/100
        </p>

        {isHero && explanation && (
          <div className="mt-1 rounded-xl bg-teal/10 p-3 text-sm dark:bg-teal/15">
            <h4 className="mb-1 font-semibold text-teal-strong dark:text-teal">{t('whyTitle', language)}</h4>
            <p>{explanation}</p>
          </div>
        )}

        <details className={isHero ? 'mt-1' : 'mt-0.5'}>
          <summary className="cursor-pointer text-sm font-medium text-ink/80 hover:text-ink dark:text-chalk/80 dark:hover:text-chalk">
            {t('whyTitle', language)} — {t('detailsLabel', language)}
          </summary>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {result.notes.map((note) => (
              <TranslatedNote key={note} note={note} language={language} />
            ))}
          </ul>
        </details>
      </div>
    </article>
  )
}
