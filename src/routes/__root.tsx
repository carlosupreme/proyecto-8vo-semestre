import { useAuth } from '@clerk/clerk-react';
import { QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Link, Outlet, createRootRouteWithContext } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { Layout } from '../components/layout'; // Tu componente Layout
import { OpenaiProvider } from '../contexts/OpenaiContext';
import { useWebSocket } from '../hooks/useWebSocket';

const publicRoutes = ['/sign-in', '/sign-up'];

const isPublicRoute = (pathname: string) => {
    return publicRoutes.some(route => pathname === route);
};

const RouteComponent = () => {
    const { isSignedIn, isLoaded, userId } = useAuth();
    const { emit } = useWebSocket();
    const pathname = window.location.pathname; // Considerar usar useLocation de TanStack Router si está disponible aquí
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
                    <div
                        className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary dark:border-primary-dark border-t-transparent mx-auto"></div>
                    <p className="text-muted-foreground dark:text-gray-400">Cargando...</p>
                </div>
            </div>
        );
    }

    if (!isSignedIn && !currentRouteIsPublic) {
        window.location.href = '/sign-in'; // O usa navigate de TanStack Router para una mejor UX
        return (
            <div className="flex h-screen items-center justify-center"><p>Redirigiendo...</p></div>
        );
    }

    if (isSignedIn && currentRouteIsPublic) {
        window.location.href = '/'; // O usa navigate
        return (
            <div className="flex h-screen items-center justify-center"><p>Redirigiendo...</p></div>
        );
    }

    // Si es una ruta pública, no renderizamos Layout (que contiene NavBar)
    if (currentRouteIsPublic) {
        return (
            <>
                <Outlet />
                <Toaster position="top-center" /> {/* Toaster puede ser útil también en páginas públicas */}
                {/* ReactQueryDevtools usualmente solo en desarrollo */}
                {import.meta.env.DEV && <ReactQueryDevtools />}
            </>
        );
    }

    // Para rutas autenticadas, envolvemos con Layout (que contendrá NavBar y manejará el padding)
    return (
        <>
            <OpenaiProvider>
                <Layout> {/* Layout se encarga de la NavBar y el padding */}
                    <Outlet />
                </Layout>
            </OpenaiProvider>
            <Toaster position="top-center" />
            {import.meta.env.DEV && <ReactQueryDevtools />}
        </>
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