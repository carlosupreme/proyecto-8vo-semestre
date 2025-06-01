import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // Navigate to /agenda when the component mounts
    navigate({ to: '/agenda' })
  }, [])

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Cargando...</p>
    </div>
  )
}
