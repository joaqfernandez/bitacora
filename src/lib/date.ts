/** YYYY-MM-DD para hoy, en horario local. */
export function todayISO(): string {
  const d = new Date()
  return toISODate(d)
}

export function toISODate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Número de día del programa (1..30) a partir de la fecha en que se fijó la misión. */
export function dayNumberFromMission(setDateISO: string): number {
  const [sy, sm, sd] = setDateISO.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const diffDays = Math.round((today.getTime() - start.getTime()) / 86400000)
  return Math.min(30, Math.max(1, diffDays + 1))
}

/** Fecha ISO correspondiente a un día del programa (1..30). */
export function dateForDay(setDateISO: string, day: number): string {
  const [sy, sm, sd] = setDateISO.split('-').map(Number)
  const start = new Date(sy, sm - 1, sd)
  start.setDate(start.getDate() + (day - 1))
  return toISODate(start)
}

export function formatDateHuman(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatDateTimeHuman(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleString('es-AR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
