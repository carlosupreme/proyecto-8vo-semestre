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
    <div className="bg-transparent p-3 mt-3 w-100vw h-[100px] mx-auto border-b-1">
      <div className="flex items-start justify-between">
        {/* Left side - Greeting and Name */}
        <div className="flex-1 w-2/3">
          <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">{greeting}</h1>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>
        </div>

        {/* Right side - CLARA Switch */}
        <div className="flex flex-col items-end w-1/3 pr-7 h-full justify-between">
          {showLogo && (
            <>
              {/* CLARA Label at top */}
              <div className="pt-2">
                <span className="text-sm font-medium text-gray-400">cI.ara</span>
              </div>
              
              {/* Switch aligned with userName */}
              <div className="pb-2">
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
                      relative inline-flex items-center justify-center w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ease-in-out
                      ${claraEnabled 
                        ? 'bg-green-500 shadow-lg' 
                        : 'bg-gray-300 shadow-sm'
                      }
                    `}
                  >
                    <span
                      className={`
                        absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out
                        ${claraEnabled 
                          ? 'translate-x-3' 
                          : '-translate-x-3'
                        }
                      `}
                    />
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}