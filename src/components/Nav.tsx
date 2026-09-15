export type Tab = 'hoy' | 'calendario' | 'dudas' | 'ideas' | 'resumen'

const TABS: { id: Tab; label: string }[] = [
  { id: 'hoy', label: 'Hoy' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'dudas', label: 'Dudas' },
  { id: 'ideas', label: 'Ideas futuras' },
  { id: 'resumen', label: 'Resumen' },
]

export function Nav({ tab, onChange }: { tab: Tab; onChange: (t: Tab) => void }) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-1 mb-4 -mx-1 px-1">
      {TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={
            'px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ' +
            (tab === t.id
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800')
          }
        >
          {t.label}
        </button>
      ))}
    </nav>
  )
}
