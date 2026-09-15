import { useMemo } from 'react'
import { useStore } from '../store'
import { formatDateTimeHuman } from '../lib/date'
import { QuickDoubtCapture } from '../components/QuickDoubtCapture'

export function DoubtsReview() {
  const doubts = useStore((s) => s.doubts)
  const markDoubtReviewed = useStore((s) => s.markDoubtReviewed)
  const mission = useStore((s) => s.mission)
  const currentDayNumber = useStore((s) => s.currentDayNumber)

  const today = currentDayNumber()
  const todaysDoubts = useMemo(() => doubts.filter((d) => d.day === today), [doubts, today])
  const pendingToday = todaysDoubts.filter((d) => !d.reviewed)
  const historyDoubts = useMemo(() => doubts.filter((d) => d.day !== today), [doubts, today])

  return (
    <div className="space-y-6">
      <QuickDoubtCapture day={today} />

      <section>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Dudas de hoy (día {today})
        </h2>
        {todaysDoubts.length === 0 ? (
          <p className="text-sm text-neutral-500">Ninguna todavía. Bien.</p>
        ) : (
          <ul className="space-y-2">
            {todaysDoubts.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-3 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 px-3 py-2"
              >
                <div>
                  <p className={'text-sm ' + (d.reviewed ? 'line-through text-neutral-400' : 'text-neutral-800 dark:text-neutral-200')}>
                    {d.text}
                  </p>
                  <p className="text-xs text-neutral-400">{formatDateTimeHuman(d.timestamp)}</p>
                </div>
                {!d.reviewed && (
                  <button
                    type="button"
                    onClick={() => markDoubtReviewed(d.id)}
                    className="text-xs shrink-0 px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-800"
                  >
                    Marcar revisada
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          Revisión diaria {mission ? `· ${mission.reviewTime}` : ''}
        </h2>
        <p className="text-xs text-neutral-500 mb-2">
          A esta hora repasás las dudas del día. No se borran solas, se marcan como revisadas.
        </p>
        {pendingToday.length === 0 ? (
          <p className="text-sm text-emerald-600">No hay dudas pendientes de revisión hoy.</p>
        ) : (
          <ul className="space-y-2">
            {pendingToday.map((d) => (
              <li
                key={d.id}
                className="flex items-start justify-between gap-3 border border-amber-300/60 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-950/40 rounded-md px-3 py-2"
              >
                <p className="text-sm text-amber-900 dark:text-amber-200">{d.text}</p>
                <button
                  type="button"
                  onClick={() => markDoubtReviewed(d.id)}
                  className="text-xs shrink-0 px-2 py-1 rounded bg-amber-900 text-white dark:bg-amber-200 dark:text-amber-950"
                >
                  Revisada
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Historial</h2>
        {historyDoubts.length === 0 ? (
          <p className="text-sm text-neutral-500">Todavía no hay dudas de días anteriores.</p>
        ) : (
          <ul className="space-y-2">
            {historyDoubts.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-neutral-700 dark:text-neutral-300">
                  <span className="text-neutral-400">día {d.day} · </span>
                  {d.text}
                </span>
                <span className={'text-xs shrink-0 ' + (d.reviewed ? 'text-emerald-600' : 'text-amber-600')}>
                  {d.reviewed ? 'revisada' : 'pendiente'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
