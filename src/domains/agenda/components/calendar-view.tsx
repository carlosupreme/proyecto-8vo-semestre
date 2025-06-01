import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { useState } from "react";
import type { Appointment as Activity } from "../types";

interface CalendarViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  activities: Activity[];
}

export function CalendarView({ selectedDate, onSelectDate, activities }: CalendarViewProps) {
  const today = startOfToday();
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function resetToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"));
    onSelectDate(today);
  }

  const getColStart = (dayIndex: number) => {
    const colStartClasses = ["", "col-start-2", "col-start-3", "col-start-4", "col-start-5", "col-start-6", "col-start-7"];
    return colStartClasses[dayIndex];
  };

  const hasActivities = (day: Date) => {
    return activities.some((activity) => isSameDay(activity.date, day));
  };

  return (
    <div className="rounded-2xl border border-white/30 bg-clara-sage p-3 sm:p-4 shadow-md backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h2 className="text-lg sm:text-xl font-semibold text-clara-sage-foreground capitalize">
          {format(firstDayCurrentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetToToday}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm"
            title="Hoy"
          >
            <RefreshCw className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            <span className="sr-only">Hoy</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={previousMonth}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            <span className="sr-only">Mes anterior</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
            <span className="sr-only">Mes siguiente</span>
          </Button>
        </div>
      </div>

      {/* Reducido mt, mb, py y texto */}
      <div className="mt-4 sm:mt-6 grid grid-cols-7 text-center text-xs font-semibold text-clara-sage-foreground/80 mb-2 sm:mb-3">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
          <div key={day} className="py-1.5 sm:py-2">{day}</div>
        ))}
      </div>

      {/* Reducido gap, py, tamaño botones, rounded y texto */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-xs sm:text-sm">
        {days.map((day, dayIdx) => (
          <div key={day.toString()} className={cn(dayIdx === 0 && getColStart(getDay(day)), "py-0.5")}>
            <button
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative mx-auto flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl transition-all duration-200 font-medium group",
                isEqual(day, selectedDate) && "bg-clara-forest text-clara-forest-foreground shadow-md transform scale-105",
                !isEqual(day, selectedDate) && isToday(day) && "text-clara-sage-foreground font-semibold border-2 border-white/50 bg-white/10 backdrop-blur-sm",
                !isEqual(day, selectedDate) && !isToday(day) && isSameMonth(day, firstDayCurrentMonth) &&
                "text-clara-sage-foreground hover:bg-white/20 hover:scale-105 hover:shadow-sm",
                !isEqual(day, selectedDate) && !isToday(day) && !isSameMonth(day, firstDayCurrentMonth) &&
                "text-clara-sage-foreground/40 hover:bg-white/10 hover:text-clara-sage-foreground/50",
              )}
            >
              <time className="relative z-10" dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>

              {/* Reducido indicador de actividad */}
              {hasActivities(day) && (
                <div className="absolute bottom-0.5 left-1/2 transform -translate-x-1/2">
                  <div className="h-1.5 w-1.5 rounded-full bg-clara-sage-foreground/70 shadow-xs"></div>
                </div>
              )}

              <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/10 transition-all duration-200"></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}