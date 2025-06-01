import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetClients } from "../../clients/hooks/useGetClients";
import { minutesToTimeString, type Appointment } from "../types";
import { ActivityCard } from "./activity-card"; // ActivityCard también podría necesitar ajustes
import type { Client } from "../../clients/types";

export type Activity = {
  id: string;
  title: string;
  notes: string;
  startTime: string;
  endTime: string;
  date: string;
  tags: string[];
  color: string;
  client: Client | undefined;
};

interface ActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  appointments: Appointment[];
  selectedDate: Date;
  position: "bottom" | "right" | "left";
  isStatic?: boolean;
  onCreateActivity?: () => void;
}

export function ActivityDrawer({
  isOpen,
  onClose,
  appointments,
  selectedDate,
  position = "bottom",
  isStatic = false,
  onCreateActivity,
}: ActivityDrawerProps) {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const drawerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const { data: clients = [] } = useGetClients();

  const handleClose = () => {
    if (!isStatic) onClose();
  };

  const handleCardClick = (activityId: string) => {
    setActiveCardId(activeCardId === activityId ? null : activityId);
  };

  const isBottom = position === "bottom";
  const isLeft = position === "left";

  const formattedActivities: Activity[] = appointments.map((appointment: Appointment) => {
    const client = clients.find(client => client.id === appointment.clientId);
    return {
      id: appointment.id,
      title: appointment.title,
      notes: appointment.notes,
      startTime: minutesToTimeString(appointment.timeRange.startAt),
      endTime: minutesToTimeString(appointment.timeRange.endAt),
      date: appointment.date,
      tags: appointment.tags || [],
      color: appointment.color || 'bg-clara-sage',
      client
    };
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || isStatic) return;
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !isOpen || isStatic) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - dragStartRef.current.x;
    const deltaY = touch.clientY - dragStartRef.current.y;
    const offset = Math.max(0, deltaY);
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;
    setDragOffset(offset);
    if (offset > 10) e.preventDefault();
  };

  const handleTouchEnd = () => {
    if (!isDragging || !isOpen || isStatic) return;
    const threshold = 80; // Reducido
    if (dragOffset > threshold) handleClose();
    setIsDragging(false);
    setDragOffset(0);
    dragStartRef.current = null;
  };

  useEffect(() => {
    if (!isOpen && !isStatic) {
      setIsDragging(false);
      setDragOffset(0);
      dragStartRef.current = null;
    }
  }, [isOpen, isStatic]);

  useEffect(() => {
    if (isStatic) return;
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, isStatic]);

  const getActivityStyle = (activity: Appointment) => {
    const startMinutes = activity.timeRange.startAt;
    const endMinutes = activity.timeRange.endAt;
    const duration = endMinutes - startMinutes;
    const pixelsPerMinute = 0.8; // Reducido para que la timeline sea más compacta
    const top = (startMinutes - 360) * pixelsPerMinute; // 360 = 6:00 AM
    const height = activeCardId === activity.id ? "auto" : Math.max(duration * pixelsPerMinute, 30); // Reducido min height
    const zIndex = activeCardId === activity.id ? 50 : 10;
    return { top: Math.max(top, 0), height, zIndex };
  };

  const generateTimeLabels = () => {
    const labels = [];
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`;
      const position = (hour - 6) * 60 * 0.8; // Ajustado a pixelsPerMinute
      labels.push({ time, position });
    }
    return labels;
  };
  const timeLabels = generateTimeLabels();

  const sortedActivities = [...appointments].sort((a, b) => a.timeRange.startAt - b.timeRange.startAt);

  const getDrawerTransform = () => (isDragging && dragOffset !== 0 && !isStatic ? `translateY(${dragOffset}px)` : "");
  const getDrawerOpacity = () => (isDragging && dragOffset !== 0 && !isStatic ? Math.max(0.5, 1 - (dragOffset / 150)) : 1); // Reducido maxOffset

  const getDrawerClasses = () => {
    if (isStatic && isLeft) {
      // Reducido ancho y alto, más pegado
      return "fixed left-2 top-2 w-72 h-[calc(100vh-1rem)] z-10"; 
    }
    return cn(
      "fixed z-50 transition-all duration-300 ease-in-out",
      isBottom && "inset-x-0 rounded-r-lg",
      // Reducido ancho para drawer lateral móvil/tablet
      isLeft && !isStatic && "top-0 h-full w-full max-w-xs sm:max-w-sm md:w-[320px]", 
      isBottom
        ? (isOpen ? "bottom-0" : "-bottom-full")
        : isLeft && !isStatic
          ? (isOpen ? "left-0" : "-left-full")
          : (isOpen ? "right-0" : "-right-full"),
      // Reducida altura para bottom drawer
      isBottom && "h-[75vh] md:h-[70vh]",
      !isOpen && !isStatic && "pointer-events-none",
      isDragging && !isStatic && "transition-none"
    );
  };

  const getContentClasses = () => cn(
    "flex h-full flex-col overflow-y-auto bg-gradient-to-br from-[#f8f8f8] to-[#ececec] shadow-lg border border-white/20 backdrop-blur-sm",
    // Reducido rounded
    isStatic && isLeft ? "rounded-2xl" : isBottom ? "rounded-t-2xl" : "rounded-l-2xl"
  );

  const renderTimelineContent = () => (
    <div className={getContentClasses()}>
      <div
        className="flex items-center justify-between border-b bg-gradient-to-r from-clara-warm-gray to-clara-beige p-4 border-white/20 relative" // Reducido padding
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!isStatic && ( // Reducido drag handle
          <div className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-white/30 shadow-sm">
            <div className="absolute -top-2 -bottom-2 -left-4 -right-4" />
          </div>
        )}
        <div className={isStatic ? "" : "pt-2"}> {/* Reducido pt */}
          <h3 className="text-base sm:text-lg font-semibold text-clara-warm-gray-foreground capitalize mb-0.5"> {/* Reducido texto y mb */}
            {(() => {
              const dayNames = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']; // Abreviado
              const monthNames = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']; // Abreviado
              return `${dayNames[selectedDate.getDay()]} ${selectedDate.getDate()} de ${monthNames[selectedDate.getMonth()]}, ${selectedDate.getFullYear()}`;
            })()}
          </h3>
          <p className="text-xs text-clara-warm-gray-foreground/70 font-medium"> {/* Reducido texto */}
            {appointments.length} {appointments.length === 1 ? "actividad" : "actividades"}
          </p>
        </div>
        {!isStatic && (
          <div className="flex items-center gap-1"> {/* Reducido gap */}
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full hover:bg-white/20"> {/* Reducido botón */}
              <X className="h-4 w-4 text-clara-warm-gray-foreground" /> {/* Reducido icono */}
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        {appointments.length > 0 ? (
          <div className="relative border-transparent">
            <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white/50 to-transparent"> {/* Reducido ancho labels */}
              {timeLabels.map(({ time, position }) => (
                <div
                  key={time}
                  className="absolute left-0 flex items-center text-xs font-semibold text-clara-warm-gray-foreground/80" /* Reducido texto */
                  style={{ top: position }}
                >
                  <span className="w-14 pr-1.5 text-right bg-white/60 rounded-r-md py-0.5 backdrop-blur-sm">{time}</span> {/* Reducido ancho, pr, rounded, py */}
                </div>
              ))}
            </div>
            <div className="absolute left-16 top-0 right-0 h-full border-transparent"> {/* Ajustado left */}
              {timeLabels.map(({ position }) => (
                <div key={position} className="absolute left-0 right-0 border-t border-clara-warm-gray/20" style={{ top: position }} />
              ))}
            </div>
            <div className="relative ml-16 mr-2 sm:mr-4" style={{ height: `${18 * 60 * 0.8}px` }}> {/* Ajustado ml, mr y height */}
              {sortedActivities.map((appointment) => {
                const style = getActivityStyle(appointment);
                const isActive = activeCardId === appointment.id;
                const formattedActivity = formattedActivities.find(fa => fa.id === appointment.id);
                if (!formattedActivity) return null;
                return (
                  <div
                    key={appointment.id}
                    // Reducido min-height
                    className={cn("absolute left-1.5 right-0", isActive && "h-auto min-h-[120px]")} 
                    style={{
                      top: `${style.top}px`,
                      height: isActive ? "auto" : `${style.height}px`,
                      minHeight: isActive ? "120px" : undefined,
                      zIndex: style.zIndex,
                    }}
                  >
                    <ActivityCard // ActivityCard también debe ser más compacta
                      activity={formattedActivity}
                      isTimelineView
                      isActive={isActive}
                      onClick={() => handleCardClick(appointment.id)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-4 sm:p-6"> {/* Reducido padding */}
              <div className="bg-clara-sage p-4 rounded-2xl mb-4 mx-auto w-fit"> {/* Reducido padding, rounded, mb */}
                <div className="w-10 h-10 bg-white/30 rounded-xl mx-auto"></div> {/* Reducido icono */}
              </div>
              <h4 className="text-base font-semibold text-clara-warm-gray-foreground mb-1"> {/* Reducido texto y mb */}
                ¡Día libre!
              </h4>
              <p className="text-clara-warm-gray-foreground/70 mb-4 text-xs"> {/* Reducido texto y mb */}
                Parece que puedes tomarte este día para descansar
              </p>
              {onCreateActivity && isStatic && (
                <Button // Reducido botón
                  onClick={onCreateActivity}
                  className="bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-xl px-4 py-2 text-sm font-medium shadow-md"
                >
                  <Plus className="w-4 h-4 mr-2" /> {/* Reducido icono y mr */}
                  Crear actividad
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isStatic && isLeft) {
    return <div className={getDrawerClasses()}>{renderTimelineContent()}</div>;
  }

  return (
    <>
      {isOpen && !isStatic && (
        <div
          className="fixed inset-0 bg-black/15 z-40 transition-opacity duration-300" // Más sutil backdrop
          style={{ opacity: getDrawerOpacity() }}
          onClick={handleClose}
        />
      )}
      <div
        ref={drawerRef}
        className={getDrawerClasses()}
        style={{
          transform: isDragging && !isStatic ? getDrawerTransform() : "",
          opacity: isDragging && !isStatic ? getDrawerOpacity() : 1
        }}
      >
        {renderTimelineContent()}
      </div>
    </>
  );
}