import {useAuth} from '@clerk/clerk-react'
import {QueryClient} from '@tanstack/react-query'
import {Link, Outlet, createRootRouteWithContext} from '@tanstack/react-router'
import {useEffect} from 'react'
import {Toaster} from 'sonner'
import {Layout} from '../components/layout'
import {useWebSocket} from '../hooks/useWebSocket'
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";

const publicRoutes = ['/sign-in', '/sign-up']

const isPublicRoute = (pathname: string) => {
    return publicRoutes.some(route => pathname === route)
}

const RouteComponent = () => {
    const {isSignedIn, isLoaded, userId} = useAuth()
    const {emit} = useWebSocket()

    // Get the current pathname
    const pathname = window.location.pathname
    const currentRouteIsPublic = isPublicRoute(pathname)


    useEffect(() => {
        if (isSignedIn && userId) {
            emit('joinBusinessRoom', userId)
        }
    }, [isSignedIn, userId, emit]) // Only run when these values change

    // If Clerk is still loading, show a loading state
    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="text-center">
                    <div
                        className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent mx-auto"></div>
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
                <Outlet/>
            </>
        )
    }

    // For authenticated routes, render with the NavBar
    return (
        <>
            <Layout>
                <Outlet/>
            </Layout>
            <Toaster position="top-center"/>
            <ReactQueryDevtools/>
        </>
    )
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
    {
        component: RouteComponent,
        notFoundComponent: () => {
            return (
                <div>
                    <p>Lo siento, la página que buscas no existe</p>
                    <Link to="/">Ir a inicio</Link>
                </div>
            )
        },
    }
)
