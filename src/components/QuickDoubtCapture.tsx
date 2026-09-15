import { useState } from 'react'
import { useStore } from '../store'
import { Card } from './Card'

/** Campo rápido para anotar dudas ("lo analizo después") sin salir de la pantalla. */
export function QuickDoubtCapture({ day }: { day: number }) {
  const addDoubt = useStore((s) => s.addDoubt)
  const [text, setText] = useState('')
  const [justAdded, setJustAdded] = useState(false)

  function submit() {
    if (!text.trim()) return
    addDoubt(text, day)
    setText('')
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }

  return (
    <Card className="p-3">
      <p className="text-xs font-medium text-neutral-500 mb-2">
        ¿Te apareció una duda tipo "esto no es escalable" o "no sé suficiente"? Anotala y seguí. Se revisa después, no ahora.
      </p>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submit()
          }}
          placeholder="Lo analizo después..."
          className="flex-1 rounded-md bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm"
        />
        <button
          type="button"
          onClick={submit}
          className="px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-medium"
        >
          Anotar
        </button>
      </div>
      {justAdded && <p className="text-xs text-emerald-600 mt-1">Anotada. Seguí.</p>}
    </Card>
  )
}
