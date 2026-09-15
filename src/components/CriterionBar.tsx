import { useState } from 'react'
import { EXECUTION_CRITERION, PROCRASTINATION_EXAMPLES } from '../types'

/** Criterio de "qué cuenta como ejecución". Visible siempre, en toda vista. */
export function CriterionBar() {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-200 rounded-lg px-4 py-3">
      <p className="font-medium leading-snug">{EXECUTION_CRITERION}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mt-1 text-xs underline decoration-dotted opacity-80 hover:opacity-100"
      >
        {open ? 'ocultar ejemplos de procrastinación disfrazada' : 'si no, ¿qué es procrastinación disfrazada?'}
      </button>
      {open && (
        <ul className="mt-2 text-sm list-disc list-inside opacity-90 space-y-0.5">
          {PROCRASTINATION_EXAMPLES.map((ex) => (
            <li key={ex}>{ex}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
