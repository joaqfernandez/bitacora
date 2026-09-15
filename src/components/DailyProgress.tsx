import { Card } from './Card'
import { useLiveMinutes } from '../hooks/useLiveMinutes'

export function DailyProgress({ day, targetMinutes }: { day: number; targetMinutes: number }) {
  const liveMinutes = useLiveMinutes(day)
  const displayMinutes = Math.floor(liveMinutes)
  const ratio = targetMinutes > 0 ? liveMinutes / targetMinutes : 0
  const pct = Math.min(100, ratio * 100)
  const reached = liveMinutes >= targetMinutes

  return (
    <Card>
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">Bloque de hoy</p>
        <p className="text-sm text-neutral-500">
          <span className={'font-bold ' + (reached ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100')}>
            {displayMinutes}
          </span>
          {' '}/ {targetMinutes} min
        </p>
      </div>
      <div className="h-3 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
        <div
          className={'h-full rounded-full transition-all duration-1000 ease-linear ' + (reached ? 'bg-emerald-500' : 'bg-neutral-900 dark:bg-neutral-100')}
          style={{ width: `${pct}%` }}
        />
      </div>
      {reached && (
        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
          Cumpliste el bloque de hoy.
        </p>
      )}
    </Card>
  )
}
