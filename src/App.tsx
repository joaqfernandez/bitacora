import { useState } from 'react'
import { useStore } from './store'
import { MissionSetup } from './views/MissionSetup'
import { Today } from './views/Today'
import { Calendar } from './views/Calendar'
import { DoubtsReview } from './views/DoubtsReview'
import { FutureIdeas } from './views/FutureIdeas'
import { Summary } from './views/Summary'
import { MissionHeader } from './components/MissionHeader'
import { Nav, type Tab } from './components/Nav'

function App() {
  const mission = useStore((s) => s.mission)
  const [tab, setTab] = useState<Tab>('hoy')

  if (!mission) {
    return (
      <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <MissionSetup />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <MissionHeader />
        <Nav tab={tab} onChange={setTab} />

        {tab === 'hoy' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-8 items-start">
            <Today />
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
                Calendario · 30 días
              </h2>
              <Calendar />
            </div>
          </div>
        )}

        {tab === 'calendario' && (
          <div className="max-w-2xl">
            <Calendar />
          </div>
        )}
        {tab === 'dudas' && <div className="max-w-2xl"><DoubtsReview /></div>}
        {tab === 'ideas' && <div className="max-w-2xl"><FutureIdeas /></div>}
        {tab === 'resumen' && <div className="max-w-2xl"><Summary /></div>}
      </div>
    </div>
  )
}

export default App
