// En ../components/layout.tsx
import React from 'react';
import { cn } from '@/lib/utils'; // Asegúrate que la ruta a utils es correcta
import NavBar from './NavBar';   // Asumo que NavBar está en el mismo directorio o ajusta la ruta
import { useIsMobile } from '@/hooks/useMobile'; // O tu hook de detección móvil preferido

// DEFINE ESTAS CONSTANTES BASADO EN TU NAVBAR.TSX
// Altura de la NavBar móvil. Si es h-16 (Tailwind) = 4rem (64px)
const MOBILE_NAV_BAR_HEIGHT_VALUE = '4rem';

// Padding adicional para la "safe area" en la parte inferior de iPhones.
// Si usas env(safe-area-inset-bottom) con Tailwind JIT, puedes hacer esto más dinámico.
// Por ahora, un valor fijo. 0.75rem (12px) o 1rem (16px) suele ser suficiente.
const MOBILE_SAFE_AREA_BOTTOM_VALUE = '0.75rem';
// Si no puedes/quieres usar `calc` directamente en `style`, pre-calcula:
// Por ejemplo, si h-16 es 4rem, y safe area es 1rem, el padding total es 5rem.
const TOTAL_MOBILE_PADDING_BOTTOM = `calc(${MOBILE_NAV_BAR_HEIGHT_VALUE} + ${MOBILE_SAFE_AREA_BOTTOM_VALUE})`;
// O un valor fijo: const TOTAL_MOBILE_PADDING_BOTTOM = '5rem'; // Ejemplo

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile(768); // md breakpoint (768px)

    return (
        <div className="flex flex-col min-h-screen bg-background dark:bg-gray-900">
            {/* Aquí podría ir un Header de página si lo tuvieras (ej. para desktop) */}
            {/* <PageHeader /> */}

            <main
                className={cn(
                    "flex-1 w-full overflow-y-auto", // Permite scroll si el contenido excede la altura
                    // Aplicamos el padding-bottom solo en móvil
                    // es importante que este 'main' sea el contenedor que realmente scrollea o 
                    // el ancestro directo del contenido que necesita no ser obstruido.
                )}
                style={isMobile ? { paddingBottom: TOTAL_MOBILE_PADDING_BOTTOM } : {}}
            >
                {children} {/* Aquí se renderizará el Outlet */}
            </main>

            {/* NavBar se renderiza aquí, fuera del flujo de 'main' para que sea 'fixed'
                y Layout es ahora el responsable de renderizarla. */}
            <NavBar />
        </div>
    );
};