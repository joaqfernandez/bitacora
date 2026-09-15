export interface Mission {
  /** Texto de la misión, fijado el día 1. No cambia en 30 días. */
  text: string
  /** Fecha ISO (YYYY-MM-DD) en la que se fijó la misión = día 1. */
  setDate: string
  /** Hora de inicio del bloque diario, "HH:MM". */
  scheduleStart: string
  /** Duración del bloque diario en minutos. Fija en 120 por spec. */
  durationMinutes: number
  /** Hora de revisión diaria de dudas, "HH:MM". */
  reviewTime: string
}

export interface DayEntry {
  day: number // 1..30
  /** true una vez que se cargó tarea principal + secundarias para este día. */
  planned: boolean
  mainTask: string
  secondaryTasks: string[] // hasta 2
  minutesExecuted: number
  actions: string
  result: string
  completed: boolean
}

export interface Doubt {
  id: string
  text: string
  timestamp: string // ISO datetime
  day: number
  reviewed: boolean
}

export interface FutureIdea {
  id: string
  text: string
  timestamp: string // ISO datetime
}

export interface AppState {
  mission: Mission | null
  days: Record<number, DayEntry>
  doubts: Doubt[]
  futureIdeas: FutureIdea[]
  /** true una vez que el usuario cerró formalmente el programa la noche 30. */
  closed: boolean
}

export const EXECUTION_CRITERION =
  '¿Esto aumenta la posibilidad de que alguien me pague, o mejora mi capacidad de conseguir que me paguen?'

export const PROCRASTINATION_EXAMPLES = [
  'ver videos',
  'investigar herramientas',
  'diseñar el logo',
  'organizar Notion',
  'mirar cómo ganan otros',
]
