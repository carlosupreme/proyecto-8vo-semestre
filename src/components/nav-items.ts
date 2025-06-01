import {
    Brain,
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
    { to: "/memoria", label: "CLARA", icon: Brain },
    { to: "/ajustes", label: "Ajustes", icon: Settings },
];
