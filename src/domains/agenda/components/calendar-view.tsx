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
    <div className="rounded-xl border border-[#899387] bg-[#899387] p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">{format(firstDayCurrentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={resetToToday}
            className="h-8 w-8 rounded-full p-0 bg-[#899387] text-white"
            title="Today"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only ">Today</span>
          </Button>
          <Button variant="outline" size="icon" onClick={previousMonth} className="h-8 w-8 rounded-full p-0 bg-[#899387] text-white">
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 rounded-full p-0 bg-[#899387] text-white">
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-7 text-center text-xs font-medium text-white">
        <div>D</div>
        <div>L</div>
        <div>M</div>
        <div>M</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
      </div>

      <div className="mt-2 grid grid-cols-7 gap-1 text-sm">
        {days.map((day, dayIdx) => (
          <div key={day.toString()} className={cn(dayIdx === 0 && getColStart(getDay(day)), "py-1")}>
            <button
              type="button"
              onClick={() => onSelectDate(day)}
              className={cn(
                "mx-auto flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                isEqual(day, selectedDate) && "bg-[#343b34]  font-medium",
                !isEqual(day, selectedDate) && isToday(day) && "text-white font-medium border border-white",
                !isEqual(day, selectedDate) &&
                  !isToday(day) &&
                  isSameMonth(day, firstDayCurrentMonth) &&
                  "text-[#343b34] hover:bg-[#343b34]",
                !isEqual(day, selectedDate) &&
                  !isToday(day) &&
                  !isSameMonth(day, firstDayCurrentMonth) &&
                  "text-gray-400 hover:bg-gray-50",
              )}
            >
              <time className="text-white" dateTime={format(day, "yyyy-MM-dd")}>{format(day, "d")}</time>
            </button>

            {/* Activity indicator */}
            <div className="mx-auto mt-1 flex justify-center">
              {hasActivities(day) && <div className="h-1.5 w-1.5 rounded-full bg-white"></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
