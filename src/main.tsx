import { ClerkProvider } from '@clerk/clerk-react'
import { esMX } from '@clerk/localizations'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import queryClient from './lib/queryClient'
import reportWebVitals from './reportWebVitals.ts'
import { routeTree } from './routeTree.gen'
import './styles.css'

export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY

if (!OPENAI_API_KEY) {
  throw new Error('Add your OpenAI API Key to the .env file')
}

// Create a new router instance
const router = createRouter({
  routeTree,
  context: { queryClient },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

// Render the app
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ClerkProvider
          localization={esMX}
          publishableKey={PUBLISHABLE_KEY}
          afterSignOutUrl="/"
        >
          <RouterProvider router={router} />
        </ClerkProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
