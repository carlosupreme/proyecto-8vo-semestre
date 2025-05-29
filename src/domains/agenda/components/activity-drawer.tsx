"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ActivityCard } from "./activity-card"
import { es } from "date-fns/locale"

type Activity = {
  id: number
  name: string
  description: string
  startTime: string
  endTime: string
  date: string
  tags: string[]
  genre: string
  color: string
}

interface ActivityDrawerProps {
  isOpen: boolean
  onClose: () => void
  activities: Activity[]
  selectedDate: Date
  position: "bottom" | "right" | "left"
  isStatic?: boolean // Nueva prop para drawer estático
  onCreateActivity?: () => void // Nueva prop para crear actividad
}

export function ActivityDrawer({
  isOpen,
  onClose,
  activities,
  selectedDate,
  position = "bottom",
  isStatic = false,
  onCreateActivity,
}: ActivityDrawerProps) {
  const [activeCardId, setActiveCardId] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  const handleClose = () => {
    if (!isStatic) {
      onClose()
    }
  }

  const handleCardClick = (activityId: number) => {
    setActiveCardId(activeCardId === activityId ? null : activityId)
  }

  const isBottom = position === "bottom"
  const isLeft = position === "left"

  // Touch event handlers para swipe to dismiss (solo para mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOpen || isStatic) return
    
    const touch = e.touches[0]
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY
    }
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !dragStartRef.current || !isOpen || isStatic) return

    const touch = e.touches[0]
    const deltaX = touch.clientX - dragStartRef.current.x
    const deltaY = touch.clientY - dragStartRef.current.y

    // Solo permitir swipe hacia abajo para cerrar
    const offset = Math.max(0, deltaY)
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return
    }

    setDragOffset(offset)

    if (offset > 10) {
      e.preventDefault()
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging || !isOpen || isStatic) return

    const threshold = 100
    const shouldClose = dragOffset > threshold

    if (shouldClose) {
      handleClose()
    }

    setIsDragging(false)
    setDragOffset(0)
    dragStartRef.current = null
  }

  // Reset drag state when drawer closes
  useEffect(() => {
    if (!isOpen && !isStatic) {
      setIsDragging(false)
      setDragOffset(0)
      dragStartRef.current = null
    }
  }, [isOpen, isStatic])

  // Prevent body scroll when drawer is open on mobile (solo si no es estático)
  useEffect(() => {
    if (isStatic) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isStatic])

  // Convert time string to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number)
    return hours * 60 + minutes
  }

  // Calculate position and height for each activity (solo para timeline view)
  const getActivityStyle = (activity: Activity) => {
    const startMinutes = timeToMinutes(activity.startTime)
    const endMinutes = timeToMinutes(activity.endTime)
    const duration = endMinutes - startMinutes

    const pixelsPerMinute = 1
    const top = (startMinutes - 360) * pixelsPerMinute

    const height =
      activeCardId === activity.id
        ? "auto"
        : Math.max(duration * pixelsPerMinute, 40)

    const zIndex = activeCardId === activity.id ? 50 : 10

    return {
      top: Math.max(top, 0),
      height,
      zIndex,
    }
  }

  // Generate time labels for the timeline
  const generateTimeLabels = () => {
    const labels = []
    for (let hour = 6; hour <= 23; hour++) {
      const time = `${hour.toString().padStart(2, "0")}:00`
      const position = (hour - 6) * 60
      labels.push({ time, position })
    }
    return labels
  }

  const timeLabels = generateTimeLabels()
  const sortedActivities = [...activities].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))

  // Calculate transform based on drag offset
  const getDrawerTransform = () => {
    if (!isDragging || dragOffset === 0 || isStatic) return ""
    return `translateY(${dragOffset}px)`
  }

  // Calculate opacity based on drag progress
  const getDrawerOpacity = () => {
    if (!isDragging || dragOffset === 0 || isStatic) return 1
    const maxOffset = 200
    const opacity = Math.max(0.5, 1 - (dragOffset / maxOffset))
    return opacity
  }

  // Determinar clases base según el tipo de drawer
  const getDrawerClasses = () => {
    if (isStatic && isLeft) {
      // Drawer estático izquierdo para desktop
      return "fixed left-4 top-4 w-80 h-[97vh] z-10"
    }
    
    // Drawer normal con transiciones
    return cn(
      "fixed z-50 transition-all duration-300 ease-in-out",
      isBottom && "inset-x-0 rounded-r-lg",
      isLeft && !isStatic && "top-0 h-full w-full max-w-md md:w-[400px]",
      // Posicionamiento condicional
      isBottom 
        ? (isOpen ? "bottom-0" : "-bottom-full")
        : isLeft && !isStatic
        ? (isOpen ? "left-0" : "-left-full") 
        : (isOpen ? "right-0" : "-right-full"),
      // Altura para bottom drawer
      isBottom && "h-[85vh] md:h-[80vh]",
      !isOpen && !isStatic && "pointer-events-none",
      isDragging && !isStatic && "transition-none"
    )
  }

  const getContentClasses = () => {
    return cn(
      "flex h-full flex-col overflow-hidden bg-[#ececec] shadow-lg",
      isStatic && isLeft ? "rounded-3xl" : isBottom ? "rounded-t-xl" : "rounded-l-xl"
    )
  }



  // Render mobile/tablet timeline content
  const renderTimelineContent = () => (
    <div className={getContentClasses()}>
      {/* Drawer header */}
      <div 
        className="flex items-center justify-between border-b bg-[#d7d4d5] p-4 border-transparent relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle - solo para mobile */}
        {!isStatic && (
          <div className="absolute left-1/2 top-2 h-1 w-12 -translate-x-1/2 rounded-full bg-gray-800/30">
            <div className="absolute -top-2 -bottom-2 -left-4 -right-4" />
          </div>
        )}
        
        <div className={isStatic ? "" : "pt-2"}>
          <h3 className="text-lg font-semibold text-gray-800 capitalize">{format(selectedDate, "EEEE d, MMMM yyyy", {locale: es})}</h3>
          <p className="text-sm text-gray-800">
            {activities.length} {activities.length === 1 ? "activity" : "actividades"}
          </p>
        </div>

        {!isStatic && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="h-4 w-4 text-gray-700" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        )}
      </div>

      {/* Calendar timeline content */}
      <div className="flex-1 overflow-y-auto">
        {activities.length > 0 ? (
          <div className="relative border-transparent">
            {/* Time labels and grid lines */}
            <div className="absolute left-0 top-0 h-full w-16 ">
              {timeLabels.map(({ time, position }) => (
                <div
                  key={time}
                  className="absolute left-0 flex items-center text-xs font-medium text-gray-800"
                  style={{ top: position }}
                >
                  <span className="w-12 pr-2 text-right">{time}</span>
                </div>
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute left-16 top-0 right-0 h-full border-transparent">
              {timeLabels.map(({ position }) => (
                <div
                  key={position}
                  className="absolute left-0 right-0 border-t border-gray-00"
                  style={{ top: position }}
                />
              ))}
            </div>

            {/* Activities */}
            <div className="relative ml-16 mr-4" style={{ height: `${18 * 60}px` }}>
              {sortedActivities.map((activity) => {
                const style = getActivityStyle(activity)
                const isActive = activeCardId === activity.id
                return (
                  <div
                    key={activity.id}
                    className={cn("absolute left-2 right-0", isActive && "h-auto min-h-[160px]")}
                    style={{
                      top: `${style.top}px`,
                      height: isActive ? "auto" : `${style.height}px`,
                      minHeight: isActive ? "160px" : undefined,
                      zIndex: style.zIndex,
                    }}
                  >
                    <ActivityCard
                      activity={activity}
                      isTimelineView
                      isActive={isActive}
                      onClick={() => handleCardClick(activity.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500 mb-4">Parece que puedes tomarte este día</p>
              {onCreateActivity && isStatic && (
                <Button
                  onClick={onCreateActivity}
                  className="bg-[#343b34] hover:bg-black text-white rounded-2xl px-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear actividad
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Para drawer estático, no mostrar backdrop pero usar el mismo contenido timeline
  if (isStatic && isLeft) {
    return (
      <div className={getDrawerClasses()}>
        {renderTimelineContent()}
      </div>
    )
  }

  // Para drawer normal (mobile/tablet)
  return (
    <>
      {/* Backdrop */}
      {isOpen && !isStatic && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 transition-opacity duration-300"
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
  )
}