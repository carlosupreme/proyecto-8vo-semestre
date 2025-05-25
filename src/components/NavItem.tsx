import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavItem as NavItemType } from "./nav-items";
import { Link, useLocation } from "@tanstack/react-router";

const NavItem = ({ item }: { item: NavItemType }) => {
    const pathname = useLocation().pathname;
    const IconComponent = item.icon;
    const isActive = pathname === item.to || pathname.startsWith(`${item.to}/`);

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
}

export default NavItem;
