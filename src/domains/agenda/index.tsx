import { Plus } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { useMediaQuery } from "../../hooks/use-media-query";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useGetUser } from "../account/hooks/useGetUser";
import { ActivityDrawer } from "./components/activity-drawer";
import { CalendarView } from "./components/calendar-view";
import { CreateActivityDialog } from "./components/create-activity-dialog";
import WelcomeCard from "./components/welcome-card";
import { useDayAppointments } from "./hooks/use-appointments";
import { minutesToTimeString, type Appointment } from "./types";

// Ancho reducido para el drawer y margen correspondiente
const DESKTOP_DRAWER_WIDTH_CLASS = "lg:w-72 xl:w-80";
const DESKTOP_MAIN_CONTENT_MARGIN_CLASS = "lg:ml-72 xl:ml-80";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [_scrollY, setScrollY] = useState(0);
  const [isStacked, setIsStacked] = useState(false);

  const { data: appointmentsResponse = [] } = useDayAppointments(selectedDate);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const summaryCardRef = useRef<HTMLDivElement>(null);
  const calendarCardRef = useRef<HTMLDivElement>(null);
  const activitiesCardRef = useRef<HTMLDivElement>(null);
  const { data: user } = useGetUser();
  const { emit } = useWebSocket();

  const handleClaraToggle = (enabled: boolean) => {
    const userId = user?.id || localStorage.getItem("userId");
    if (userId) {
      emit(enabled ? "enableAllAssistants" : "disableAllAssistants", userId);
    }
  };

  const isEnabled = useMemo(() => user?.assistantConfig.enabled || false, [user]);
  const formattedAppointments: Appointment[] = useMemo(() => appointmentsResponse as Appointment[], [appointmentsResponse]);
  const today = new Date().toISOString().split("T")[0];
  const todayAppointmentsCount = useMemo(() =>
    formattedAppointments.filter(appointment => appointment.date === today).length,
    [formattedAppointments, today]
  );

  useEffect(() => {
    if (isDesktop) {
      setIsStacked(false);
      return;
    }
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      const stackThreshold = 80; // Ligeramente reducido
      if (currentScrollY > stackThreshold && !isStacked) setIsStacked(true);
      else if (currentScrollY <= stackThreshold && isStacked) setIsStacked(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDesktop, isStacked]);

  const getCardTransform = (cardIndex: number) => {
    if (isDesktop || !isStacked) return {};
    const baseOffset = 12; // Reducido
    const scaleReduction = 0.025; // Reducido
    const opacityReduction = 0.08; // Reducido
    return {
      transform: `translateY(-${cardIndex * baseOffset}px) scale(${1 - cardIndex * scaleReduction})`,
      opacity: 1 - cardIndex * opacityReduction,
      zIndex: 3 - cardIndex,
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out",
    };
  };

  const handleViewActivities = () => {
    if (!isDesktop) setIsDrawerOpen(true);
  };
  const handleDateSelect = (date: Date) => setSelectedDate(date);
  const handleCreateActivity = () => setIsCreateDialogOpen(true);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      {isDesktop && (
        <aside
          className={`fixed top-0 left-0 h-screen ${DESKTOP_DRAWER_WIDTH_CLASS} z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-md`}
        >
          <ActivityDrawer
            isOpen={true}
            onClose={() => {}}
            appointments={formattedAppointments}
            selectedDate={selectedDate}
            position="left"
            isStatic={true}
            onCreateActivity={handleCreateActivity}
          />
        </aside>
      )}

      <main
        className={`flex-1 ${isDesktop ? DESKTOP_MAIN_CONTENT_MARGIN_CLASS : ''} overflow-y-auto`}
      >
        {/* Reducido padding general y entre elementos */}
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6">
          <div className={isDesktop ? "" : "mb-4"}>
            <WelcomeCard
              isEnabled={isEnabled}
              onClaraToggle={handleClaraToggle}
              userName={user?.name}
            />
          </div>

          <div
            className={`${
              isDesktop ? "grid grid-cols-12 gap-4" : "space-y-4" // Reducido gap y space-y
            }`}
          >
            <div
              className={`${
                isDesktop ? "col-span-12 lg:col-span-8 xl:col-span-9" : "w-full"
              } space-y-4`} // Reducido space-y
            >
              {/* Summary Card - Ajustes de tamaño */}
              <div
                ref={summaryCardRef}
                className="bg-clara-terracotta rounded-2xl p-3 sm:p-4 shadow-md border border-white/20 backdrop-blur-sm relative hover:shadow-lg" // Reducido padding y rounded
                style={!isDesktop ? getCardTransform(0) : {}}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 sm:space-x-3"> {/* Reducido space-x */}
                    <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl"> {/* Reducido padding y rounded */}
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-full"></div> {/* Reducido icono */}
                    </div>
                    <div>
                      <h3 className="font-semibold text-clara-terracotta-foreground text-sm sm:text-base"> {/* Reducido tamaño fuente */}
                        CLARA ha agendado
                      </h3>
                      <p className="text-clara-terracotta-foreground/90 text-xs font-medium"> {/* Reducido tamaño fuente */}
                        {todayAppointmentsCount} actividades para hoy
                      </p>
                    </div>
                  </div>
                  {!isDesktop && (
                    <Button
                      size="sm" // Asumiendo que Button tiene 'size' prop, o ajustar padding/texto aquí
                      className="bg-white/20 hover:bg-white/30 text-clara-terracotta-foreground rounded-full px-3 sm:px-4 py-1 sm:py-1.5 backdrop-blur-sm border border-white/30 text-xs" // Reducido padding y texto
                      onClick={handleViewActivities}
                    >
                      Ver detalles
                    </Button>
                  )}
                </div>
              </div>

              {/* Calendar Card - Ajustes de tamaño */}
              <div
                ref={calendarCardRef}
                className="bg-clara-sage rounded-2xl p-3 sm:p-4 shadow-md border border-white/20 backdrop-blur-sm relative hover:shadow-lg" // Reducido padding y rounded
                style={!isDesktop ? getCardTransform(1) : {}}
              >
                <CalendarView
                  selectedDate={selectedDate}
                  onSelectDate={handleDateSelect}
                  activities={formattedAppointments} // Nota: CalendarView también necesita ajustes
                />
                <div className="mt-3 sm:mt-4"> {/* Reducido mt */}
                  <Button
                    onClick={handleCreateActivity}
                    className="w-full bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-xl h-10 sm:h-12 flex items-center justify-center space-x-2 font-medium text-xs sm:text-sm shadow-md" // Reducido h, rounded, font-size, space-x
                  >
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" /> {/* Reducido icono */}
                    <span>Crear Evento</span>
                  </Button>
                </div>
              </div>

              {/* Activities Preview Card - Ajustes de tamaño */}
              {!isDesktop && formattedAppointments.length > 0 && (
                <div
                  ref={activitiesCardRef}
                  className="bg-clara-warm-gray rounded-2xl p-3 sm:p-4 shadow-md border border-white/20 backdrop-blur-sm relative hover:shadow-lg" // Reducido padding y rounded
                  style={getCardTransform(2)}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4"> {/* Reducido mb */}
                    <div>
                      <h3 className="font-semibold text-clara-warm-gray-foreground text-sm sm:text-base"> {/* Reducido texto */}
                        {selectedDate.toLocaleDateString("es-ES", {
                          weekday: "long", day: "numeric", month: "long",
                        })}
                      </h3>
                      <span className="text-xs text-clara-warm-gray-foreground/70 font-medium"> {/* Reducido texto */}
                        {formattedAppointments.length}{" "}
                        {formattedAppointments.length === 1 ? "evento" : "eventos"}
                      </span>
                    </div>
                    <div className="bg-clara-sage p-1.5 sm:p-2 rounded-lg sm:rounded-xl"> {/* Reducido padding y rounded */}
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white/30 rounded-full"></div> {/* Reducido icono */}
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3"> {/* Reducido space-y */}
                    {formattedAppointments.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white/30 rounded-xl backdrop-blur-sm hover:bg-white/40" // Reducido padding, space-x, rounded
                      >
                        <div
                          className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${activity.color || 'bg-gray-400'} shadow-sm flex-shrink-0`} // Reducido punto
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-clara-warm-gray-foreground truncate text-xs"> {/* Reducido texto */}
                            {activity.title}
                          </p>
                          <p className="text-xs text-clara-warm-gray-foreground/80 font-medium"> {/* Reducido texto */}
                            {minutesToTimeString(activity.timeRange.startAt)} -{" "}
                            {minutesToTimeString(activity.timeRange.endAt)}
                          </p>
                        </div>
                      </div>
                    ))}

                    {formattedAppointments.length > 3 && (
                      <Button
                        variant="ghost"
                        className="w-full text-clara-warm-gray-foreground hover:bg-white/40 rounded-xl font-medium py-2 sm:py-2.5 text-xs" // Reducido padding, rounded, texto
                        onClick={handleViewActivities}
                      >
                        Ver {formattedAppointments.length - 3} eventos más
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Acciones Rápidas (Desktop) - Ajustes de tamaño */}
            {isDesktop && (
              <div className="col-span-12 lg:col-span-4 xl:col-span-3 space-y-4"> {/* Reducido space-y */}
                <div className="bg-clara-sage rounded-2xl p-4 shadow-md border border-white/20 backdrop-blur-sm"> {/* Reducido padding y rounded */}
                  <h3 className="font-semibold text-clara-sage-foreground mb-4 text-base"> {/* Reducido texto y mb */}
                    Acciones rápidas
                  </h3>
                  <div className="space-y-3"> {/* Reducido space-y */}
                    <Button
                      onClick={handleCreateActivity}
                      className="w-full bg-clara-forest hover:bg-clara-forest/90 text-clara-forest-foreground rounded-xl h-12 font-medium text-sm shadow-md" // Reducido h, rounded, texto
                    >
                      <Plus className="w-5 h-5 mr-2" /> {/* Reducido icono y mr */}
                      Nuevo Evento
                    </Button>
                  </div>
                </div>

                {formattedAppointments.length > 0 && (
                  <div className="bg-clara-beige rounded-2xl p-4 shadow-md border border-white/20 backdrop-blur-sm"> {/* Reducido padding y rounded */}
                    <div className="text-center">
                      <div className="bg-white/20 p-2 rounded-xl mb-3 mx-auto w-fit"> {/* Reducido padding, rounded, mb */}
                        <div className="w-5 h-5 bg-white/30 rounded-full mx-auto"></div> {/* Reducido icono */}
                      </div>
                      <h3 className="font-semibold text-clara-beige-foreground text-sm mb-1"> {/* Reducido texto y mb */}
                        {selectedDate.toLocaleDateString("es-ES", {
                          weekday: "short", day: "numeric", month: "short",
                        })}
                      </h3>
                      <p className="text-xs text-clara-beige-foreground/90 font-medium"> {/* Reducido texto */}
                        {formattedAppointments.length}{" "}
                        {formattedAppointments.length === 1 ? "evento" : "eventos"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

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

      <CreateActivityDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        selectedDate={selectedDate}
      />
    </div>
  );
}