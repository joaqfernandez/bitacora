import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppState, DayEntry, Doubt, FutureIdea, Mission } from './types'
import { dayNumberFromMission, dateForDay, todayISO } from './lib/date'
import { elapsedMs, initialTimerState, type TimerState } from './lib/timer'

function emptyDay(day: number): DayEntry {
  return {
    day,
    planned: false,
    mainTask: '',
    secondaryTasks: [],
    minutesExecuted: 0,
    actions: '',
    result: '',
    completed: false,
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface Store extends AppState {
  // timer de 10 minutos (global para que no se pierda al cambiar de vista)
  timer: TimerState
  timerStart: (day: number) => void
  timerPause: () => void
  timerResume: () => void
  /** Detiene el cronómetro y suma automáticamente lo corrido al total del día. */
  timerStop: () => void

  // misión
  startMission: (text: string, scheduleStart: string, reviewTime: string) => void

  // planificación / ejecución de días
  planDay: (day: number, mainTask: string, secondaryTasks: string[]) => void
  logExecution: (day: number, minutesDelta: number, actions?: string, result?: string) => void
  setDayNotes: (day: number, actions: string, result: string) => void
  toggleCompleted: (day: number) => void
  getDay: (day: number) => DayEntry

  // dudas
  addDoubt: (text: string, day: number) => void
  markDoubtReviewed: (id: string) => void

  // ideas futuras
  addFutureIdea: (text: string) => void

  // cierre del programa
  closeProgram: () => void

  // derivados
  currentDayNumber: () => number
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      mission: null,
      days: {},
      doubts: [],
      futureIdeas: [],
      closed: false,
      timer: initialTimerState,

      timerStart: (day) => {
        set({ timer: { day, phase: 'running', startedAt: Date.now(), accumulatedMs: 0 } })
      },

      timerPause: () => {
        set((s) => {
          if (s.timer.phase !== 'running') return {}
          return {
            timer: {
              ...s.timer,
              phase: 'paused',
              accumulatedMs: elapsedMs(s.timer),
              startedAt: null,
            },
          }
        })
      },

      timerResume: () => {
        set((s) => {
          if (s.timer.phase !== 'paused') return {}
          return { timer: { ...s.timer, phase: 'running', startedAt: Date.now() } }
        })
      },

      timerStop: () => {
        const s = get()
        if (s.timer.phase !== 'running' && s.timer.phase !== 'paused') return
        const day = s.timer.day
        if (day === null) {
          set({ timer: initialTimerState })
          return
        }
        const minutes = Math.max(1, Math.round(elapsedMs(s.timer) / 60000))
        s.logExecution(day, minutes)
        set({ timer: initialTimerState })
      },

      startMission: (text, scheduleStart, reviewTime) => {
        const mission: Mission = {
          text: text.trim(),
          setDate: todayISO(),
          scheduleStart,
          durationMinutes: 120,
          reviewTime,
        }
        set({ mission, days: {}, doubts: [], futureIdeas: [], closed: false, timer: initialTimerState })
      },

      getDay: (day) => {
        return get().days[day] ?? emptyDay(day)
      },

      planDay: (day, mainTask, secondaryTasks) => {
        set((s) => ({
          days: {
            ...s.days,
            [day]: {
              ...(s.days[day] ?? emptyDay(day)),
              mainTask: mainTask.trim(),
              secondaryTasks: secondaryTasks.map((t) => t.trim()).filter(Boolean).slice(0, 2),
              planned: true,
            },
          },
        }))
      },

      logExecution: (day, minutesDelta, actions, result) => {
        set((s) => {
          const current = s.days[day] ?? emptyDay(day)
          return {
            days: {
              ...s.days,
              [day]: {
                ...current,
                minutesExecuted: Math.max(0, current.minutesExecuted + minutesDelta),
                actions: actions !== undefined ? actions : current.actions,
                result: result !== undefined ? result : current.result,
              },
            },
          }
        })
      },

      setDayNotes: (day, actions, result) => {
        set((s) => {
          const current = s.days[day] ?? emptyDay(day)
          return {
            days: { ...s.days, [day]: { ...current, actions, result } },
          }
        })
      },

      toggleCompleted: (day) => {
        set((s) => {
          const current = s.days[day] ?? emptyDay(day)
          return {
            days: { ...s.days, [day]: { ...current, completed: !current.completed } },
          }
        })
      },

      addDoubt: (text, day) => {
        const doubt: Doubt = {
          id: uid(),
          text: text.trim(),
          timestamp: new Date().toISOString(),
          day,
          reviewed: false,
        }
        set((s) => ({ doubts: [doubt, ...s.doubts] }))
      },

      markDoubtReviewed: (id) => {
        set((s) => ({
          doubts: s.doubts.map((d) => (d.id === id ? { ...d, reviewed: true } : d)),
        }))
      },

      addFutureIdea: (text) => {
        const idea: FutureIdea = { id: uid(), text: text.trim(), timestamp: new Date().toISOString() }
        set((s) => ({ futureIdeas: [idea, ...s.futureIdeas] }))
      },

      closeProgram: () => set({ closed: true }),

      currentDayNumber: () => {
        const mission = get().mission
        if (!mission) return 1
        return dayNumberFromMission(mission.setDate)
      },
    }),
    { name: 'bitacora-30-dias' },
  ),
)

export function dateOfDay(day: number): string | null {
  const mission = useStore.getState().mission
  if (!mission) return null
  return dateForDay(mission.setDate, day)
}
