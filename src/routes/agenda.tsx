import { createFileRoute } from '@tanstack/react-router'
import AgendaPage from '../domains/agenda'

export const Route = createFileRoute('/agenda')({
  component: AgendaPage,
})

