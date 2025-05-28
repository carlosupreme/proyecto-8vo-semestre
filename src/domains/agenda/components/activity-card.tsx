"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

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

interface ActivityCardProps {
  activity: Activity
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

  // Nueva paleta de colores pasteles
  const getBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-[#d4e2d4]", // Verde pastel basado en #899387
      "bg-green-500": "bg-[#899387]", // Color principal verde
      "bg-purple-500": "bg-[#e6d5d0]", // Rosa pastel basado en #ae8276
      "bg-red-500": "bg-[#ae8276]", // Color principal terracota
      "bg-yellow-500": "bg-[#f5f1e8]", // Amarillo pastel muy suave
      "bg-indigo-500": "bg-[#e8e8e8]", // Gris claro
      "bg-pink-500": "bg-[#f0e6e6]", // Rosa pastel suave
      "bg-teal-500": "bg-[#a5a5a0]", // Gris verdoso
      "bg-orange-500": "bg-[#f2e8d5]", // Amarillo cálido pastel
      "bg-cyan-500": "bg-[#d9d9d9]", // Gris medio
      "bg-lime-500": "bg-[#e8f0e8]", // Verde muy claro
      "bg-emerald-500": "bg-[#9ca598]", // Verde grisáceo
      "bg-violet-500": "bg-[#ede8e8]", // Rosa grisáceo muy suave
      "bg-fuchsia-500": "bg-[#e8d8d8]", // Rosa pastel
      "bg-rose-500": "bg-[#f0d8d8]", // Rosa suave
      "bg-sky-500": "bg-[#f8f8f8]", // Casi blanco
    }
    return colorMap[color] || "bg-[#f0f0f0]"
  }

  // Colores más saturados para el estado activo
  const getActiveBackgroundColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      "bg-blue-500": "bg-[#c2d4c2]", // Verde más intenso
      "bg-green-500": "bg-[#7a8577]", // Verde principal más oscuro
      "bg-purple-500": "bg-[#d4c0ba]", // Rosa más intenso
      "bg-red-500": "bg-[#9e7468]", // Terracota más oscuro
      "bg-yellow-500": "bg-[#ebe4d5]", // Amarillo más cálido
      "bg-indigo-500": "bg-[#d8d8d8]", // Gris más intenso
      "bg-pink-500": "bg-[#e5d5d5]", // Rosa más visible
      "bg-teal-500": "bg-[#959590]", // Gris verdoso más oscuro
      "bg-orange-500": "bg-[#e8d8c2]", // Amarillo más cálido
      "bg-cyan-500": "bg-[#c8c8c8]", // Gris más oscuro
      "bg-lime-500": "bg-[#d8e5d8]", // Verde más visible
      "bg-emerald-500": "bg-[#8a9585]", // Verde más intenso
      "bg-violet-500": "bg-[#ddd5d5]", // Rosa más definido
      "bg-fuchsia-500": "bg-[#d8c5c5]", // Rosa más intenso
      "bg-rose-500": "bg-[#e5c5c5]", // Rosa más cálido
      "bg-sky-500": "bg-[#e8e8e8]", // Gris muy claro
    }
    return colorMap[color] || "bg-[#e0e0e0]"
  }

  // Función para determinar si el texto debe ser claro u oscuro
  const getTextColor = (backgroundColor: string, isActive: boolean = false) => {
    // Colores más oscuros que necesitan texto claro
    const darkBackgrounds = [
      "bg-[#899387]", "bg-[#ae8276]", "bg-[#7a8577]", "bg-[#9e7468]", 
      "bg-[#a5a5a0]", "bg-[#9ca598]", "bg-[#959590]", "bg-[#8a9585]"
    ]
    
    const currentBg = isActive ? getActiveBackgroundColor(backgroundColor) : getBackgroundColor(backgroundColor)
    
    if (darkBackgrounds.some(dark => currentBg.includes(dark.slice(4, -1)))) {
      return "text-white"
    }
    return "text-gray-800"
  }

  // Generar colores para tags adaptados al fondo
  const getTagColor = (tag: string, cardBgColor: string, isCardActive: boolean = false) => {
    const isLightText = getTextColor(cardBgColor, isCardActive) === "text-white"
    
    const lightCardColors = {
      Work: "bg-white/20 text-white border border-white/30",
      Deadline: "bg-white/20 text-white border border-white/30",
      Education: "bg-white/20 text-white border border-white/30",
      Design: "bg-white/20 text-white border border-white/30",
      Sports: "bg-white/20 text-white border border-white/30",
      Health: "bg-white/20 text-white border border-white/30",
      Social: "bg-white/20 text-white border border-white/30",
      Food: "bg-white/20 text-white border border-white/30",
      Meeting: "bg-white/20 text-white border border-white/30",
      Personal: "bg-white/20 text-white border border-white/30",
    }

    const darkCardColors = {
      Work: "bg-gray-800/10 text-gray-700 border border-gray-300/50",
      Deadline: "bg-red-100/80 text-red-700 border border-red-200",
      Education: "bg-blue-100/80 text-blue-700 border border-blue-200",
      Design: "bg-purple-100/80 text-purple-700 border border-purple-200",
      Sports: "bg-green-100/80 text-green-700 border border-green-200",
      Health: "bg-emerald-100/80 text-emerald-700 border border-emerald-200",
      Social: "bg-violet-100/80 text-violet-700 border border-violet-200",
      Food: "bg-amber-100/80 text-amber-700 border border-amber-200",
      Meeting: "bg-sky-100/80 text-sky-700 border border-sky-200",
      Personal: "bg-rose-100/80 text-rose-700 border border-rose-200",
    }

    const colors = isLightText ? lightCardColors : darkCardColors
    return colors[tag as keyof typeof colors] || (isLightText ? "bg-white/20 text-white border border-white/30" : "bg-gray-100/80 text-gray-700 border border-gray-300/50")
  }

  if (isTimelineView) {
    const cardBgColor = activity.color
    const textColor = getTextColor(cardBgColor, isActive)
    const mutedTextColor = textColor === "text-white" ? "text-white/80" : "text-gray-600"

    return (
      <div
        className={cn(
          "h-full cursor-pointer overflow-hidden rounded-2xl transition-all duration-200 hover:shadow-md",
          isActive ? getActiveBackgroundColor(activity.color) : getBackgroundColor(activity.color),
          isActive ? "shadow-lg scale-105" : "shadow-sm",
          "border border-gray-200/30",
          isActive && "h-auto",
        )}
        onClick={toggleExpanded}
      >
        <div className={cn("flex flex-col p-3", isActive ? "h-auto" : "h-full")}>
          <div className={cn("min-h-0", isActive ? "" : "flex-1")}>
            <h4 className={cn("mb-1 truncate text-sm font-semibold leading-tight", textColor)}>{activity.name}</h4>
            {!isActive && (
              <div className={cn("flex items-center text-xs", mutedTextColor)}>
                <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {activity.startTime} - {activity.endTime}
                </span>
              </div>
            )}
          </div>

          {isActive && (
            <div className="mt-2 space-y-2 border-t border-white/20 pt-2">
              <div className={cn("flex items-center text-xs", mutedTextColor)}>
                <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                <span>
                  {activity.startTime} - {activity.endTime}
                </span>
              </div>

              <p className={cn("text-xs leading-relaxed", textColor === "text-white" ? "text-white/90" : "text-gray-700")}>{activity.description}</p>

              <div className="text-xs">
                <span className={cn("font-medium", mutedTextColor)}>Genre:</span>
                <span className={cn("ml-1", textColor)}>{activity.genre}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                      getTagColor(tag, cardBgColor, isActive),
                    )}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-1 flex justify-center">
            <button className={cn("transition-colors", textColor === "text-white" ? "text-white/60 hover:text-white/80" : "text-gray-400 hover:text-gray-600")}>
              {isActive ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vista de tarjeta original (no timeline)
  const cardBgColor = activity.color
  const textColor = getTextColor(cardBgColor, false)
  const mutedTextColor = textColor === "text-white" ? "text-white/80" : "text-gray-500"

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-gray-200/30 transition-all duration-300",
        getBackgroundColor(activity.color),
        expanded ? "shadow-md" : "shadow-sm",
      )}
    >
      <div className="flex cursor-pointer items-center justify-between p-4" onClick={toggleExpanded}>
        <div className="flex items-center gap-3">
          <div className={cn("h-4 w-4 rounded-full border-2", 
            textColor === "text-white" ? "border-white/40 bg-white/20" : "border-gray-400/40 bg-gray-400/20"
          )} />
          <div>
            <h4 className={cn("font-medium", textColor)}>{activity.name}</h4>
            <div className={cn("flex items-center text-sm", mutedTextColor)}>
              <Clock className="mr-1 h-3 w-3" />
              <span>
                {activity.startTime} - {activity.endTime}
              </span>
            </div>
          </div>
        </div>

        <button className={cn("transition-colors", textColor === "text-white" ? "text-white/70 hover:text-white/90" : "text-gray-500 hover:text-gray-700")}>
          {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>

      {expanded && (
        <div className="rounded-b-2xl border-t border-white/20 bg-black/5 p-4">
          <div className="mb-3">
            <p className={cn("text-sm", textColor === "text-white" ? "text-white/90" : "text-gray-700")}>{activity.description}</p>
          </div>

          <div className="mb-2">
            <span className={cn("text-xs font-medium", mutedTextColor)}>Genre:</span>
            <span className={cn("ml-2 text-sm", textColor)}>{activity.genre}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {activity.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
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