import { useState } from "react"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { minutesToTimeString, type Appointment } from "../types"
import type { Client } from "../../clients/types"

interface ActivityCardProps {
  activity: Appointment & { client: Client | undefined }
  isTimelineView?: boolean
  isActive?: boolean
  onClick?: () => void
}

export function ActivityCard({ activity, isTimelineView = false, isActive = false, onClick }: ActivityCardProps) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = () => {
    if (isTimelineView && onClick) {
      onClick()
    } else {
      setExpanded(!expanded)
    }
  }

  // Nueva paleta de colores pasteles usando Clara theme
  const getBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-clara-sage-200", // Verde pastel claro
      "bg-green-500": "bg-clara-sage", // Color principal verde
      "bg-purple-500": "bg-clara-terracotta-200", // Rosa pastel basado en terracotta
      "bg-red-500": "bg-clara-terracotta", // Color principal terracotta
      "bg-yellow-500": "bg-clara-beige/70", // Beige suave
      "bg-indigo-500": "bg-clara-warm-gray", // Gris claro
      "bg-pink-500": "bg-clara-terracotta-100", // Rosa pastel suave
      "bg-teal-500": "bg-clara-sage-300", // Verde grisáceo
      "bg-orange-500": "bg-clara-beige", // Beige cálido
      "bg-cyan-500": "bg-clara-warm-gray/80", // Gris medio
      "bg-lime-500": "bg-clara-sage-100", // Verde muy claro
      "bg-emerald-500": "bg-clara-sage-400", // Verde grisáceo
      "bg-violet-500": "bg-clara-terracotta-100", // Rosa grisáceo muy suave
      "bg-fuchsia-500": "bg-clara-terracotta-200", // Rosa pastel
      "bg-rose-500": "bg-clara-terracotta-300", // Rosa suave
      "bg-sky-500": "bg-clara-warm-gray/60", // Casi blanco
    }
    return colorMap[color] || "bg-clara-warm-gray/40"
  }

  // Colores más saturados para el estado activo
  const getActiveBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-clara-sage-300", // Verde más intenso
      "bg-green-500": "bg-clara-sage-600", // Verde principal más oscuro
      "bg-purple-500": "bg-clara-terracotta-300", // Terracotta más intenso
      "bg-red-500": "bg-clara-terracotta-600", // Terracotta más oscuro
      "bg-yellow-500": "bg-clara-beige/90", // Beige más cálido
      "bg-indigo-500": "bg-clara-warm-gray", // Gris más intenso
      "bg-pink-500": "bg-clara-terracotta-200", // Rosa más visible
      "bg-teal-500": "bg-clara-sage-400", // Verde más oscuro
      "bg-orange-500": "bg-clara-beige", // Beige más cálido
      "bg-cyan-500": "bg-clara-warm-gray", // Gris más oscuro
      "bg-lime-500": "bg-clara-sage-200", // Verde más visible
      "bg-emerald-500": "bg-clara-sage-500", // Verde más intenso
      "bg-violet-500": "bg-clara-terracotta-200", // Rosa más definido
      "bg-fuchsia-500": "bg-clara-terracotta-300", // Rosa más intenso
      "bg-rose-500": "bg-clara-terracotta-400", // Rosa más cálido
      "bg-sky-500": "bg-clara-warm-gray/90", // Gris muy claro
    }
    return colorMap[color] || "bg-clara-warm-gray"
  }

  // Función para determinar si el texto debe ser claro u oscuro basado en Clara theme
  const getTextColor = (backgroundColor: string, isActive: boolean = false) => {
    // Colores Clara que necesitan texto claro (foreground ya definido como blanco)
    const darkBackgrounds = [
      "bg-clara-sage", "bg-clara-terracotta", "bg-clara-forest", "bg-clara-beige",
      "bg-clara-sage-600", "bg-clara-sage-500", "bg-clara-sage-400",
      "bg-clara-terracotta-600", "bg-clara-terracotta-500", "bg-clara-terracotta-400"
    ]

    const currentBg = isActive ? getActiveBackgroundColor(backgroundColor) : getBackgroundColor(backgroundColor)

    if (darkBackgrounds.some(dark => currentBg.includes(dark.replace("bg-", "")))) {
      return "text-clara-sage-foreground" // Blanco
    }
    return "text-clara-warm-gray-foreground" // Texto oscuro
  }

  // Generar colores para tags adaptados al fondo Clara theme
  const getTagColor = (tag: string, cardBgColor: string, isCardActive: boolean = false) => {
    const isLightText = getTextColor(cardBgColor, isCardActive) === "text-clara-sage-foreground"

    const lightCardColors = {
      Work: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Deadline: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Education: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Design: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Sports: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Health: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Social: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Food: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Meeting: "bg-white/20 text-clara-sage-foreground border border-white/30",
      Personal: "bg-white/20 text-clara-sage-foreground border border-white/30",
    }

    const darkCardColors = {
      Work: "bg-clara-warm-gray-foreground/10 text-clara-warm-gray-foreground border border-clara-warm-gray-foreground/20",
      Deadline: "bg-clara-terracotta-100 text-clara-terracotta-700 border border-clara-terracotta-200",
      Education: "bg-clara-sage-100 text-clara-sage-700 border border-clara-sage-200",
      Design: "bg-clara-beige/50 text-clara-warm-gray-foreground border border-clara-beige",
      Sports: "bg-clara-sage-200 text-clara-sage-800 border border-clara-sage-300",
      Health: "bg-clara-sage-100 text-clara-sage-700 border border-clara-sage-200",
      Social: "bg-clara-terracotta-100 text-clara-terracotta-700 border border-clara-terracotta-200",
      Food: "bg-clara-beige text-clara-warm-gray-foreground border border-clara-beige",
      Meeting: "bg-clara-warm-gray text-clara-warm-gray-foreground border border-clara-warm-gray",
      Personal: "bg-clara-terracotta-200 text-clara-terracotta-800 border border-clara-terracotta-300",
    }

    const colors = isLightText ? lightCardColors : darkCardColors
    return colors[tag as keyof typeof colors] || (isLightText ? "bg-white/20 text-clara-sage-foreground border border-white/30" : "bg-clara-warm-gray/40 text-clara-warm-gray-foreground border border-clara-warm-gray/60")
  }

  if (isTimelineView) {
    const cardBgColor = activity.color
    const textColor = getTextColor(cardBgColor, isActive)
    const mutedTextColor = textColor === "text-clara-sage-foreground" ? "text-clara-sage-foreground/80" : "text-clara-warm-gray-foreground/60"

    return (
      <div
        className={cn(
          "h-full cursor-pointer overflow-hidden rounded-3xl transition-all duration-300 hover:shadow-lg group",
          isActive ? getActiveBackgroundColor(activity.color) : getBackgroundColor(activity.color),
          isActive ? "shadow-xl scale-105 z-50" : "shadow-lg hover:scale-102",
          "border border-white/40 backdrop-blur-sm",
          isActive && "h-auto ring-2 ring-white/20",
        )}
        onClick={toggleExpanded}
      >
        <div className={cn("flex flex-col p-4", isActive ? "h-auto" : "h-full")}>
          <div className={cn("min-h-0", isActive ? "" : "flex-1")}>
            <h4 className={cn("mb-2 text-sm font-bold leading-tight", textColor, !isActive && "truncate")}>{activity.title}</h4>
            {!isActive && (
              <div className={cn("flex items-center text-xs font-medium", mutedTextColor)}>
                <Clock className="mr-2 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {minutesToTimeString(activity.timeRange.startAt)} - {minutesToTimeString(activity.timeRange.endAt)}
                </span>
              </div>
            )}
          </div>

          {isActive && (
            <div className="mt-4 space-y-3 border-t border-white/30 pt-4">
              <div className={cn("flex items-center text-sm font-semibold", mutedTextColor)}>
                <Clock className="mr-2 h-4 w-4 flex-shrink-0" />
                <span>
                  {minutesToTimeString(activity.timeRange.startAt)} - {minutesToTimeString(activity.timeRange.endAt)}
                </span>
              </div>

              <p className={cn("text-sm leading-relaxed font-medium", textColor === "text-clara-sage-foreground" ? "text-clara-sage-foreground/95" : "text-clara-warm-gray-foreground")}>
                {activity.title}
              </p>

              {activity.client && (
                <div className="text-sm">
                  <span className={cn("font-bold", mutedTextColor)}>Cliente: </span>
                  <span className={cn("font-semibold", textColor)}>{activity.client?.name}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center rounded-full px-3 py-1 text-xs font-bold transition-all duration-200",
                      getTagColor(tag, cardBgColor, isActive),
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex justify-center">
            <button className={cn(
              "p-2 rounded-full transition-all duration-200 hover:scale-110",
              textColor === "text-clara-sage-foreground"
                ? "text-clara-sage-foreground/70 hover:text-clara-sage-foreground/90 hover:bg-white/10"
                : "text-clara-warm-gray-foreground/70 hover:text-clara-warm-gray-foreground hover:bg-clara-warm-gray/20"
            )}>
              {isActive ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vista de tarjeta original (no timeline)
  const cardBgColor = activity.color
  const textColor = getTextColor(cardBgColor, false)
  const mutedTextColor = textColor === "text-clara-sage-foreground" ? "text-clara-sage-foreground/80" : "text-clara-warm-gray-foreground/60"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border border-white/40 transition-all duration-300 backdrop-blur-sm group",
        getBackgroundColor(activity.color),
        expanded ? "shadow-xl scale-102" : "shadow-lg hover:shadow-xl hover:scale-101",
      )}
    >
      <div className="flex cursor-pointer items-center justify-between p-5" onClick={toggleExpanded}>
        <div className="flex items-center gap-4">
          <div className={cn("h-5 w-5 rounded-full border-2 shadow-sm",
            textColor === "text-clara-sage-foreground" ? "border-clara-sage-foreground/50 bg-clara-sage-foreground/30" : "border-clara-warm-gray-foreground/50 bg-clara-warm-gray-foreground/30"
          )} />
          <div>
            <h4 className={cn("font-bold text-base", textColor)}>{activity.title}</h4>
            <div className={cn("flex items-center text-sm font-medium mt-1", mutedTextColor)}>
              <Clock className="mr-2 h-4 w-4" />
              <span>
                {minutesToTimeString(activity.timeRange.startAt)} - {minutesToTimeString(activity.timeRange.endAt)}
              </span>
            </div>
          </div>
        </div>

        <button className={cn(
          "p-2 rounded-full transition-all duration-200 hover:scale-110",
          textColor === "text-clara-sage-foreground"
            ? "text-clara-sage-foreground/70 hover:text-clara-sage-foreground/90 hover:bg-white/10"
            : "text-clara-warm-gray-foreground/70 hover:text-clara-warm-gray-foreground hover:bg-clara-warm-gray/20"
        )}>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {expanded && (
        <div className="rounded-b-3xl border-t border-white/30 bg-white/10 p-5 backdrop-blur-sm">
          <div className="mb-4">
            <p className={cn("text-sm font-medium leading-relaxed", textColor === "text-clara-sage-foreground" ? "text-clara-sage-foreground/95" : "text-clara-warm-gray-foreground")}>{activity.title}</p>
          </div>

          {activity.client && (
            <div className="mb-4">
              <span className={cn("text-sm font-bold", mutedTextColor)}>Cliente: </span>
              <span className={cn("text-sm font-semibold", textColor)}>{activity.client?.name}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-bold transition-all duration-200",
                  getTagColor(tag, cardBgColor, false),
                )}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}