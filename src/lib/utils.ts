import { clsx, type ClassValue } from "clsx"
import { format, isToday, isYesterday } from "date-fns";
import { es } from "date-fns/locale";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'Ahora';
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;

  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short'
  });
};

export function getAppointmentColor(id: string): string {
  const colors = [
    'bg-rose-500',
    'bg-sky-500',
    'bg-amber-500',
    'bg-emerald-500',
    'bg-violet-500',
    'bg-indigo-500',
    'bg-pink-500',
  ];
  
  const colorIndex = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[colorIndex];
}

export function formatMessageTime(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return format(date, 'HH:mm');
  } else if (isYesterday(date)) {
    return `Ayer ${format(date, 'HH:mm')}`;
  } else {
    return format(date, 'dd/MM/yyyy HH:mm');
  }
};

export function formatDateSeparator(timestamp: number): string {
  const date = new Date(timestamp);

  if (isToday(date)) {
    return 'Hoy';
  } else if (isYesterday(date)) {
    return 'Ayer';
  } else {
    return format(date, "EEEE, d 'de' MMMM", { locale: es });
  }
};