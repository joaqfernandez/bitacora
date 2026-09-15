import type { ReactNode } from 'react'

/** Contenedor de sección sin borde — separa por fondo, no por línea. */
export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl bg-neutral-100/80 dark:bg-neutral-900/80 p-4 ${className}`}>{children}</div>
}
