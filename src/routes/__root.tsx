import { Outlet, createRootRoute, redirect } from '@tanstack/react-router'
import { Layout } from '../components/layout'
import { useAuth } from '@clerk/clerk-react'

// Define public routes that don't require authentication
const publicRoutes = ['/sign-in', '/sign-up']

// Helper function to check if a route is public
const isPublicRoute = (pathname: string) => {
  return publicRoutes.some(route => pathname === route)
}

export const Route = createRootRoute({
  component: () => {
    const { isSignedIn, isLoaded } = useAuth()
    
    // Get the current pathname
    const pathname = window.location.pathname
    const currentRouteIsPublic = isPublicRoute(pathname)
    
    // If Clerk is still loading, show a loading state
    if (!isLoaded) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto"></div>
            <p>Loading...</p>
          </div>
        </div>
      )
    }
    
    // If user is not signed in and trying to access a protected route, redirect to sign-in
    if (!isSignedIn && !currentRouteIsPublic) {
      window.location.href = '/sign-in'
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Redirecting to sign in...</p>
        </div>
      )
    }
    
    // If user is signed in and trying to access a public route, redirect to home
    if (isSignedIn && currentRouteIsPublic) {
      window.location.href = '/'
      return (
        <div className="flex h-screen items-center justify-center">
          <p>Redirecting to home...</p>
        </div>
      )
    }
    
    // For public routes (sign-in, sign-up), render without the NavBar
    // This should never execute due to the redirects above, but keeping as a safeguard
    if (currentRouteIsPublic) {
      return (
        <>
          <Outlet />
        </>
      )
    }
    
    // For authenticated routes, render with the NavBar
    return (
      <>
        <Layout>
          <Outlet />
        </Layout>
      </>
    )
  },
})
