import { useState } from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
} from "date-fns"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Activity } from ".."

interface CalendarViewProps {
  selectedDate: Date
  onSelectDate: (date: Date) => void
  activities: Activity[]
}

export function CalendarView({ selectedDate, onSelectDate, activities }: CalendarViewProps) {
  const today = startOfToday()
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"))
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function resetToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
    onSelectDate(today)
  }

  // Get day of week index (0 = Sunday, 1 = Monday, etc.)
  const getColStart = (dayIndex: number) => {
    const colStartClasses = [
      "",
      "col-start-2",
      "col-start-3",
      "col-start-4",
      "col-start-5",
      "col-start-6",
      "col-start-7",
    ]
    return colStartClasses[dayIndex]
  }

  // Check if a day has activities
  const hasActivities = (day: Date) => {
    return activities.some((activity) => activity.date === format(day, "yyyy-MM-dd"))
  }

  return (
    <div className="rounded-3xl border border-white/30 bg-clara-sage p-6 shadow-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-clara-sage-foreground capitalize">
          {(() => {
            const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            const month = firstDayCurrentMonth.getMonth();
            const year = firstDayCurrentMonth.getFullYear();
            return `${monthNames[month]} ${year}`;
          })()} 
        </h2>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="icon"
            onClick={resetToToday}
            className="h-10 w-10 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm transition-all duration-200"
            title="Hoy"
          >
            <RefreshCw className="h-5 w-5" />
            <span className="sr-only">Hoy</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={previousMonth} 
            className="h-10 w-10 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Mes anterior</span>
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={nextMonth} 
            className="h-10 w-10 rounded-full p-0 bg-white/20 text-clara-sage-foreground hover:bg-white/30 border-white/30 backdrop-blur-sm transition-all duration-200"
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Mes siguiente</span>
          </Button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-7 text-center text-sm font-bold text-clara-sage-foreground/90 mb-4">
        <div className="py-3">Dom</div>
        <div className="py-3">Lun</div>
        <div className="py-3">Mar</div>
        <div className="py-3">Mié</div>
        <div className="py-3">Jue</div>
        <div className="py-3">Vie</div>
        <div className="py-3">Sáb</div>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm">
        {days.map((day, dayIdx) => (
          <div key={day.toString()} className={cn(dayIdx === 0 && getColStart(getDay(day)), "py-1")}>
            <button
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 font-semibold text-base group",
                isEqual(day, selectedDate) && "bg-clara-forest text-clara-forest-foreground shadow-lg transform scale-105",
                !isEqual(day, selectedDate) && isToday(day) && "text-clara-sage-foreground font-bold border-2 border-white/60 bg-white/10 backdrop-blur-sm",
                !isEqual(day, selectedDate) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-clara-sage-foreground hover:bg-white/20 hover:scale-105 hover:shadow-md",
                !isEqual(day, selectedDate) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-clara-sage-foreground/40 hover:bg-white/10 hover:text-clara-sage-foreground/60",
              )}
            >
              <time className="relative z-10" dateTime={format(day, "yyyy-MM-dd")}>
                {format(day, "d")}
              </time>
              
              {/* Activity indicator */}
              {hasActivities(day) && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                  <div className="h-2 w-2 rounded-full bg-clara-sage-foreground shadow-sm"></div>
                </div>
              )}
              
              {/* Hover effect */}
              <div className="absolute inset-0 rounded-2xl bg-white/0 group-hover:bg-white/10 transition-all duration-200"></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
