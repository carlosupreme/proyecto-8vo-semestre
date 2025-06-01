import { SignOutButton, UserProfile, useUser } from "@clerk/clerk-react";
import { createFileRoute } from '@tanstack/react-router';
import { User, Settings, Shield, LogOut, ChevronRight } from 'lucide-react';

export const Route = createFileRoute('/cuenta')({
  component: RouteComponent,
})

function RouteComponent() {
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Mi Cuenta</h1>
              <p className="text-sm text-gray-500">Gestiona tu información personal y configuración</p>
            </div>
            <SignOutButton>
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <LogOut className="w-4 h-4" />
                Cerrar Sesión
              </button>
            </SignOutButton>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              <div className="bg-white rounded-lg shadow-sm border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuración</h2>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#profile"
                      className="flex items-center justify-between p-3 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg group"
                    >
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5" />
                        Perfil
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#security"
                      className="flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5" />
                        Seguridad
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#preferences"
                      className="flex items-center justify-between p-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg group transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        Preferencias
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Profile Section */}
          <div className="lg:col-span-3">
            {/* User Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex items-center gap-4 mb-6">
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-full border-2 border-gray-200"
                  />
                )}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.fullName || 'Usuario'}
                  </h2>
                  <p className="text-gray-500">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      ✓ Verificado
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clerk UserProfile Component */}
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Configuración del Perfil
                </h3>
                <div className="clerk-profile-container">
                  <UserProfile
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        card: "shadow-none border-0 bg-transparent",
                        headerTitle: "text-lg font-semibold text-gray-900",
                        headerSubtitle: "text-gray-600",
                        navbarButton: "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                        navbarButtonIcon: "text-gray-500",
                        formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
                        formFieldInput: "border-gray-300 focus:border-blue-500 focus:ring-blue-500",
                        identityPreviewText: "text-gray-900",
                        identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
                      },
                      layout: {
                        socialButtonsPlacement: "bottom",
                        socialButtonsVariant: "blockButton",
                      }
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
                <h4 className="font-medium text-gray-900 mb-2">Privacidad y Seguridad</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Administra tu configuración de privacidad y opciones de seguridad.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Ver configuración →
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200">
                <h4 className="font-medium text-gray-900 mb-2">Notificaciones</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Controla qué notificaciones quieres recibir y cómo.
                </p>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Configurar →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
