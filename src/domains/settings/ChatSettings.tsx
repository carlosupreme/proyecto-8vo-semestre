import { gsap } from "gsap";
import {
    AlertTriangle,
    Clock,
    DollarSign,
    Menu,
    MessageSquare,
    Send,
    Settings,
    Sparkles,
    User,
    Zap
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import claraAvatar from "../../assets/clara-avatar.jpeg";
import MemoryPanel from "./MemoryPanel";

// =================== TYPES ===================
interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    status: 'sending' | 'sent' | 'delivered' | 'error';
}

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
    bgColor: string;
    borderColor: string;
}

interface QuickCommand {
    id: string;
    text: string;
    category: MemoryCategory;
}



// =================== CONSTANTS ===================
const MEMORY_CATEGORIES: Record<MemoryCategory, MemoryCategoryConfig> = {
    schedule: {
        name: "Horarios",
        icon: Clock,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200"
    },
    pricing: {
        name: "Precios",
        icon: DollarSign,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200"
    },
    policy: {
        name: "Políticas",
        icon: Settings,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        borderColor: "border-purple-200"
    },
    emergency: {
        name: "Emergencias",
        icon: AlertTriangle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200"
    },
    general: {
        name: "General",
        icon: MessageSquare,
        color: "text-gray-600",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200"
    }
};

const QUICK_COMMANDS: QuickCommand[] = [
    { id: '1', text: "No agendar nada para hoy después de las 4 PM", category: 'schedule' },
    { id: '2', text: "Ofrecer sesiones virtuales por esta semana", category: 'policy' },
    { id: '3', text: "Aumentar precio a $90 por sesión", category: 'pricing' },
    { id: '4', text: "Preguntar siempre por medicación actual", category: 'policy' }
];

const ASSISTANT_RESPONSES: Record<MemoryCategory, string[]> = {
    schedule: [
        "Perfecto, he bloqueado el horario solicitado. No programaré citas en ese período.",
        "Entendido, actualizaré mi disponibilidad inmediatamente.",
        "De acuerdo, ese bloque de tiempo no estará disponible para agendamiento."
    ],
    pricing: [
        "He actualizado la información de precios. Los aplicaré en futuras consultas.",
        "Perfecto, recordaré mencionar estos precios a los pacientes.",
        "Guardado. Aplicaré esta política de precios en adelante."
    ],
    policy: [
        "Entendido, implementaré esta nueva política en mis respuestas.",
        "Perfecto, seguiré esta directriz en todas las interacciones.",
        "De acuerdo, he incorporado esta regla a mi comportamiento."
    ],
    emergency: [
        "Protocolo de emergencia actualizado. Lo aplicaré con máxima prioridad.",
        "Entendido, esta instrucción tiene prioridad alta en mi sistema.",
        "Guardado como protocolo crítico. Lo seguiré estrictamente."
    ],
    general: [
        "He guardado esta instrucción y la seguiré en adelante.",
        "Perfecto, he actualizado mi comportamiento según tus indicaciones.",
        "Entendido, aplicaré esto en futuras conversaciones."
    ]
};

// =================== HOOKS ===================
const useGSAPAnimations = () => {
    const animateMessageIn = useCallback((element: HTMLElement) => {
        gsap.fromTo(element,
            { opacity: 0, y: 20, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "back.out(1.7)" }
        );
    }, []);

    const animateMemoryIn = useCallback((element: HTMLElement) => {
        gsap.fromTo(element,
            { opacity: 0, x: 30, rotateY: 15 },
            { opacity: 1, x: 0, rotateY: 0, duration: 0.4, ease: "power2.out" }
        );
    }, []);

    const animateMemoryOut = useCallback((element: HTMLElement, onComplete: () => void) => {
        gsap.to(element, {
            opacity: 0,
            x: 30,
            scale: 0.95,
            duration: 0.3,
            ease: "power2.in",
            onComplete
        });
    }, []);

    const animateButtonPulse = useCallback((element: HTMLElement) => {
        gsap.to(element, {
            scale: 1.05,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut"
        });
    }, []);

    return {
        animateMessageIn,
        animateMemoryIn,
        animateMemoryOut,
        animateButtonPulse
    };
};

const useResponsiveLayout = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return { isMobile, isTablet };
};

// =================== UTILITY FUNCTIONS ===================
const generateId = (): string => Math.random().toString(36).substr(2, 9);

const detectCategory = (text: string): MemoryCategory => {
    const lowerText = text.toLowerCase();

    if (lowerText.includes('horario') || lowerText.includes('agenda') || lowerText.includes('tiempo') || lowerText.includes('cita')) {
        return 'schedule';
    }
    if (lowerText.includes('precio') || lowerText.includes('costo') || lowerText.includes('pago') || lowerText.includes('descuento')) {
        return 'pricing';
    }
    if (lowerText.includes('política') || lowerText.includes('regla') || lowerText.includes('siempre') || lowerText.includes('nunca')) {
        return 'policy';
    }
    if (lowerText.includes('emergencia') || lowerText.includes('urgente') || lowerText.includes('crisis')) {
        return 'emergency';
    }
    return 'general';
};

const detectType = (text: string): MemoryType => {
    const lowerText = text.toLowerCase();
    return (lowerText.includes('hoy') || lowerText.includes('mañana') || lowerText.includes('esta semana') || lowerText.includes('temporalmente'))
        ? 'temporary' : 'permanent';
};

const getExpirationDate = (text: string, type: MemoryType): Date | undefined => {
    if (type === 'permanent') return undefined;

    const lowerText = text.toLowerCase();
    const now = new Date();

    if (lowerText.includes('hoy')) {
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    if (lowerText.includes('esta semana')) {
        const nextWeek = new Date(now);
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
    }

    // Default: 24 horas
    return new Date(now.getTime() + 24 * 60 * 60 * 1000);
}; 

// =================== COMPONENTS ===================
interface MessageBubbleProps {
    message: Message;
    onAnimationRef: (element: HTMLElement) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onAnimationRef }) => {
    const messageRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (messageRef.current) {
            onAnimationRef(messageRef.current);
        }
    }, [onAnimationRef]);

    const isUser = message.type === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                ref={messageRef}
                className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[70%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUser ? 'bg-blue-500' : 'bg-gradient-to-br from-blue-500 to-purple-600'
                    }`}>
                    {isUser ? (
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    ) : (
                        <img src={claraAvatar} alt="Clara" className="w-8 h-8 rounded-full object-cover " />
                    )}
                </div>

                <div className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 ${isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900 shadow-sm'
                    }`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <div className={`flex items-center justify-between mt-1 text-xs ${isUser ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                        <span>
                            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {message.status === 'sending' && (
                            <div className="ml-2 w-3 h-3 rounded-full bg-current opacity-50 animate-pulse" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};



interface TypingIndicatorProps { }

const TypingIndicator: React.FC<TypingIndicatorProps> = () => {
    const typingRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typingRef.current) {
            gsap.fromTo(typingRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" }
            );
        }
    }, []);

    return (
        <div className="flex justify-start mb-4">
            <div ref={typingRef} className="flex gap-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <img src={claraAvatar} alt="Clara" className="w-5 h-5 rounded-full object-cover " />
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

 
 
// =================== MAIN COMPONENT ===================
const AssistantMemorySystem: React.FC = () => {
    // States
    const [message, setMessage] = useState<string>("");
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const [conversation, setConversation] = useState<Message[]>([
        {
            id: generateId(),
            type: "assistant",
            content: "¡Hola! Soy tu asistente virtual. Puedes darme instrucciones para mejorar cómo atiendo a tus pacientes. ¿En qué puedo ayudarte hoy?",
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
            status: "delivered"
        }
    ]);

    const [memories, setMemories] = useState<Memory[]>([
        {
            id: generateId(),
            category: "schedule",
            type: "temporary",
            content: "No agendar nada para hoy viernes de 3:00 PM a 5:00 PM",
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 8),
            createdAt: new Date(Date.now() - 1000 * 60 * 45),
            priority: "high",
            status: "active"
        },
        {
            id: generateId(),
            category: "pricing",
            type: "permanent",
            content: "Ofrecer descuento del 20% a estudiantes universitarios",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            priority: "medium",
            status: "active"
        }
    ]);

    // Refs
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Hooks
    const { isMobile, } = useResponsiveLayout();
    const { animateMessageIn, animateMemoryIn, animateButtonPulse } = useGSAPAnimations();

    // Effects
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [conversation]);

    // Handlers
    const handleSendMessage = useCallback(async (): Promise<void> => {
        if (!message.trim() || isTyping) return;

        const userMessage: Message = {
            id: generateId(),
            type: "user",
            content: message.trim(),
            timestamp: new Date(),
            status: "sent"
        };

        setConversation(prev => [...prev, userMessage]);
        setMessage("");
        setIsTyping(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            const category = detectCategory(userMessage.content);
            const type = detectType(userMessage.content);
            const responses = ASSISTANT_RESPONSES[category];
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            const assistantMessage: Message = {
                id: generateId(),
                type: "assistant",
                content: randomResponse,
                timestamp: new Date(),
                status: "delivered"
            };

            setConversation(prev => [...prev, assistantMessage]);

            // Create new memory
            const newMemory: Memory = {
                id: generateId(),
                category,
                type,
                content: userMessage.content,
                expiresAt: getExpirationDate(userMessage.content, type),
                createdAt: new Date(),
                priority: category === 'emergency' ? 'high' : 'medium',
                status: 'active'
            };

            setMemories(prev => [newMemory, ...prev]);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    }, [message, isTyping]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    const handleDeleteMemory = useCallback((memoryId: string): void => {
        setMemories(prev => prev.filter(m => m.id !== memoryId));
    }, []);

    const handleQuickCommand = useCallback((command: QuickCommand): void => {
        setMessage(command.text);
        inputRef.current?.focus();
    }, []);

    const handleSendButtonClick = useCallback((): void => {
        if (inputRef.current) {
            animateButtonPulse(inputRef.current);
        }
        handleSendMessage();
    }, [handleSendMessage, animateButtonPulse]);

    // Render
    const memoryPanel = (
        <MemoryPanel
            memories={memories}
            onDeleteMemory={handleDeleteMemory}
            onAnimateMemoryIn={animateMemoryIn}
        />
    );

    return (
        <div className="h-screen bg-gray-50 flex flex-col lg:flex-row">
            {/* Mobile Header */}
            {isMobile && (
                <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between lg:hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center">
                            <img src={claraAvatar} alt="Clara" className="w-5 h-5 rounded-full object-cover " />
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold text-gray-900">Entrena tu asistente</h1>
                            <p className="text-xs text-gray-500">Dale instrucciones personalizadas</p>
                        </div>
                    </div>

                    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:w-80 p-0">
                            {memoryPanel}
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            {/* Chat Section */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Desktop Header */}
                {!isMobile && (
                    <div className="bg-white border-b border-gray-200 p-4 xl:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center">
                                    <img src={claraAvatar} alt="Clara" className="w-10 h-10 rounded-full object-cover " />
                                </div>
                                <div>
                                    <h1 className="text-xl font-semibold text-gray-900">Entrena a tu asistente</h1>
                                    <p className="text-sm text-gray-500">Dale instrucciones para mejorar sus respuestas</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Badge className="bg-green-100 text-green-700 border-green-300">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                                    Activo
                                </Badge>
                                <Button variant="outline" size="sm">
                                    <Zap className="w-4 h-4 mr-2" />
                                    Configurar
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 xl:p-6">
                    <div className="max-w-4xl mx-auto">
                        {conversation.map((msg) => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                onAnimationRef={animateMessageIn}
                            />
                        ))}

                        {isTyping && <TypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                </ScrollArea>

                {/* Quick Commands */}
                <div className="px-4 xl:px-6 py-2 bg-gray-50 border-t border-gray-100">
                    <div className="max-w-4xl mx-auto">
                        <ScrollArea className="w-full">
                            <div className="flex gap-2 pb-2 min-w-max">
                                {QUICK_COMMANDS.map((command) => (
                                    <Button
                                        key={command.id}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleQuickCommand(command)}
                                        className="whitespace-nowrap text-xs hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    >
                                        <span className="mr-2">
                                            {React.createElement(MEMORY_CATEGORIES[command.category].icon, {
                                                className: `w-3 h-3 ${MEMORY_CATEGORIES[command.category].color}`
                                            })}
                                        </span>
                                        {command.text}
                                    </Button>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* Message Input */}
                <div className="bg-white border-t border-gray-200 p-4 xl:p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex gap-3">
                            <div className="flex-1 relative">
                                <Input
                                    ref={inputRef}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Escribe una instrucción para tu asistente..."
                                    className="pr-12 py-3 text-sm"
                                    disabled={isTyping}
                                />
                                {message.trim() && (
                                    <Button
                                        onClick={handleSendButtonClick}
                                        disabled={isTyping}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>

                            {!message.trim() && (
                                <Button
                                    variant="outline"
                                    onClick={() => setMessage("No agendar nada para hoy después de las 5 PM")}
                                    className="hidden sm:flex"
                                >
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Ejemplo
                                </Button>
                            )}
                        </div>

                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Ejemplos: "No agendar para mañana de 2-4 PM", "Subir precio a $100", "Preguntar siempre por medicación"
                        </p>
                    </div>
                </div>
            </div>

            {/* Desktop Memory Panel */}
            {!isMobile && (
                <div className="w-80 xl:w-96 bg-white border-l border-gray-200 hidden lg:flex flex-col">
                    {memoryPanel}
                </div>
            )}
        </div>
    );
};

export default AssistantMemorySystem;