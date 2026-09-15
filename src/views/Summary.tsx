import { useMemo } from 'react'
import { useStore } from '../store'
import { formatDateHuman, dateForDay } from '../lib/date'
import { Card } from '../components/Card'

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="text-center">
      <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      <p className="text-xs text-neutral-500 mt-1">{label}</p>
    </Card>
  )
}

export function Summary() {
  const days = useStore((s) => s.days)
  const mission = useStore((s) => s.mission)
  const currentDayNumber = useStore((s) => s.currentDayNumber)
  const closed = useStore((s) => s.closed)
  const closeProgram = useStore((s) => s.closeProgram)

  const current = currentDayNumber()

  const { daysExecuted, totalMinutes, streak } = useMemo(() => {
    let executed = 0
    let minutes = 0
    for (let d = 1; d <= 30; d++) {
      const e = days[d]
      if (e && e.minutesExecuted > 0) executed++
      if (e) minutes += e.minutesExecuted
    }
    let streakCount = 0
    for (let d = current; d >= 1; d--) {
      const e = days[d]
      if (e && e.minutesExecuted > 0) streakCount++
      else break
    }
    return { daysExecuted: executed, totalMinutes: minutes, streak: streakCount }
  }, [days, current])

  const evidenceDays = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) => i + 1)
        .map((d) => ({ d, e: days[d] }))
        .filter(({ e }) => e && (e.actions || e.result)),
    [days],
  )

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="días ejecutados / 30" value={`${daysExecuted}`} />
        <StatCard label="horas totales" value={(totalMinutes / 60).toFixed(1)} />
        <StatCard label="racha actual" value={`${streak} 🔥`} />
      </div>

      {current >= 30 && !closed && (
        <div className="rounded-lg bg-neutral-900 dark:bg-neutral-100 p-4 text-center">
          <p className="font-semibold text-white dark:text-neutral-900 mb-1">Llegaste al día 30.</p>
          <p className="text-sm text-neutral-300 dark:text-neutral-600 mb-3">
            Cerrar el programa desbloquea la lista de ideas futuras para revisarlas.
          </p>
          <button
            type="button"
            onClick={closeProgram}
            className="px-4 py-2 rounded-md bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white font-medium"
          >
            Cerrar los 30 días
          </button>
        </div>
      )}

      {closed && (
        <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-4 text-center">
          <p className="font-semibold text-emerald-800 dark:text-emerald-300">
            Programa cerrado. Misión: "{mission?.text}"
          </p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
            {daysExecuted}/30 días ejecutados · {(totalMinutes / 60).toFixed(1)} hs totales. Ideas futuras desbloqueadas.
          </p>
        </div>
      )}

      <section>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Evidencia acumulada (acciones y resultados por día)
        </h2>
        {evidenceDays.length === 0 ? (
          <p className="text-sm text-neutral-500">Todavía no hay evidencia cargada.</p>
        ) : (
          <ul className="space-y-2">
            {evidenceDays.map(({ d, e }) => (
              <li key={d} className="rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 px-3 py-2">
                <p className="text-xs font-medium text-neutral-500">
                  Día {d}{mission && ` · ${formatDateHuman(dateForDay(mission.setDate, d))}`}
                  {e!.completed && <span className="ml-2 text-emerald-600">✓ completado</span>}
                </p>
                {e!.actions && <p className="text-sm text-neutral-800 dark:text-neutral-200 mt-1"><b>Acciones:</b> {e!.actions}</p>}
                {e!.result && <p className="text-sm text-neutral-800 dark:text-neutral-200"><b>Resultado:</b> {e!.result}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
