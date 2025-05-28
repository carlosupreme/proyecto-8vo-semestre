import {
    CalendarDays,
    MessageSquare,
    Settings,
    type LucideIcon
} from "lucide-react";

export type NavItem = {
    to: string;
    label: string;
    icon: LucideIcon;
}

export const navItems: NavItem[] = [
    { to: "/chats", label: "Chats", icon: MessageSquare },
    { to: "/agenda", label: "Agenda", icon: CalendarDays },
    { to: "/ajustes", label: "Ajustes", icon: Settings },
    // { to: "/cuenta", label: "Cuenta", icon: User2 },
];
