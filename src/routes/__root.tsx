import { ClerkLoaded, useAuth } from '@clerk/clerk-react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRouteWithContext, useLocation, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Layout } from '../components/layout';
import { OpenaiProvider } from '../contexts/OpenaiContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { LandingPage } from '../components/LandingPage';

const publicRoutes = ['/sign-in', '/sign-up'];

const isPublicRoute = (pathname: string) => {
    return publicRoutes.some(route => pathname === route);
};

const RouteComponent = () => {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded, userId } = useAuth();
    const { emit } = useWebSocket();
    const pathname = useLocation().pathname;
    const currentRouteIsPublic = isPublicRoute(pathname);

    useEffect(() => {
        if (isSignedIn && userId) {
            const userIdStored = localStorage.getItem("userId");
            if (!userIdStored || userIdStored !== userId) {
                localStorage.setItem("userId", userId);
            }
            emit('joinBusinessRoom', userId);
        }
    }, [isSignedIn, userId, emit]);

    if (!isLoaded) {
        return (
            <div className="flex h-screen items-center justify-center bg-background dark:bg-gray-900">
                <div className="text-center">
                    <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary dark:border-primary-dark border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    // Show landing page when not signed in and on root route
    if (!isSignedIn && pathname === '/') {
        return (
            <>
                <LandingPage />
                <Toaster position="top-center" />
                {import.meta.env.DEV && <ReactQueryDevtools />}
            </>
        );
    }

    // Redirect to sign-in for protected routes when not authenticated
    if (!isSignedIn && !currentRouteIsPublic) {
        navigate({ to: '/sign-in' });
        return (
            <div className="flex h-screen items-center justify-center"><p>Redirigiendo...</p></div>
        );
    }

    // Redirect to home when signed in and on public routes
    if (isSignedIn && currentRouteIsPublic) {
        navigate({ to: '/' });
        return (
            <div className="flex h-screen items-center justify-center"><p>Redirigiendo...</p></div>
        );
    }

    // Render public routes (sign-in, sign-up)
    if (currentRouteIsPublic) {
        return (
            <>
                <Outlet />
                <Toaster position="top-center" />
                {import.meta.env.DEV && <ReactQueryDevtools />}
            </>
        );
    }

    // Render protected routes with layout
    return (
        <ClerkLoaded>
            <OpenaiProvider>
                <Layout>
                    <Outlet />
                </Layout>
            </OpenaiProvider>
            <Toaster position="top-center" />
        </ClerkLoaded>
    );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
    {
        component: RouteComponent,
        notFoundComponent: () => {
            return (
                <div className="flex flex-col items-center justify-center h-screen text-center p-4">
                    <h1 className="text-4xl font-bold mb-4">Oops! Página no encontrada</h1>
                    <p className="text-lg text-muted-foreground mb-8">Lo sentimos, la página que buscas no existe.</p>
                    <Link to="/" className="text-primary hover:underline">
                        Ir a la página de inicio
                    </Link>
                </div>
            );
        },
    }
);