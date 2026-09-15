import { useState } from 'react'
import { useStore } from '../store'
import { CriterionBar } from '../components/CriterionBar'

export function MissionSetup() {
  const startMission = useStore((s) => s.startMission)
  const [text, setText] = useState('')
  const [scheduleStart, setScheduleStart] = useState('09:00')
  const [reviewTime, setReviewTime] = useState('18:00')
  const [confirmed, setConfirmed] = useState(false)

  const canSubmit = text.trim().length > 5 && confirmed

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-1 text-neutral-900 dark:text-neutral-100">Día 1: fijá la misión</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Elegida desde un proyecto que ya existe, no una idea nueva. No va a cambiar en 30 días.
      </p>

      <CriterionBar />

      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-800 dark:text-neutral-200">
            ¿Cuál es la misión de estos 30 días?
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            placeholder="Ej: Conseguir que 3 personas paguen por [proyecto existente]"
            className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-800 dark:text-neutral-200">
              Horario del bloque diario (2 hs)
            </label>
            <input
              type="time"
              value={scheduleStart}
              onChange={(e) => setScheduleStart(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-800 dark:text-neutral-200">
              Horario de revisión de dudas
            </label>
            <input
              type="time"
              value={reviewTime}
              onChange={(e) => setReviewTime(e.target.value)}
              className="w-full rounded-md border border-neutral-300 dark:border-neutral-700 bg-transparent px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-start gap-2 text-sm text-neutral-700 dark:text-neutral-300">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1"
          />
          Entiendo que esta misión no cambia por 30 días. Las dudas se anotan y se siguen, no se resuelven ahora.
        </label>

        <button
          type="button"
          disabled={!canSubmit}
          onClick={() => startMission(text, scheduleStart, reviewTime)}
          className="w-full py-3 rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 font-semibold disabled:opacity-40"
        >
          Empezar día 1
        </button>
      </div>
    </div>
  )
}
