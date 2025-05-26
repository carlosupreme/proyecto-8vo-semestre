import { navItems } from "./nav-items";
import NavItem from "./NavItem";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className={cn(
                "fixed left-1/2 transform -translate-x-1/2 bg-primary shadow-lg z-50 max-w-fit transition-all duration-300 ease-in-out",
                isCollapsed
                    ? "bottom-0 rounded-t-lg py-1 px-2 h-6"
                    : "bottom-4 rounded-3xl px-8 py-2"
            )}
        >
            {isCollapsed ? (
                <div className="flex justify-center items-center h-full opacity-50 max-w-fit">
                    <Button
                        variant="default"
                        size="sm"
                        onClick={toggleCollapse}
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
                            onClick={toggleCollapse}
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

