import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "./nav-items";
import { Link, useLocation } from "@tanstack/react-router";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface NavItemProps {
    item: NavItemType;
    isDesktop?: boolean;
}

const NavItem = ({ item, isDesktop = false }: NavItemProps) => {
    const location = useLocation();
    const IconComponent = item.icon;
    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`));

    // Solo se usa la versión de Desktop aquí, ya que MobileNavItem maneja móvil
    if (isDesktop) {
        return (
            <li key={item.to} className="relative">
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className={cn(
                                    "h-9 w-9 sm:h-10 sm:w-10 text-inherit rounded-full transition-all duration-200 ease-in-out group",
                                    // text-inherit toma el color de NavBar (clara-forest-foreground)
                                    isActive
                                        ? "bg-clara-forest-foreground/20 dark:bg-clara-forest-50/20 scale-110" // Fondo activo sutil
                                        : "opacity-70 hover:opacity-100 hover:bg-clara-forest-foreground/10 dark:hover:bg-clara-forest-50/10"
                                )}
                                aria-label={item.label}
                                aria-current={isActive ? "page" : undefined}
                            >
                                <Link
                                    to={item.to}
                                    className="flex items-center justify-center"
                                >
                                    <IconComponent className={cn(
                                        "h-[1.1rem] w-[1.1rem] sm:h-5 sm:w-5 transition-transform duration-150 ease-in-out",
                                        isActive ? "scale-100" : "group-hover:scale-110" // Icono crece un poco en hover si no está activo
                                        )} />
                                </Link>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent 
                            side="top" 
                            className="bg-clara-warm-gray-800 text-clara-warm-gray-50 border-clara-warm-gray-700" // Tooltip con tus colores
                        >
                            <p>{item.label}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                {isActive && (
                     <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-clara-terracotta rounded-full opacity-90"></span> // Indicador activo con un color de acento
                )}
            </li>
        );
    }

    // Si este componente NavItem solo se usa para desktop, el 'else' podría eliminarse.
    // Si se usa en otros contextos, mantenlo y ajústalo.
    // Por ahora, lo comento ya que MobileNavItem maneja el caso móvil.
    /*
    return (
        <li key={item.to}>
            <Button
                variant="default" 
                size="icon" 
                asChild
                className={cn(
                    "h-auto w-auto px-3 py-2 text-clara-forest-foreground bg-clara-forest rounded-lg transition-all duration-300 flex flex-col items-center gap-1",
                    isActive ? "opacity-100 bg-clara-forest/80" : "opacity-70 hover:opacity-100 hover:bg-clara-forest/90"
                )}
            >
                <Link
                    to={item.to}
                    className="flex flex-col gap-1 items-center justify-center text-inherit"
                >
                    <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="text-xs leading-tight">{item.label}</span>
                </Link>
            </Button>
        </li>
    );
    */
   return null; // O un fragmento vacío si la parte de "no desktop" se elimina
};

export default NavItem;