import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import type { NavItem as NavItemType } from "./nav-items";

interface NavItemProps {
    item: NavItemType;
}

const NavItem = ({ item }: NavItemProps) => {
    const location = useLocation();
    const IconComponent = item.icon;
    const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(`${item.to}/`));


    return (
        <li key={item.to}>
            <Button
                variant="default"
                size="icon"
                asChild
                className={cn(
                    "h-10 w-10 text-background rounded-full transition-all duration-300  ",
                    isActive ? "opacity-100" : "opacity-50"
                )}
            >
                <Link
                    to={item.to}
                    className="flex flex-col gap-1 text-background items-center justify-center"
                >
                    <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="text-xs">{item.label}</span>
                </Link>
            </Button>
        </li>
    );

};

export default NavItem;