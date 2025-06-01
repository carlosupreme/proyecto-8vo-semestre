import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Plus, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useGetClients } from "../../clients/hooks/useGetClients"
import { minutesToTimeString, type Appointment } from "../types"
import { ActivityCard } from "./activity-card"
import type { Client } from "../../clients/types"

export type Activity = {
  id: string
  title: string
  notes: string
  startTime: string
  endTime: string
  date: string
  tags: string[]
  color: string
  client: Client | undefined
}

interface ActivityDrawerProps {
  isOpen: boolean
  onClose: () => void
  appointments: Appointment[]
  selectedDate: Date
  position: "bottom" | "right" | "left"
  isStatic?: boolean // Nueva prop para drawer estático
  onCreateActivity?: () => void // Nueva prop para crear actividad
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
  const [activeCardId, setActiveCardId] = useState<string | null>(null) // Changed to string
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)
  const drawerRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)

  const { data: clients = [] } = useGetClients()

  const handleClose = () => {
    if (!isStatic) {
      onClose()
    }
  }

  const handleCardClick = (activityId: string) => { // Changed to string
    setActiveCardId(activeCardId === activityId ? null : activityId)
  }

  const isBottom = position === "bottom"
  const isLeft = position === "left"

  // Convert Appointment to Activity format for ActivityCard
  const formattedActivities: Activity[] = appointments.map((appointment: Appointment) => {
    const client = clients.find(client => client.id === appointment.clientId)

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
    }
  })

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

  // Calculate position and height for each activity (solo para timeline view)
  const getActivityStyle = (activity: Appointment) => {
    const startMinutes = activity.timeRange.startAt
    const endMinutes = activity.timeRange.endAt
    const duration = endMinutes - startMinutes

    const pixelsPerMinute = 1
    const top = (startMinutes - 360) * pixelsPerMinute // 360 = 6:00 AM

    const height = activeCardId === activity.id ? "auto" : Math.max(duration * pixelsPerMinute, 40)
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

  // Sort activities by start time
  const sortedActivities = [...appointments].sort((a, b) =>
    a.timeRange.startAt - b.timeRange.startAt
  )

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
      "flex h-full flex-col overflow-hidden bg-gradient-to-br from-[#f8f8f8] to-[#ececec] shadow-xl border border-white/20 backdrop-blur-sm",
      isStatic && isLeft ? "rounded-3xl" : isBottom ? "rounded-t-3xl" : "rounded-l-3xl"
    )
  }

  // Render mobile/tablet timeline content
  const renderTimelineContent = () => (
    <div className={getContentClasses()}>
      {/* Drawer header */}
      <div
        className="flex items-center justify-between border-b bg-gradient-to-r from-clara-warm-gray to-clara-beige p-6 border-white/20 relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle - solo para mobile */}
        {!isStatic && (
          <div className="absolute left-1/2 top-3 h-1.5 w-16 -translate-x-1/2 rounded-full bg-white/40 shadow-sm">
            <div className="absolute -top-3 -bottom-3 -left-6 -right-6" />
          </div>
        )}

        <div className={isStatic ? "" : "pt-3"}>
          <h3 className="text-xl font-bold text-clara-warm-gray-foreground capitalize mb-1">
            {(() => {
              const dayNames = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
              const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
              const dayName = dayNames[selectedDate.getDay()]
              const day = selectedDate.getDate()
              const month = monthNames[selectedDate.getMonth()]
              const year = selectedDate.getFullYear()
              return `${dayName} ${day} de ${month}, ${year}`
            })()}
          </h3>
          <p className="text-sm text-clara-warm-gray-foreground/70 font-medium">
            {appointments.length} {appointments.length === 1 ? "actividad" : "actividades"} programadas
          </p>
        </div>

        {!isStatic && (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10 rounded-full hover:bg-white/20 transition-all duration-200">
              <X className="h-5 w-5 text-clara-warm-gray-foreground" />
              <span className="sr-only">Cerrar</span>
            </Button>
          </div>
        )}
      </div>

      {/* Calendar timeline content */}
      <div className="flex-1 overflow-y-auto">
        {appointments.length > 0 ? (
          <div className="relative border-transparent">
            {/* Time labels and grid lines */}
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-white/50 to-transparent">
              {timeLabels.map(({ time, position }) => (
                <div
                  key={time}
                  className="absolute left-0 flex items-center text-sm font-bold text-clara-warm-gray-foreground/80"
                  style={{ top: position }}
                >
                  <span className="w-16 pr-3 text-right bg-white/70 rounded-r-lg py-1 backdrop-blur-sm">{time}</span>
                </div>
              ))}
            </div>

            {/* Grid lines */}
            <div className="absolute left-20 top-0 right-0 h-full border-transparent">
              {timeLabels.map(({ position }) => (
                <div
                  key={position}
                  className="absolute left-0 right-0 border-t border-clara-warm-gray/20"
                  style={{ top: position }}
                />
              ))}
            </div>

            {/* Activities */}
            <div className="relative ml-20 mr-6" style={{ height: `${18 * 60}px` }}>
              {sortedActivities.map((appointment) => {
                const style = getActivityStyle(appointment)
                const isActive = activeCardId === appointment.id

                // Find the corresponding formatted activity for ActivityCard
                const formattedActivity = formattedActivities.find(fa => fa.id === appointment.id)

                if (!formattedActivity) return null

                return (
                  <div
                    key={appointment.id}
                    className={cn("absolute left-2 right-0", isActive && "h-auto min-h-[160px]")}
                    style={{
                      top: `${style.top}px`,
                      height: isActive ? "auto" : `${style.height}px`,
                      minHeight: isActive ? "160px" : undefined,
                      zIndex: style.zIndex,
                    }}
                  >
                    <ActivityCard
                      activity={formattedActivity}
                      isTimelineView
                      isActive={isActive}
                      onClick={() => handleCardClick(appointment.id)}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center p-8">
              <div className="bg-clara-sage p-6 rounded-3xl mb-6 mx-auto w-fit">
                <div className="w-12 h-12 bg-white/30 rounded-2xl mx-auto"></div>
              </div>
              <h4 className="text-lg font-bold text-clara-warm-gray-foreground mb-2">¡Día libre!</h4>
              <p className="text-clara-warm-gray-foreground/70 mb-6 text-sm">Parece que puedes tomarte este día para descansar</p>
              {onCreateActivity && isStatic && (
                <Button
                  onClick={onCreateActivity}
                  className="bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-2xl px-8 py-3 font-semibold transition-all duration-200 shadow-lg"
                >
                  <Plus className="w-5 h-5 mr-3" />
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