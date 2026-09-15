import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { TIMER_MILESTONE_MS, elapsedMs } from '../lib/timer'
import { Card } from './Card'

/**
 * Regla de los 10 minutos: no se evalúa si la idea sirve hasta después de arrancar.
 * "Empezar" arranca un cronómetro continuo que suma en vivo al bloque de 2 horas del
 * día — no hay que cortarlo cada 10 min y confirmar manualmente. Los "10 minutos" son
 * el empujón inicial para arrancar, no un techo.
 *
 * El estado vive en el store global (persistido) y se calcula con reloj de pared
 * (Date.now()), no contando ticks de setInterval. Por eso sobrevive a cambiar de
 * pestaña, remontar el componente, o cerrar y volver a abrir el navegador.
 */
export function Timer({ day }: { day: number }) {
  const timer = useStore((s) => s.timer)
  const timerStart = useStore((s) => s.timerStart)
  const timerPause = useStore((s) => s.timerPause)
  const timerResume = useStore((s) => s.timerResume)
  const timerStop = useStore((s) => s.timerStop)

  const [, forceTick] = useState(0)

  useEffect(() => {
    if (timer.phase !== 'running') return
    const id = window.setInterval(() => forceTick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [timer.phase])

  const belongsToOtherDay = timer.day !== null && timer.day !== day && timer.phase !== 'idle'
  const elapsed = elapsedMs(timer)
  const mm = String(Math.floor(elapsed / 60000)).padStart(2, '0')
  const ss = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')
  const reachedMilestone = elapsed >= TIMER_MILESTONE_MS

  if (belongsToOtherDay) {
    return (
      <div className="rounded-lg bg-amber-50 dark:bg-amber-950/40 p-4 text-center text-sm text-amber-800 dark:text-amber-300">
        Tenés un cronómetro corriendo sin cerrar del día {timer.day}. Andá a ese día para detenerlo.
      </div>
    )
  }

  return (
    <Card className="text-center">
      <p className="text-xs font-medium text-neutral-500 mb-3">
        Regla de los 10 minutos: no se piensa si vale la pena, se arranca. Lo que corras se suma en vivo al bloque de hoy.
      </p>

      {timer.phase === 'idle' && (
        <button
          type="button"
          onClick={() => timerStart(day)}
          className="w-full py-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-lg"
        >
          Empezar (10 min)
        </button>
      )}

      {(timer.phase === 'running' || timer.phase === 'paused') && (
        <div>
          <p className="text-5xl font-mono font-bold tabular-nums text-neutral-900 dark:text-neutral-100">
            {mm}:{ss}
          </p>
          <p className="text-xs text-neutral-500 mt-1 mb-3">
            {timer.phase === 'paused'
              ? 'en pausa'
              : reachedMilestone
                ? 'cumpliste los 10 min ✓ seguí si querés (sigue aunque cambies de pestaña)'
                : 'corriendo... todavía no pasaron los 10 min'}
          </p>
          <div className="flex gap-2 justify-center">
            {timer.phase === 'running' ? (
              <button
                type="button"
                onClick={timerPause}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                Pausar
              </button>
            ) : (
              <button
                type="button"
                onClick={timerResume}
                className="px-4 py-2 rounded-md border border-neutral-300 dark:border-neutral-700 text-sm font-medium"
              >
                Reanudar
              </button>
            )}
            <button
              type="button"
              onClick={timerStop}
              className="px-4 py-2 rounded-md border border-red-300 text-red-600 dark:border-red-800 dark:text-red-400 text-sm font-medium"
            >
              Detener y sumar
            </button>
          </div>
        </div>
      )}
    </Card>
  )
}
