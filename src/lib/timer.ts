/** Hito de referencia: "arrancá al menos 10 min", no un límite duro. */
export const TIMER_MILESTONE_MS = 10 * 60 * 1000

export type TimerPhase = 'idle' | 'running' | 'paused'

export interface TimerState {
  day: number | null
  phase: TimerPhase
  /** epoch ms en que arrancó el tramo "running" actual; null si no está corriendo. */
  startedAt: number | null
  /** ms acumulados de tramos anteriores (antes de la corrida actual). */
  accumulatedMs: number
}

export const initialTimerState: TimerState = {
  day: null,
  phase: 'idle',
  startedAt: null,
  accumulatedMs: 0,
}

/**
 * Elapsed real en ms, calculado con reloj de pared (no con ticks de setInterval).
 * Sin techo: es un cronómetro que sigue corriendo hasta que lo detenés.
 * Así el timer no se pierde si el componente se remonta, la pestaña cambia,
 * o el navegador se cierra y se reabre mientras corría.
 */
export function elapsedMs(timer: TimerState, now: number = Date.now()): number {
  const running = timer.phase === 'running' && timer.startedAt !== null
  return timer.accumulatedMs + (running ? now - timer.startedAt! : 0)
}
