import { Plus } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "../../components/ui/button"
import { useMediaQuery } from "../../hooks/use-media-query"
import { useWebSocket } from "../../hooks/useWebSocket"
import { useGetUser } from "../account/hooks/useGetUser"
import { ActivityDrawer } from "./components/activity-drawer"
import { CalendarView } from "./components/calendar-view"
import { CreateActivityDialog } from "./components/create-activity-dialog"
import WelcomeCard from "./components/welcome-card"
import { useDayAppointments } from "./hooks/use-appointments"
import { minutesToTimeString, type Appointment } from "./types"

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  // Used in scroll event handler
  const [_scrollY, setScrollY] = useState(0)
  const [isStacked, setIsStacked] = useState(false)

  const { data: appointments = [] } = useDayAppointments(selectedDate)

  // const isMobile = useMediaQuery("(max-width: 768px)")
  // const isTablet = useMediaQuery("(max-width: 1099px)")
  const isDesktop = useMediaQuery("(min-width: 1100px)")

  const summaryCardRef = useRef(null)
  const calendarCardRef = useRef(null)
  const activitiesCardRef = useRef(null)
  const { data: user } = useGetUser()
  const { emit } = useWebSocket()

  const handleClaraToggle = (enabled: boolean) => {
    console.log('CLARA está:', enabled ? 'activada' : 'desactivada')

    const userId = user?.id || localStorage.getItem("userId")

    if (enabled) {
      emit("enableAllAssistants", userId)

    } else {
      emit("disableAllAssistants", userId)
    }

  }

  const isEnabled = useMemo(() => user?.assistantConfig.enabled || false, [user])

  // Format appointments to match the UI component requirements
  const formattedAppointments: Appointment[] = useMemo(() => {
    return appointments;
  }, [appointments])

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-2 overflow-hidden">
      {/* Desktop Static ActivityDrawer - Left Side */}
      {isDesktop && (
        <ActivityDrawer
          isOpen={true}
          onClose={() => { }} // No se usa en modo estático
          appointments={formattedAppointments}
          selectedDate={selectedDate}
          position="left"
          isStatic={true}
          onCreateActivity={handleCreateActivity}
        />
      )}

      {/* Main Content */}
      <div className="pb-2">
        {/* Content Grid */}
        <div className="max-w-full mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className={`${isDesktop ? "grid grid-cols-12 gap-6 h-screen pl-96" : "space-y-6"}`}>
            {/* Main Content - Left Side */}
            <div className={`${isDesktop ? "col-span-9" : "w-full"} space-y-6`}>
              <main className="">
                <WelcomeCard
                  isEnabled={isEnabled}
                  onClaraToggle={handleClaraToggle} userName={user?.name} />
              </main>

              {/* Today's Summary Card */}
              <div
                ref={summaryCardRef}
                className="bg-clara-terracotta rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm relative transition-all duration-300 hover:shadow-xl"
                style={!isDesktop ? getCardTransform(0) : {}}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-4">
                    <div className="bg-white/20 p-3 rounded-2xl">
                      <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-clara-terracotta-foreground text-lg">CLARA ha agendado</h3>
                      <p className="text-clara-terracotta-foreground/90 text-sm font-medium">{todayAppointmentsCount} actividades para hoy</p>
                    </div>
                  </div>
                  {!isDesktop && (
                    <Button
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 text-clara-terracotta-foreground rounded-full px-6 py-2 backdrop-blur-sm border border-white/30 transition-all duration-200"
                      onClick={handleViewActivities}
                    >
                      Ver detalles
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar Card */}
              <div
                ref={calendarCardRef}
                className="bg-clara-sage rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm relative transition-all duration-300 hover:shadow-xl"
                style={!isDesktop ? getCardTransform(1) : {}}
              >
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  activities={formattedAppointments}
                />
                <div className="mt-6">
                  <Button
                    onClick={handleCreateActivity}
                    className="w-full bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-2xl h-14 flex items-center justify-center space-x-3 font-semibold text-base transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Crear Evento</span>
                  </Button>
                </div>
              </div>

              {/* Activities Preview Card - Mobile/Tablet Only */}
              {!isDesktop && formattedAppointments.length > 0 && (
                <div
                  ref={activitiesCardRef}
                  className="bg-clara-warm-gray rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm relative transition-all duration-300 hover:shadow-xl"
                  style={getCardTransform(2)}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-bold text-clara-warm-gray-foreground text-lg">
                        {selectedDate.toLocaleDateString("es-ES", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </h3>
                      <span className="text-sm text-clara-warm-gray-foreground/70 font-medium">{formattedAppointments.length} {formattedAppointments.length === 1 ? 'evento' : 'eventos'}</span>
                    </div>
                    <div className="bg-clara-sage p-3 rounded-2xl">
                      <div className="w-6 h-6 bg-white/30 rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {formattedAppointments.slice(0, 3).map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-4 bg-white/30 rounded-2xl backdrop-blur-sm transition-all duration-200 hover:bg-white/40">
                        <div className={`w-4 h-4 rounded-full ${activity.color} shadow-sm`}></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-clara-warm-gray-foreground truncate text-sm">{activity.title}</p>
                          <p className="text-sm text-clara-warm-gray-foreground/80 font-medium">
                            {minutesToTimeString(activity.timeRange.startAt)} - {minutesToTimeString(activity.timeRange.endAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {formattedAppointments.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-clara-warm-gray-foreground hover:bg-white/40 rounded-2xl font-semibold transition-all duration-200 py-3"
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
              <div className="col-span-3 space-y-6 mt-2">
                <div className="bg-clara-sage rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
                  <h3 className="font-bold text-clara-sage-foreground mb-6 text-lg">Acciones rápidas</h3>
                  <div className="space-y-4">
                    <Button
                      onClick={handleCreateActivity}
                      className="w-full bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-2xl h-14 font-semibold text-base transition-all duration-200 shadow-lg"
                    >
                      <Plus className="w-6 h-6 mr-3" />
                      Nuevo Evento
                    </Button>
                  </div>
                </div>

                {/* Selected Date Summary */}
                {formattedAppointments.length > 0 && (
                  <div className="bg-clara-beige rounded-3xl p-6 shadow-lg border border-white/20 backdrop-blur-sm">
                    <div className="text-center">
                      <div className="bg-white/20 p-3 rounded-2xl mb-4 mx-auto w-fit">
                        <div className="w-6 h-6 bg-white/30 rounded-full mx-auto"></div>
                      </div>
                      <h3 className="font-bold text-clara-beige-foreground text-base mb-2">
                        {selectedDate.toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "short",
                        })}
                      </h3>
                      <p className="text-sm text-clara-beige-foreground/90 font-medium">{formattedAppointments.length} {formattedAppointments.length === 1 ? 'evento' : 'eventos'}</p>
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
          appointments={formattedAppointments}
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