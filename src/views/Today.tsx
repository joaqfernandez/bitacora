import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { CriterionBar } from '../components/CriterionBar'
import { Timer } from '../components/Timer'
import { QuickDoubtCapture } from '../components/QuickDoubtCapture'
import { PlanDayForm } from '../components/PlanDayForm'
import { Card } from '../components/Card'
import { DailyProgress } from '../components/DailyProgress'
import { useLiveMinutes } from '../hooks/useLiveMinutes'

export function Today() {
  const currentDayNumber = useStore((s) => s.currentDayNumber)
  const days = useStore((s) => s.days)
  const mission = useStore((s) => s.mission)
  const setDayNotes = useStore((s) => s.setDayNotes)
  const toggleCompleted = useStore((s) => s.toggleCompleted)
  const closed = useStore((s) => s.closed)

  const day = currentDayNumber()
  const entry = days[day]
  const tomorrow = day + 1
  const tomorrowEntry = days[tomorrow]
  const liveMinutes = useLiveMinutes(day)

  const [actions, setActions] = useState(entry?.actions ?? '')
  const [result, setResult] = useState(entry?.result ?? '')
  const [showTomorrowPlan, setShowTomorrowPlan] = useState(false)

  useEffect(() => {
    setActions(entry?.actions ?? '')
    setResult(entry?.result ?? '')
  }, [day, entry?.actions, entry?.result])

  if (closed) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          El programa de 30 días está cerrado.
        </p>
        <p className="text-sm text-neutral-500 mt-1">Mirá el Resumen o las Ideas futuras.</p>
      </div>
    )
  }

  // Regla: no se avanza sin haber cargado principal + secundarias.
  if (!entry || !entry.planned) {
    return (
      <div className="space-y-4">
        <CriterionBar />
        <PlanDayForm
          day={day}
          existing={entry}
          title={`Cargá el plan de hoy (día ${day}) antes de arrancar`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <CriterionBar />

      <Card>
        <p className="text-xs font-medium text-neutral-500 mb-1">Tarea principal</p>
        <p className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">{entry.mainTask}</p>
        {entry.secondaryTasks.length > 0 && (
          <>
            <p className="text-xs font-medium text-neutral-500 mt-3 mb-1">Secundarias</p>
            <ul className="list-disc list-inside text-sm text-neutral-700 dark:text-neutral-300">
              {entry.secondaryTasks.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </>
        )}
      </Card>

      <Timer day={day} />

      <DailyProgress day={day} targetMinutes={mission?.durationMinutes ?? 120} />

      <Card>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
            Minutos ejecutados hoy: <span className="font-bold">{Math.floor(liveMinutes)}</span>
          </p>
          <label className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
            <input type="checkbox" checked={entry.completed} onChange={() => toggleCompleted(day)} />
            Día completado
          </label>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">
              Acciones realizadas (texto libre, ej: "24 contactos, 3 respuestas, 1 reunión")
            </label>
            <textarea
              value={actions}
              onChange={(e) => setActions(e.target.value)}
              onBlur={() => setDayNotes(day, actions, result)}
              rows={2}
              className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-500 mb-1">Resultado obtenido</label>
            <textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              onBlur={() => setDayNotes(day, actions, result)}
              rows={2}
              className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      <QuickDoubtCapture day={day} />

      {tomorrow <= 30 && (
        <div>
          {!tomorrowEntry?.planned ? (
            showTomorrowPlan ? (
              <PlanDayForm
                day={tomorrow}
                existing={tomorrowEntry}
                title={`Cargar plan de mañana (día ${tomorrow})`}
                onSaved={() => setShowTomorrowPlan(false)}
              />
            ) : (
              <button
                type="button"
                onClick={() => setShowTomorrowPlan(true)}
                className="w-full py-2 rounded-md border border-dashed border-neutral-300 dark:border-neutral-700 text-sm text-neutral-500"
              >
                Cargar plan de mañana (día {tomorrow})
              </button>
            )
          ) : (
            <p className="text-xs text-emerald-600 text-center">Plan de mañana (día {tomorrow}) ya cargado ✓</p>
          )}
        </div>
      )}
    </div>
  )
}
