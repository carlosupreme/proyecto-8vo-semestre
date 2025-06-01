import type { GetConversationByIdResponse } from "@/domains/chats/types.ts";
import { useState } from "react";
import { useIsMobile } from "@/hooks/useMobile.ts";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button.tsx";
import { ArrowLeft, Info, Phone, Search, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.tsx";
import { cn } from "@/lib/utils.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip.tsx";
import { Skeleton } from "../../../../components/ui/skeleton";

interface ConversationHeaderProps {
    chat: GetConversationByIdResponse;
    onBack: () => void;
    isTyping?: boolean;
    isOnline?: boolean;
    isLoading?: boolean;
}

export function ConversationHeader({
    chat,
    onBack,
    isLoading,
    isTyping = false,
    isOnline = true
}: ConversationHeaderProps) {
    const [showInfo, setShowInfo] = useState(false);
    const isMobile = useIsMobile();
    const clientName = chat.client?.name || 'Cliente';
    const clientInitials = clientName.substring(0, 2).toUpperCase();

    if (isLoading) {
        return (
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b sticky top-0 z-20 shadow-sm"
            >
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 -ml-2"
                                    onClick={onBack}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}

                            <div className="relative">
                                <Skeleton className="w-10 h-10 border-2 border-white shadow-sm" />
                                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-gray-300" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <Skeleton className="h-5 w-24 rounded" />
                                <Skeleton className="h-4 w-16 rounded mt-1" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }


    return (
        <>
            <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border-b sticky top-0 z-20 shadow-sm"
            >
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            {isMobile && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full h-9 w-9 -ml-2"
                                    onClick={onBack}
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </Button>
                            )}

                            <div className="relative">
                                <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={chat.client?.photo} alt={clientName} />
                                    <AvatarFallback
                                        className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {clientInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className={cn(
                                    "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
                                    isOnline ? "bg-green-500" : "bg-gray-300"
                                )} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="font-semibold truncate">{clientName}</h3>
                                    {chat.client?.phoneNumber && (
                                        <Badge variant="outline" className="h-5 px-1.5 text-[10px]">
                                            <Phone className="w-3 h-3 mr-1" />
                                            {chat.client.phoneNumber}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {isTyping ? (
                                        <motion.span
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-blue-600 font-medium"
                                        >
                                            Escribiendo...
                                        </motion.span>
                                    ) : (
                                        <>
                                            <span className={cn(
                                                "w-1.5 h-1.5 rounded-full",
                                                isOnline ? "bg-green-500" : "bg-gray-300"
                                            )} />
                                            <p className="text-xs text-gray-500">
                                                {isOnline ? 'En línea' : 'Desconectado'}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-1">
                            {!isMobile && (
                                <>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                                                <Search className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Buscar en chat</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                                                <Phone className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Llamar</TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                                                <Video className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Videollamada</TooltipContent>
                                    </Tooltip>
                                </>
                            )}

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="rounded-full h-9 w-9"
                                        onClick={() => setShowInfo(!showInfo)}
                                    >
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>Información del cliente</TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>

            </motion.div>

            {/* Panel de información del cliente */}
            <AnimatePresence>
                {showInfo && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 border-b overflow-hidden"
                    >
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="text-sm font-medium">{chat.client?.email || 'No disponible'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Dirección</p>
                                    <p className="text-sm font-medium">{chat.client?.address || 'No disponible'}</p>
                                </div>
                            </div>
                            {chat.client?.notes && (
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500">Notas</p>
                                    <p className="text-sm">{chat.client.notes}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

