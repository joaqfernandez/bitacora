import { useState } from 'react'
import { useStore } from '../store'
import { formatDateTimeHuman } from '../lib/date'
import { Card } from '../components/Card'

export function FutureIdeas() {
  const futureIdeas = useStore((s) => s.futureIdeas)
  const addFutureIdea = useStore((s) => s.addFutureIdea)
  const currentDayNumber = useStore((s) => s.currentDayNumber)
  const closed = useStore((s) => s.closed)
  const [text, setText] = useState('')

  const unlocked = closed || currentDayNumber() >= 30

  function submit() {
    if (!text.trim()) return
    addFutureIdea(text)
    setText('')
  }

  return (
    <div className="space-y-6">
      <Card className="p-3">
        <p className="text-xs font-medium text-neutral-500 mb-2">
          Ideas de otros proyectos/negocios que surgen mientras ejecutás la misión. Se guardan, no se evalúan ahora.
        </p>
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="Una idea nueva que no es la misión..."
            className="flex-1 rounded-md bg-white dark:bg-neutral-950 px-3 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={submit}
            className="px-3 py-1.5 rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 text-sm font-medium"
          >
            Guardar
          </button>
        </div>
      </Card>

      {!unlocked ? (
        <div className="text-center py-10 rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80">
          <p className="text-sm text-neutral-500">
            {futureIdeas.length} idea{futureIdeas.length !== 1 ? 's' : ''} guardada{futureIdeas.length !== 1 ? 's' : ''}.
          </p>
          <p className="font-medium text-neutral-700 dark:text-neutral-300 mt-1">Se revisan el día 30.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {futureIdeas.length === 0 && <p className="text-sm text-neutral-500">No guardaste ninguna idea.</p>}
          {futureIdeas.map((idea) => (
            <li key={idea.id} className="rounded-lg bg-neutral-100/80 dark:bg-neutral-900/80 px-3 py-2">
              <p className="text-sm text-neutral-800 dark:text-neutral-200">{idea.text}</p>
              <p className="text-xs text-neutral-400">{formatDateTimeHuman(idea.timestamp)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
