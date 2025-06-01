import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-4", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-2 relative items-center w-full",
        caption_label: "text-lg font-bold text-clara-warm-gray-foreground",
        nav: "flex items-center gap-2",
        nav_button: cn(
          "h-8 w-8 bg-clara-sage/10 border border-clara-sage/30 text-clara-sage hover:bg-clara-sage hover:text-clara-sage-foreground rounded-full p-0 transition-all duration-200 hover:scale-105 shadow-sm"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse mt-4",
        head_row: "flex mb-2",
        head_cell:
          "text-clara-warm-gray-foreground/70 rounded-md w-10 h-8 font-semibold text-sm flex items-center justify-center",
        row: "flex w-full mt-1",
        cell: cn(
          "relative p-0.5 text-center text-sm focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-2xl [&:has(>.day-range-start)]:rounded-l-2xl first:[&:has([aria-selected])]:rounded-l-2xl last:[&:has([aria-selected])]:rounded-r-2xl"
            : "[&:has([aria-selected])]:rounded-2xl"
        ),
        day: cn(
          "h-10 w-10 p-0 font-semibold rounded-2xl transition-all duration-200 hover:scale-105 border border-transparent",
          "text-clara-warm-gray-foreground hover:bg-clara-sage/20 hover:text-clara-sage hover:border-clara-sage/30",
          "focus:outline-none focus:ring-2 focus:ring-clara-sage/50 focus:ring-offset-2"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-clara-sage aria-selected:text-clara-sage-foreground rounded-l-2xl",
        day_range_end:
          "day-range-end aria-selected:bg-clara-sage aria-selected:text-clara-sage-foreground rounded-r-2xl",
        day_selected:
          "bg-clara-sage text-clara-sage-foreground hover:bg-clara-sage/90 hover:text-clara-sage-foreground focus:bg-clara-sage focus:text-clara-sage-foreground shadow-lg border-clara-sage",
        day_today: "bg-clara-sage/20 text-clara-sage-foreground border-clara-sage/40 font-bold shadow-sm",
        day_outside:
          "day-outside text-clara-warm-gray-foreground/40 aria-selected:text-clara-warm-gray-foreground/40 hover:text-clara-warm-gray-foreground/60",
        day_disabled: "text-clara-warm-gray-foreground/30 opacity-50 cursor-not-allowed hover:bg-transparent hover:scale-100",
        day_range_middle:
          "aria-selected:bg-clara-sage/30 aria-selected:text-clara-sage",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }
