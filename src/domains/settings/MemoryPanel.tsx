import { gsap } from "gsap";
import {
    AlertTriangle,
    Brain,
    CheckCircle,
    ChevronDown,
    Clock,
    DollarSign,
    Edit3,
    MessageSquare,
    Settings,
    Sparkles,
    X
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

// =================== TYPES ===================
interface Memory {
  id: string;
  category: MemoryCategory;
  type: MemoryType;
  content: string;
  expiresAt?: Date;
  createdAt: Date;
  priority: MemoryPriority;
  status: MemoryStatus;
  metadata?: Record<string, any>;
}

type MemoryCategory = 'schedule' | 'pricing' | 'policy' | 'emergency' | 'general';
type MemoryType = 'permanent' | 'temporary';
type MemoryPriority = 'high' | 'medium' | 'low';
type MemoryStatus = 'active' | 'expired' | 'disabled';

interface MemoryCategoryConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
  lightGradient: string;
}

// =================== CONSTANTS ===================
const MEMORY_CATEGORIES: Record<MemoryCategory, MemoryCategoryConfig> = {
  schedule: { 
    name: "Horarios", 
    icon: Clock, 
    color: "text-blue-600",
    gradient: "from-blue-500 to-blue-600",
    lightGradient: "from-blue-100 to-blue-200"
  },
  pricing: { 
    name: "Precios", 
    icon: DollarSign, 
    color: "text-emerald-600",
    gradient: "from-emerald-500 to-emerald-600", 
    lightGradient: "from-emerald-100 to-emerald-200"
  },
  policy: { 
    name: "Políticas", 
    icon: Settings, 
    color: "text-purple-600",
    gradient: "from-purple-500 to-purple-600",
    lightGradient: "from-purple-100 to-purple-200" 
  },
  emergency: { 
    name: "Emergencias", 
    icon: AlertTriangle, 
    color: "text-red-600",
    gradient: "from-red-500 to-red-600",
    lightGradient: "from-red-100 to-red-200"
  },
  general: { 
    name: "General", 
    icon: MessageSquare, 
    color: "text-gray-600",
    gradient: "from-gray-500 to-gray-600",
    lightGradient: "from-gray-100 to-gray-200"
  }
};

// =================== UTILITY FUNCTIONS ===================
const formatTimeRemaining = (expiresAt?: Date): string | null => {
  if (!expiresAt) return null;
  
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return "Expirado";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d`;
  if (hours > 0) return `${hours}h`;
  return `${minutes}m`;
};

// =================== COMPONENTS ===================
interface WalletCardProps {
  memory: Memory;
  index: number;
  totalCards: number;
  isStackHovered: boolean;
  isExpanded: boolean;
  expandedCard: string | null;
  onExpand: (id: string | null) => void;
  onDelete: (id: string) => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  memory, 
  index, 
  totalCards, 
  isStackHovered,
  isExpanded,
  expandedCard,
  onExpand,
  onDelete 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const categoryConfig = MEMORY_CATEGORIES[memory.category];
  const IconComponent = categoryConfig.icon;
  const timeRemaining = formatTimeRemaining(memory.expiresAt);

  // Stack muy compacto (iOS Wallet style)
  const compactStackOffset = 8;
  const hoverSpread = 90;
  
  // Configuración por defecto (stack compacto - solo primera carta visible)
  const stackedConfig = {
    rotation: 0,
    yOffset: index * compactStackOffset, // Stack muy compacto
    xOffset: index * 2, // Mínimo offset horizontal para ver bordes
    scale: 1 - (index * 0.015), // Escala mínima para efecto de profundidad
    zIndex: totalCards - index,
    opacity: index === 0 ? 1 : 0.9 // Primera carta completamente visible
  };

  // Configuración en hover (todas visibles)
  const spreadConfig = {
    rotation: (index - (totalCards - 1) / 2) * 4, // Fan rotation más pronunciado
    yOffset: index * hoverSpread, // Separación vertical amplia
    xOffset: (index - (totalCards - 1) / 2) * 25, // Separación horizontal tipo abanico
    scale: 1,
    zIndex: totalCards - index,
    opacity: 1 // Todas completamente visibles
  };

  // Configuración expandida (carta seleccionada al frente)
  const expandedConfig = {
    rotation: 0,
    yOffset: -20, // Ligeramente arriba para darle protagonismo
    xOffset: 0,
    scale: 1.08,
    zIndex: totalCards + 20,
    opacity: 1
  };

  // Configuración para cartas en background cuando otra está expandida
  const backgroundConfig = {
    rotation: 0,
    yOffset: index * compactStackOffset + 60, // Más atrás
    xOffset: index * 2,
    scale: 0.85, // Más pequeñas
    zIndex: totalCards - index - 10,
    opacity: 0.3 // Muy transparentes
  };

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    
    // Animación de entrada desde abajo con physics de iOS
    gsap.fromTo(card, 
      { 
        opacity: 0, 
        y: 200,
        scale: 0.5,
        rotateZ: 15
      },
      { 
        opacity: stackedConfig.opacity,
        y: stackedConfig.yOffset,
        scale: stackedConfig.scale,
        x: stackedConfig.xOffset,
        rotateZ: stackedConfig.rotation,
        zIndex: stackedConfig.zIndex,
        duration: 0.8,
        delay: index * 0.12,
        ease: "elastic.out(1, 0.7)"
      }
    );
  }, []);

  useEffect(() => {
    if (!cardRef.current || !contentRef.current) return;

    const card = cardRef.current;
    const content = contentRef.current;
    let targetConfig;

    // Determinar configuración objetivo según estado
    if (isExpanded) {
      // Esta carta está expandida
      targetConfig = expandedConfig;
    } else if (expandedCard && expandedCard !== memory.id) {
      // Otra carta está expandida - enviar al background
      targetConfig = backgroundConfig;
    } else if (isStackHovered) {
      // Stack en hover - mostrar todas en abanico
      targetConfig = spreadConfig;
    } else {
      // Estado normal - stack compacto
      targetConfig = stackedConfig;
    }

    // Animación suave tipo iOS
    gsap.to(card, {
      x: targetConfig.xOffset,
      y: targetConfig.yOffset,
      rotateZ: targetConfig.rotation,
      scale: targetConfig.scale,
      zIndex: targetConfig.zIndex,
      opacity: targetConfig.opacity,
      duration: 0.6,
      ease: "power3.out"
    });

    // Efectos visuales del contenido
    const shouldBlur = expandedCard && expandedCard !== memory.id;
    const blurAmount = shouldBlur ? 4 : 0;
    const shadowIntensity = isExpanded ? 0.4 : (isStackHovered ? 0.25 : 0.12);
    const shadowSize = isExpanded ? 40 : (isStackHovered ? 25 : 12);
    
    gsap.to(content, {
      filter: `blur(${blurAmount}px)`,
      boxShadow: `0 ${shadowSize}px ${shadowSize * 1.8}px -8px rgba(0, 0, 0, ${shadowIntensity})`,
      duration: 0.4,
      ease: "power2.out"
    });
  }, [isStackHovered, isExpanded, expandedCard, memory.id, index, totalCards]);

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!cardRef.current) return;
    
    // Animación de click con haptic feedback tipo iOS
    const currentScale = isExpanded ? expandedConfig.scale : expandedConfig.scale;
    
    gsap.to(cardRef.current, {
      scale: currentScale * 1.04,
      duration: 0.12,
      ease: "power2.out",
      onComplete: () => {
        gsap.to(cardRef.current, {
          scale: currentScale,
          duration: 0.25,
          ease: "elastic.out(1, 0.6)"
        });
      }
    });
    
    // Cambiar estado después del feedback
    setTimeout(() => {
      onExpand(isExpanded ? null : memory.id);
    }, 100);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!cardRef.current) return;
    
    // Animación de eliminación tipo iOS
    gsap.to(cardRef.current, {
      scale: 0,
      rotateZ: 45,
      opacity: 0,
      y: stackedConfig.yOffset - 120,
      x: 80,
      duration: 0.5,
      ease: "power3.in",
      onComplete: () => onDelete(memory.id)
    });
  };

  return (
    <div
      ref={cardRef}
      className="absolute w-full max-w-sm cursor-pointer"
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px',
        transformOrigin: 'center center'
      }}
      onClick={handleCardClick}
    >
      <div
        ref={contentRef}
        className="relative overflow-hidden rounded-2xl border-0"
        style={{
          background: `linear-gradient(135deg, ${categoryConfig.lightGradient.replace('from-', '').replace('to-', ', ')})`,
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-white/10 rounded-2xl" />
        
        {/* Gradient accent */}
        <div 
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryConfig.gradient} rounded-t-2xl`}
        />
        
        <div className={`p-4 ${isExpanded ? 'pb-6' : ''}`}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${categoryConfig.gradient} flex items-center justify-center shadow-lg ring-2 ring-white/50`}>
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div 
                  className={`inline-block text-xs font-medium px-2 py-1 rounded-lg ${categoryConfig.color} border border-current/30 bg-white/70 backdrop-blur-sm`}
                >
                  {categoryConfig.name}
                </div>
                {memory.priority === 'high' && (
                  <div className="inline-block ml-2 text-xs bg-red-500 text-white border-0 shadow-sm px-2 py-1 rounded-lg">
                    Urgente
                  </div>
                )}
              </div>
            </div>
            
            {isExpanded && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-500 hover:bg-red-50/80 transition-colors rounded-lg flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          
          {/* Vista colapsada - contenido básico */}
          {!isExpanded && (
            <div className="space-y-3">
              <p className="text-sm text-gray-800 font-medium line-clamp-2 leading-relaxed">
                {memory.content}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">
                  {memory.createdAt.toLocaleDateString('es-ES', { 
                    day: 'numeric', 
                    month: 'short' 
                  })}
                </span>
                {timeRemaining && (
                  <div className="text-xs text-orange-600 border border-orange-300/50 bg-orange-50/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {timeRemaining}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Vista expandida - detalles completos con transición suave */}
          {isExpanded && (
            <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <div className="space-y-3">
                <p className="text-sm text-gray-800 leading-relaxed font-medium">
                  {memory.content}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <div className={`text-xs px-2 py-1 rounded-lg ${categoryConfig.color} border border-current/30 bg-white/60`}>
                    {memory.priority === 'high' ? 'Alta' : memory.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                  </div>
                  {memory.type === 'temporary' && timeRemaining ? (
                    <div className="text-xs text-orange-600 border border-orange-300/50 bg-orange-50/80 px-2 py-1 rounded-lg flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Expira en {timeRemaining}
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-600 border border-emerald-300/50 bg-emerald-50/80 px-2 py-1 rounded-lg flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Permanente
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/30">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>
                    Creado el {memory.createdAt.toLocaleDateString('es-ES', { 
                      day: 'numeric', 
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center gap-2">
                    <button className="h-7 px-2 text-xs text-gray-500 hover:text-gray-700 rounded flex items-center transition-colors">
                      <Edit3 className="w-3 h-3 mr-1" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Metadata adicional */}
              {memory.metadata && Object.keys(memory.metadata).length > 0 && (
                <div className="pt-3 border-t border-white/30">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Detalles:</p>
                  <div className="space-y-1">
                    {Object.entries(memory.metadata).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-600 capitalize">{key}:</span>
                        <span className="text-gray-800 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MemoryPanelProps {
  memories: Memory[];
  onDeleteMemory: (id: string) => void;
  onAnimateMemoryIn: (element: HTMLElement) => void;
}

const MemoryPanel: React.FC<MemoryPanelProps> = ({ memories, onDeleteMemory }) => {
  const [isStackHovered, setIsStackHovered] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  const handleStackHover = (isHovering: boolean) => {
    if (!expandedCard) {
      setIsStackHovered(isHovering);
    }
  };

  const handleCardExpand = (memoryId: string | null) => {
    setExpandedCard(memoryId);
    // Al expandir, ocultar el hover
    if (memoryId) {
      setIsStackHovered(false);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && expandedCard) {
      setExpandedCard(null);
    }
  };

  // Sample data para demostración
  const sampleMemories: Memory[] = memories.length > 0 ? memories : [
    {
      id: '1',
      category: 'schedule',
      type: 'permanent',
      content: 'Horario de atención: Lunes a Viernes de 9:00 AM a 6:00 PM. Los sábados atendemos medio día.',
      createdAt: new Date(),
      priority: 'high',
      status: 'active',
      metadata: { area: 'recepción', responsable: 'María' }
    },
    {
      id: '2',
      category: 'pricing',
      type: 'temporary',
      content: 'Descuento especial del 20% en servicios premium hasta fin de mes. Aplica para nuevos clientes.',
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      priority: 'medium',
      status: 'active',
      metadata: { codigo: 'PREMIUM20', canal: 'online' }
    },
    {
      id: '3',
      category: 'policy',
      type: 'permanent',
      content: 'Política de cancelación: 24 horas de anticipación requeridas para evitar cargos adicionales.',
      createdAt: new Date(),
      priority: 'medium',
      status: 'active'
    },
    {
      id: '4',
      category: 'emergency',
      type: 'permanent',
      content: 'En caso de emergencia médica, contactar inmediatamente al +1-800-EMERGENCY o presionar botón rojo.',
      createdAt: new Date(),
      priority: 'high',
      status: 'active',
      metadata: { ubicacion: 'recepción principal', backup: '+1-800-911-HELP' }
    }
  ];

  const displayMemories = sampleMemories;
  const stackHeight = expandedCard ? 700 : (isStackHovered ? 600 : 450);

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 border-b border-gray-200/50">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl" />
        <div className="relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                Memoria Activa
              </h2>
              <p className="text-sm text-gray-600 mt-1 font-medium">
                {displayMemories.length} instruccion{displayMemories.length !== 1 ? 'es' : ''} • Hover para ver todas
              </p>
            </div>
            
            {expandedCard && (
              <button
                onClick={() => setExpandedCard(null)}
                className="bg-white/70 backdrop-blur-sm border border-gray-300/50 hover:bg-white/90 transition-all shadow-sm px-3 py-2 rounded-lg text-sm flex items-center"
              >
                <ChevronDown className="w-4 h-4 mr-1" />
                Colapsar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stack Container */}
      <div className="flex-1 flex items-center justify-center p-6">
        {displayMemories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center shadow-inner">
              <Sparkles className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin instrucciones activas</h3>
            <p className="text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              Envía un mensaje para entrenar a tu asistente y las tarjetas aparecerán aquí en formato wallet
            </p>
          </div>
        ) : (
          <div 
            ref={stackRef}
            className="relative w-full max-w-sm mx-auto transition-all duration-300"
            style={{ 
              height: `${stackHeight}px`,
              perspective: '1200px',
              transformStyle: 'preserve-3d'
            }}
            onMouseEnter={() => handleStackHover(true)}
            onMouseLeave={() => handleStackHover(false)}
            onClick={handleBackgroundClick}
          >
            {displayMemories.map((memory, index) => (
              <WalletCard
                key={memory.id}
                memory={memory}
                index={index}
                totalCards={displayMemories.length}
                isStackHovered={isStackHovered}
                isExpanded={expandedCard === memory.id}
                expandedCard={expandedCard}
                onExpand={handleCardExpand}
                onDelete={onDeleteMemory}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 bg-gradient-to-r from-purple-50/50 via-blue-50/50 to-indigo-50/50 border-t border-gray-200/50">
        <div className="border border-purple-200/50 bg-gradient-to-r from-purple-50 to-blue-50 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-purple-800">
              <strong>iOS Wallet:</strong> Hover en el stack para revelar todas las cartas, click en una carta para ver detalles completos.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryPanel;