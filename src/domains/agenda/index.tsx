import { Plus } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Button } from "../../components/ui/button"
import { useMediaQuery } from "../../hooks/use-media-query"
import { ActivityDrawer } from "./components/activity-drawer"
import { CalendarView } from "./components/calendar-view"
import { CreateActivityDialog } from "./components/create-activity-dialog"
import WelcomeCard from "./components/welcome-card"
import { useDayAppointments } from "./hooks/use-appointments"
import { minutesToTimeString } from "./types"
import type { Appointment } from "./types"

// Activity type expected by UI components
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

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  // Used in scroll event handler
  const [_scrollY, setScrollY] = useState(0)
  const [isStacked, setIsStacked] = useState(false)
  
  // Fetch appointments for the selected date
  const { data: appointments = [] } = useDayAppointments(selectedDate)

  // const isMobile = useMediaQuery("(max-width: 768px)")
  // const isTablet = useMediaQuery("(max-width: 1099px)")
  const isDesktop = useMediaQuery("(min-width: 1100px)")

  const summaryCardRef = useRef(null)
  const calendarCardRef = useRef(null)
  const activitiesCardRef = useRef(null)
  
  const handleClaraToggle = (enabled: boolean) => {
    console.log('CLARA está:', enabled ? 'activada' : 'desactivada')
  }

  // Format appointments to match the UI component requirements
  const formattedAppointments: Activity[] = appointments.map((appointment: Appointment, index) => ({
    // Convert string ID to number for UI components
    id: index + 1,
    name: appointment.title || 'Untitled Appointment',
    description: appointment.notes,
    startTime: minutesToTimeString(appointment.timeRange.startAt),
    endTime: minutesToTimeString(appointment.timeRange.endAt),
    date: appointment.date,
    tags: appointment.tags || [],
    genre: appointment.genre || 'Default',
    color: appointment.color || 'bg-sky-500'
  }))

  // Get today's date in ISO format
  const today = new Date().toISOString().split("T")[0]
  
  // Count of today's appointments
  const todayAppointmentsCount = appointments.filter(appointment => 
    appointment.date === today
  ).length

  // Scroll effect for mobile card stacking
  useEffect(() => {
    if (isDesktop) return

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)

      // Threshold for when to start stacking (adjust as needed)
      const stackThreshold = 100

      if (currentScrollY > stackThreshold && !isStacked) {
        setIsStacked(true)
      } else if (currentScrollY <= stackThreshold && isStacked) {
        setIsStacked(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDesktop, isStacked])

  // Calculate transform values for stacking effect
  const getCardTransform = (cardIndex: number) => {
    if (isDesktop || !isStacked) return {}

    const baseOffset = 20 // Base offset for stacking
    const scaleReduction = 0.05 // How much to scale down each card

    return {
      transform: `translateY(-${cardIndex * baseOffset}px) scale(${1 - cardIndex * scaleReduction})`,
      zIndex: cardIndex + 1, // First card (index 0) = z-index 1, last card (index 2) = z-index 3
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    }
  }

  // Handle viewing activities - different behavior for mobile/tablet vs desktop
  const handleViewActivities = () => {
    if (!isDesktop) {
      setIsDrawerOpen(true)
    }
    // En desktop no hacer nada ya que el drawer siempre está visible
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    // Don't auto-open drawer on date selection
  }

  const handleCreateActivity = () => {
    setIsCreateDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-white pb-2 overflow-hidden">
      {/* Desktop Static ActivityDrawer - Left Side */}
      {isDesktop && (
        <ActivityDrawer
          isOpen={true}
          onClose={() => {}} // No se usa en modo estático
          activities={formattedAppointments}
          selectedDate={selectedDate}
          position="left"
          isStatic={true}
          onCreateActivity={handleCreateActivity}
        />
      )}

      {/* Main Content */}
      <div className="pb-2">
        {/* Content Grid */}
        <div className="max-w-full mx-auto px-3 py-1">
          <div className={`${isDesktop ? "grid grid-cols-12 gap-6 h-screen pl-96" : "space-y-4"}`}>
            {/* Main Content - Left Side */}
            <div className={`${isDesktop ? "col-span-9" : "w-full"} space-y-4`}>
              <main className="">
                <WelcomeCard onClaraToggle={handleClaraToggle}  />
              </main>

              {/* Today's Summary Card */}
              <div
                ref={summaryCardRef}
                className="bg-[#ae8276] rounded-2xl p-4 shadow-md relative"
                style={!isDesktop ? getCardTransform(0) : {}}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h3 className="font-semibold text-white">CLARA ha agendado</h3>
                      <p className="text-sm text-white">{todayAppointmentsCount} actividades</p>
                    </div>
                  </div>
                  {!isDesktop && (
                    <Button
                      size="sm"
                      className="bg-[#272624] hover:bg-[#272624] text-white rounded-full px-4"
                      onClick={handleViewActivities}
                    >
                      Ver
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar Card */}
              <div
                ref={calendarCardRef}
                className="bg-[#899387] rounded-3xl p-4 shadow-sm relative"
                style={!isDesktop ? getCardTransform(1) : {}}
              >
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  activities={formattedAppointments}
                />
                <div className="mt-4">
                  <Button
                    onClick={handleCreateActivity}
                    className="w-full bg-[#343b34] hover:bg-black text-white rounded-2xl h-12 flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Crear Evento</span>
                  </Button>
                </div>
              </div>

              {/* Activities Preview Card - Mobile/Tablet Only */}
              {!isDesktop && formattedAppointments.length > 0 && (
                <div
                  ref={activitiesCardRef}
                  className="bg-[#d7d4d5] rounded-3xl p-6 shadow-sm border border-gray-100 relative"
                  style={getCardTransform(2)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[261f0f]">
                      {selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                    <span className="text-sm text-[261f0f]">{formattedAppointments.length} eventos</span>
                  </div>

                  <div className="space-y-3">
                    {formattedAppointments.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-0 bg-[#d7d4d5] rounded-2xl">
                        <div className={`w-3 h-3 rounded-full ${activity.color}`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[261f0f] truncate">{activity.name}</p>
                          <p className="text-sm text-[261f0f]">
                            {activity.startTime} - {activity.endTime}
                          </p>
                        </div>
                      </div>
                    ))}

                    {formattedAppointments.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-[261f0f] hover:bg-blue-50 rounded-2xl"
                        onClick={handleViewActivities}
                      >
                        Ver {formattedAppointments.length - 3} eventos más
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Center Column - Quick Actions */}
            {isDesktop && (
              <div className="col-span-3 space-y-4 mt-2">
                <div className="bg-[#899387] rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-gray-200 mb-4">Atajos</h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleCreateActivity}
                      className="w-full bg-[#343b34] hover:bg-black text-white rounded-2xl h-12"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Nuevo Evento
                    </Button>
                  </div>
                </div>

                {/* Selected Date Summary */}
                {formattedAppointments.length > 0 && (
                  <div className="bg-[#c9b096] rounded-3xl p-4 shadow-sm border border-gray-100">
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-100 text-sm">
                        {selectedDate.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </h3>
                      <p className="text-xs text-gray-100">{formattedAppointments.length} eventos</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Drawer - Solo para Mobile/Tablet */}
      {!isDesktop && (
        <ActivityDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          activities={formattedAppointments}
          selectedDate={selectedDate}
          position="bottom"
          onCreateActivity={handleCreateActivity}
        />
      )}

      {/* Create Activity Dialog */}
      <CreateActivityDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  )
}