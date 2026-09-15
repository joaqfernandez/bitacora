import { useState } from 'react'
import { useStore } from '../store'
import type { DayEntry } from '../types'
import { Card } from './Card'

export function PlanDayForm({
  day,
  existing,
  title,
  onSaved,
}: {
  day: number
  existing?: DayEntry
  title: string
  onSaved?: () => void
}) {
  const planDay = useStore((s) => s.planDay)
  const [mainTask, setMainTask] = useState(existing?.mainTask ?? '')
  const [sec1, setSec1] = useState(existing?.secondaryTasks[0] ?? '')
  const [sec2, setSec2] = useState(existing?.secondaryTasks[1] ?? '')

  const canSave = mainTask.trim().length > 0

  function save() {
    if (!canSave) return
    planDay(day, mainTask, [sec1, sec2].filter(Boolean))
    onSaved?.()
  }

  return (
    <Card>
      <h3 className="font-semibold mb-3 text-neutral-900 dark:text-neutral-100">{title}</h3>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Tarea principal</label>
          <input
            value={mainTask}
            onChange={(e) => setMainTask(e.target.value)}
            className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
            placeholder="La única tarea que importa hoy"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Secundaria 1 (opcional)</label>
          <input
            value={sec1}
            onChange={(e) => setSec1(e.target.value)}
            className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-neutral-500 mb-1">Secundaria 2 (opcional)</label>
          <input
            value={sec2}
            onChange={(e) => setSec2(e.target.value)}
            className="w-full rounded-md bg-white dark:bg-neutral-950 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="button"
          disabled={!canSave}
          onClick={save}
          className="w-full py-2 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-medium disabled:opacity-40"
        >
          Guardar plan del día {day}
        </button>
      </div>
    </Card>
  )
}
