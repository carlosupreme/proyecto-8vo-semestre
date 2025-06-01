import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "../hooks/useMobile";
import { navItems } from "./nav-items";
import NavItem from "./NavItem";

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
    const isMobile = useIsMobile();
    const location = useLocation();

    const toggleCollapseForDesktop = () => {
        setIsCollapsedForDesktop(!isCollapsedForDesktop);
    };

    if (isMobile) {
        return (
            <div
                className={cn(
                    "fixed bottom-0 left-0 right-0 h-16 bg-background border-t border-clara-beige-200 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] dark:shadow-[0_-2px_10px_rgba(0,0,0,0.15)] z-50",
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
                "fixed left-1/2 transform -translate-x-1/2 bg-primary shadow-lg z-50 max-w-fit transition-all duration-300 ease-in-out",
                isCollapsedForDesktop
                    ? "bottom-0 rounded-t-lg py-1 px-2 h-6"
                    : "bottom-4 rounded-3xl px-8 py-2"
            )}
        >
            {isCollapsedForDesktop ? (
                <div className="flex justify-center items-center h-full opacity-50 max-w-fit">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={toggleCollapseForDesktop}
                        className="p-0 h-6 w-full text-background  cursor-pointer"
                    >
                        <ChevronUp className="h-6 w-6" />
                    </Button>
                </div>
            ) : (
                <div className="relative">
                    <div className="flex justify-end mb-1 absolute top-1 opacity-50 -right-8">
                        <Button
                            variant="link"
                            size="sm"
                            onClick={toggleCollapseForDesktop}
                            className="p-0 h-6 text-background  cursor-pointer"
                        >
                            <ChevronDown className="h-6 w-6" />
                        </Button>
                    </div>
                    <nav className="mr-2">
                        <ul className="flex justify-around gap-6 items-center w-full">
                            {navItems.map((item) => (
                                <NavItem key={item.to} item={item} />
                            ))}


                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default NavBar;