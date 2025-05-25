import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cuenta')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cuenta"!</div>
}
