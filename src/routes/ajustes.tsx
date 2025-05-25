import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/ajustes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ajustes"!</div>
}
