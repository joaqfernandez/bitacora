import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { elapsedMs } from '../lib/timer'

/**
 * Minutos ejecutados de un día, sumando lo ya comprometido (DayEntry.minutesExecuted)
 * más lo que está corriendo ahora mismo en el cronómetro (si pertenece a ese día).
 * Se actualiza cada segundo mientras el cronómetro corre, para que las barras de
 * progreso crezcan en vivo en vez de saltar recién cuando se aprieta "Detener".
 */
export function useLiveMinutes(day: number): number {
  const timer = useStore((s) => s.timer)
  const committed = useStore((s) => s.days[day]?.minutesExecuted ?? 0)
  const [, tick] = useState(0)

  useEffect(() => {
    if (timer.phase !== 'running') return
    const id = window.setInterval(() => tick((n) => n + 1), 1000)
    return () => window.clearInterval(id)
  }, [timer.phase])

  const belongsToThisDay = timer.day === day && (timer.phase === 'running' || timer.phase === 'paused')
  const liveMinutes = belongsToThisDay ? elapsedMs(timer) / 60000 : 0
  return committed + liveMinutes
}
