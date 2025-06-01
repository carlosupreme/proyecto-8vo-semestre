import { useState } from "react"

interface WelcomeCardProps {
  userName?: string
  greeting?: string
  showLogo?: boolean
  isEnabled?: boolean
  onClaraToggle?: (enabled: boolean) => void
}

export default function WelcomeCard({
  userName = "Isabella Martinez",
  greeting = "Clara",
  showLogo = true,
  onClaraToggle,
  isEnabled = true,
}: WelcomeCardProps) {
  const [claraEnabled, setClaraEnabled] = useState(isEnabled)

  const handleSwitchChange = () => {
    const newState = !claraEnabled
    setClaraEnabled(newState)
    onClaraToggle?.(newState)
  }

  return (
    <div className="bg-transparent p-6 pt-8 pb-4 w-full mx-auto">
      <div className="flex items-center justify-between">
        {/* Left side - Greeting and Name */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4 tracking-tight">{greeting}</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-3 h-3 bg-clara-sage rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-clara-sage rounded-full animate-ping opacity-20"></div>
            </div>
            <span className="text-gray-700 font-semibold text-lg">{userName}</span>
          </div>
        </div>

        {/* Right side - CLARA Switch */}
        <div className="flex flex-col items-end space-y-4">
          {showLogo && (
            <>
              {/* CLARA Label */}
              <div className="text-right">
                <span className="text-sm font-bold text-gray-500 tracking-wider uppercase">Asistente virtual</span>
              </div>
              
              {/* Enhanced Switch */}
              <div className="relative">
                <input
                  type="checkbox"
                  id="clara-switch"
                  checked={claraEnabled}
                  onChange={handleSwitchChange}
                  className="sr-only"
                />
                <label
                  htmlFor="clara-switch"
                  className={`
                    relative inline-flex items-center justify-center w-16 h-8 rounded-full cursor-pointer transition-all duration-300 ease-in-out border-2
                    ${claraEnabled 
                      ? 'bg-clara-sage shadow-lg border-clara-sage shadow-clara-sage/20' 
                      : 'bg-gray-200 shadow-sm border-gray-300'
                    }
                    hover:scale-105 hover:shadow-xl
                  `}
                >
                  <span
                    className={`
                      absolute w-6 h-6 bg-white rounded-full shadow-lg transform transition-all duration-300 ease-in-out
                      ${claraEnabled 
                        ? 'translate-x-4 shadow-md' 
                        : '-translate-x-4'
                      }
                      flex items-center justify-center
                    `}
                  >
                    {claraEnabled && (
                      <div className="w-2 h-2 bg-clara-sage rounded-full"></div>
                    )}
                  </span>
                </label>
              </div>
              
              {/* Status Text */}
              <div className="text-right">
                <span className={`text-xs font-medium ${
                  claraEnabled ? 'text-clara-sage' : 'text-gray-400'
                }`}>
                  {claraEnabled ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}