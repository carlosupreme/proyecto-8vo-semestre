import { navItems } from "./nav-items";
import NavItem from "./NavItem";
import { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";

const useIsMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breakpoint]);
    return isMobile;
};

// Componente NavItem específico para la barra móvil
const MobileNavItem = ({ item, isActive }: { item: typeof navItems[0], isActive: boolean }) => {
    return (
        <Link
            to={item.to}
            className={cn(
                "flex flex-col items-center justify-center flex-1 h-full p-1 transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-clara-forest dark:focus-visible:ring-clara-sage rounded-md group",
                isActive
                    ? "text-clara-forest dark:text-clara-forest-foreground" // Color activo
                    : "text-clara-warm-gray-foreground/80 hover:text-clara-warm-gray-foreground dark:text-clara-beige-foreground/70 dark:hover:text-clara-beige-foreground" // Color inactivo y hover
            )}
            aria-current={isActive ? "page" : undefined}
        >
            <item.icon className={cn(
                "h-5 w-5 sm:h-[1.125rem] sm:w-[1.125rem] mb-0.5 transition-transform duration-150 ease-in-out",
                 isActive ? "scale-110" : "group-hover:scale-105" // Efecto sutil en icono
                )} />
            <span className={cn(
                "text-[0.65rem] sm:text-xs leading-tight tracking-tight",
                 isActive && "font-semibold" // Fuente más gruesa para el label activo
                )}>{item.label}</span>
        </Link>
    );
};

const NavBar = () => {
    const [isCollapsedForDesktop, setIsCollapsedForDesktop] = useState(false);
    const isMobile = useIsMobile(768);
    const location = useLocation();

    const toggleCollapseForDesktop = () => {
        setIsCollapsedForDesktop(!isCollapsedForDesktop);
    };

    if (isMobile) {
        return (
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 h-16 bg-clara-beige-50 border-t border-clara-beige-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.15)] z-50",
                    "pb-1" // O tu padding para safe area
                )}
            >
                <nav className="h-full">
                    <ul className="flex justify-around items-stretch h-full px-1 sm:px-2">
                        {navItems.map((item) => (
                            <MobileNavItem
                                key={item.to}
                                item={item}
                                isActive={location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`))}
                            />
                        ))}
                    </ul>
                </nav>
            </div>
        );
    }

    // Navbar para Desktop
    return (
        <div
            className={cn(
                "fixed left-1/2 transform -translate-x-1/2 bg-clara-forest text-clara-forest-foreground shadow-xl z-50 transition-all duration-300 ease-in-out print:hidden",
                isCollapsedForDesktop
                    ? "bottom-0 rounded-t-lg py-0 px-2 h-7 hover:h-8"
                    : "bottom-4 rounded-full px-5 py-2" // Ajustado padding
            )}
        >
            {isCollapsedForDesktop ? (
                <div className="flex justify-center items-center h-full">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleCollapseForDesktop}
                        className="p-0 h-full w-full text-inherit hover:bg-black/10 dark:hover:bg-white/10 rounded-md"
                        aria-label="Expandir barra de navegación"
                    >
                        <ChevronUp className="h-5 w-5" />
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <Button
                        variant="ghost" // Cambiado a ghost para consistencia
                        size="icon"
                        onClick={toggleCollapseForDesktop}
                        className="absolute -top-1.5 -right-1.5 h-6 w-6 text-inherit opacity-50 hover:opacity-100 hover:bg-black/20 dark:hover:bg-white/20 rounded-full p-1"
                        aria-label="Colapsar barra de navegación"
                    >
                        <ChevronDown className="h-4 w-4" />
                    </Button>
                    <nav>
                        <ul className="flex justify-around gap-4 sm:gap-5 items-center"> {/* Gap ajustado */}
                            {navItems.map((item) => (
                                <NavItem key={item.to} item={item} isDesktop={true} />
                            ))}
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default NavBar;