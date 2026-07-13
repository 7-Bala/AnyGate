import { useAppContext } from '../context/AppContext.jsx'
import { t } from '../i18n/strings.js'
import { useTranslated } from '../hooks/useTranslated.js'

function TranslatedNote({ note, language }) {
  const translated = useTranslated(note, language)
  return <li>{translated}</li>
}

export default function RecommendationCard({ result, explanation, headingId }) {
  const { language } = useAppContext()
  const name = useTranslated(result.facility.name, language)
  const transitNote = useTranslated(result.facility.nearest_transit_note, language)
  const congestionLabel = result.breakdown.congestionStatus === 'live' ? t('liveLabel', language) : t('unknownLabel', language)

  return (
    <article className="flex flex-col gap-3 rounded-xl border border-slate-300 p-5 dark:border-slate-600">
      <h3 id={headingId} className="text-lg font-semibold">
        {name}
      </h3>
      <p className="text-sm text-slate-600 dark:text-slate-300">{transitNote}</p>
      <p className="text-sm">
        <span className="font-medium">{t('congestionLabel', language)}:</span>{' '}
        {result.breakdown.congestionValue ?? '—'}/100 ({congestionLabel}) · Score {result.score}/100
      </p>

      {explanation && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-950">
          <h4 className="mb-1 font-medium">{t('whyTitle', language)}</h4>
          <p>{explanation}</p>
        </div>
      )}

      <details>
        <summary className="cursor-pointer text-sm font-medium">{t('whyTitle', language)} — details</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
          {result.notes.map((note) => (
            <TranslatedNote key={note} note={note} language={language} />
          ))}
        </ul>
      </details>
    </article>
  )
}
