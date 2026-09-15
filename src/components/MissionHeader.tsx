import { useStore } from '../store'

export function MissionHeader() {
  const mission = useStore((s) => s.mission)
  const currentDayNumber = useStore((s) => s.currentDayNumber)
  const closed = useStore((s) => s.closed)
  if (!mission) return null
  const day = currentDayNumber()

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-4 mb-4">
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wide text-neutral-500">Misión (fija por 30 días)</p>
        <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate" title={mission.text}>
          {mission.text}
        </h1>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {closed && (
          <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            Programa cerrado
          </span>
        )}
        <div className="text-right">
          <p className="text-2xl font-bold leading-none text-neutral-900 dark:text-neutral-100">
            {day}<span className="text-base font-medium text-neutral-400">/30</span>
          </p>
          <p className="text-xs text-neutral-500">bloque {mission.scheduleStart} · {mission.durationMinutes} min</p>
        </div>
      </div>
    </div>
  )
}
