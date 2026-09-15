import { useState } from 'react'
import { useStore } from '../store'
import { PlanDayForm } from '../components/PlanDayForm'
import { Card } from '../components/Card'
import { formatDateHuman, dateForDay } from '../lib/date'
import { useLiveMinutes } from '../hooks/useLiveMinutes'

export function Calendar() {
  const mission = useStore((s) => s.mission)
  const days = useStore((s) => s.days)
  const currentDayNumber = useStore((s) => s.currentDayNumber)
  const setDayNotes = useStore((s) => s.setDayNotes)
  const toggleCompleted = useStore((s) => s.toggleCompleted)

  const current = currentDayNumber()
  const [selected, setSelected] = useState<number>(current)

  const entry = days[selected]
  const [actions, setActions] = useState(entry?.actions ?? '')
  const [result, setResult] = useState(entry?.result ?? '')
  const liveMinutes = useLiveMinutes(selected)

  function select(day: number) {
    setSelected(day)
    const e = days[day]
    setActions(e?.actions ?? '')
    setResult(e?.result ?? '')
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
          const e = days[d]
          const isCurrent = d === current
          // Solo se puede abrir hoy, el pasado, o mañana (para cargar el plan la noche anterior).
          const isOpenable = d <= current + 1
          let cls = 'border-neutral-300 dark:border-neutral-700 text-neutral-500'
          if (e?.completed) cls = 'bg-emerald-500 border-emerald-500 text-white'
          else if (e?.planned) cls = 'border-amber-400 text-amber-600 dark:text-amber-400'
          if (isCurrent) cls += ' ring-2 ring-offset-1 ring-neutral-900 dark:ring-neutral-100 dark:ring-offset-neutral-900'
          if (selected === d) cls += ' scale-105'

          return (
            <button
              key={d}
              type="button"
              onClick={() => select(d)}
              disabled={!isOpenable}
              className={
                'aspect-square rounded-lg border text-base sm:text-lg font-bold flex items-center justify-center transition-transform ' +
                cls +
                (!isOpenable ? ' opacity-40 cursor-not-allowed' : ' hover:scale-105')
              }
              title={mission ? formatDateHuman(dateForDay(mission.setDate, d)) : undefined}
            >
              {d}
            </button>
          )
        })}
      </div>

      <div className="flex gap-4 text-xs text-neutral-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> completado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded border border-amber-400 inline-block" /> planeado</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded ring-2 ring-neutral-900 dark:ring-neutral-100 inline-block" /> hoy</span>
      </div>

      <div className="pt-2">
        <p className="text-sm font-semibold mb-2 text-neutral-900 dark:text-neutral-100">
          Día {selected}
          {mission && <span className="text-neutral-400 font-normal"> · {formatDateHuman(dateForDay(mission.setDate, selected))}</span>}
        </p>

        {!entry?.planned ? (
          selected <= current + 1 ? (
            <PlanDayForm day={selected} existing={entry} title={`Cargar plan del día ${selected}`} />
          ) : (
            <p className="text-sm text-neutral-500">Todavía no se puede cargar (es un día futuro lejano).</p>
          )
        ) : (
          <Card className="space-y-3">
            <div>
              <p className="text-xs font-medium text-neutral-500">Tarea principal</p>
              <p className="text-sm text-neutral-900 dark:text-neutral-100">{entry.mainTask}</p>
            </div>
            {entry.secondaryTasks.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-500">Secundarias</p>
                <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300">
                  {entry.secondaryTasks.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              </div>
            )}
            <p className="text-sm text-neutral-700 dark:text-neutral-300">Minutos ejecutados: <b>{Math.floor(liveMinutes)}</b></p>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Acciones realizadas</label>
              <textarea
                value={actions}
                onChange={(e) => setActions(e.target.value)}
                onBlur={() => setDayNotes(selected, actions, result)}
                rows={2}
                className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-500 mb-1">Resultado obtenido</label>
              <textarea
                value={result}
                onChange={(e) => setResult(e.target.value)}
                onBlur={() => setDayNotes(selected, actions, result)}
                rows={2}
                className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
              <input type="checkbox" checked={entry.completed} onChange={() => toggleCompleted(selected)} />
              Día completado
            </label>
          </Card>
        )}
      </div>
    </div>
  )
}
