import { useState, useEffect } from "react"; // useEffect para sincronizar isEnabled

interface WelcomeCardProps {
  userName?: string;
  greeting?: string;
  showLogo?: boolean;
  isEnabled?: boolean;
  onClaraToggle?: (enabled: boolean) => void;
}

export default function WelcomeCard({
  userName = "Isabella Martinez",
  greeting = "Clara",
  showLogo = true,
  onClaraToggle,
  isEnabled = true,
}: WelcomeCardProps) {
  const [claraEnabled, setClaraEnabled] = useState(isEnabled);

  // Sincronizar el estado local si la prop isEnabled cambia desde fuera
  useEffect(() => {
    setClaraEnabled(isEnabled);
  }, [isEnabled]);

  const handleSwitchChange = () => {
    const newState = !claraEnabled;
    setClaraEnabled(newState);
    onClaraToggle?.(newState);
  };

  return (
    // Reducido padding
    <div className="bg-transparent p-3 sm:p-4 pt-4 sm:pt-6 pb-2 sm:pb-3 w-full mx-auto"> 
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {/* Reducido tamaño de fuente y margen */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 leading-tight mb-2 sm:mb-3 tracking-tight">{greeting}</h1>
          <div className="flex items-center gap-2 sm:gap-2.5"> {/* Reducido gap */}
            <div className="relative">
              {/* Reducido tamaño del punto */}
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-clara-sage rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-clara-sage rounded-full animate-ping opacity-20"></div>
            </div>
            {/* Reducido tamaño de fuente */}
            <span className="text-gray-700 font-medium text-sm sm:text-base">{userName}</span>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-2 sm:space-y-3"> {/* Reducido space-y */}
          {showLogo && (
            <>
              <div className="text-right">
                {/* Reducido tamaño de fuente */}
                <span className="text-xs font-semibold text-gray-500 tracking-wide uppercase">Asistente virtual</span>
              </div>
              
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
                    relative inline-flex items-center justify-center w-12 h-6 sm:w-14 sm:h-7 rounded-full cursor-pointer transition-all duration-300 ease-in-out border-2
                    ${claraEnabled 
                      ? 'bg-clara-sage shadow-md border-clara-sage shadow-clara-sage/15' // Sombra más sutil
                      : 'bg-gray-200 shadow-xs border-gray-300' // Sombra más sutil
                    }
                    hover:scale-105 hover:shadow-lg
                  `} // Reducido w y h del switch
                >
                  <span
                    className={`
                      absolute w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out
                      ${claraEnabled 
                        ? 'translate-x-3 sm:translate-x-3.5' // Ajustado translate
                        : '-translate-x-3 sm:-translate-x-3.5' // Ajustado translate
                      }
                      flex items-center justify-center
                    `} // Reducido w y h del círculo
                  >
                    {claraEnabled && ( // Reducido punto interno
                      <div className="w-1.5 h-1.5 bg-clara-sage rounded-full"></div>
                    )}
                  </span>
                </label>
              </div>
              
              <div className="text-right">
                {/* Mantener text-xs, pero font-medium a font-normal si se necesita más compacto */}
                <span className={`text-xs font-normal ${
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
  );
}