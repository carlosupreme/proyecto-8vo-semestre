import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DateSeparator } from "@/domains/chats/components/conversation/DateSeparator.tsx";
import { MessageBubble } from "@/domains/chats/components/conversation/MessageBubble.tsx";
import type { Message } from "@/domains/chats/types.ts";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, MessageSquare, RefreshCw } from "lucide-react";
import React, { useCallback, useMemo, useRef, useState } from "react";

interface MessageListProps {
    messages: Message[];
    isLoading?: boolean;
    error?: string | null;
    onRetry?: () => void;
    hasMore?: boolean;
    onLoadMore?: () => void;
    chatId: string
}

export function MessageList({
    messages,
    chatId,
    isLoading = false,
    error = null,
    onRetry = () => {
    },
    hasMore = false,
    onLoadMore = () => {
    }
}: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [_replyTo, setReplyTo] = useState<Message | null>(null);
    const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

    const handleReply = (message: Message) => {
        setReplyTo(message);
        // Enfocar input de mensaje
    };

    const handleDelete = (messageId: string) => {
        // Implementar lógica de eliminación
        console.log(`Eliminar mensaje con ID: ${messageId}`);
    };

    const handleCopy = (content: string, messageId: string) => {
        void navigator.clipboard.writeText(content);
        setCopiedMessageId(messageId);
        setTimeout(() => setCopiedMessageId(null), 2000);
    };

    const handleReact = (messageId: string, emoji: string) => {
        // Implementar lógica de reacciones
        console.log(messageId, emoji);
    };

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && hasMore && !isLoading) {
            onLoadMore();
        }
    }, [hasMore, isLoading, onLoadMore]);

    // Agrupar mensajes por fecha
    const groupedMessages = useMemo(() => {
        const groups: { date: string; messages: Message[] }[] = [];
        let currentDate = '';

        messages.forEach(message => {
            const messageDate = format(new Date(message.timestamp), 'yyyy-MM-dd');

            if (messageDate !== currentDate) {
                currentDate = messageDate;
                groups.push({
                    date: messageDate,
                    messages: [message]
                });
            } else {
                groups[groups.length - 1].messages.push(message);
            }
        });

        return groups;
    }, [messages]);

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="space-y-2">
                        <p>Error al cargar los mensajes</p>
                        <Button onClick={onRetry} variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Reintentar
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!isLoading && messages.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <div className="p-4 bg-gray-100 rounded-full inline-flex">
                        <MessageSquare className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                            No hay mensajes aún
                        </h3>
                        <p className="text-sm text-gray-500 max-w-sm">
                            Envía el primer mensaje para iniciar la conversación
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-hidden bg-gray-50 relative">
            <ScrollArea
                ref={scrollRef}
                className="h-full px-4 py-4"
                onScroll={handleScroll}
            >
                {/* Indicador de carga de mensajes antiguos */}
                {isLoading && messages.length > 0 && (
                    <div className="flex justify-center py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Cargando mensajes anteriores...
                        </div>
                    </div>
                )}

                {/* Mensajes agrupados por fecha */}
                {groupedMessages.map((group, groupIndex) => (
                    <div key={group.date}>
                        <DateSeparator timestamp={new Date(group.date).getTime()} />

                        {group.messages.map((message, index) => {
                            const prevMessage = index > 0 ? group.messages[index - 1] :
                                groupIndex > 0 ? groupedMessages[groupIndex - 1].messages[groupedMessages[groupIndex - 1].messages.length - 1] :
                                    null;

                            const isSameSender = !!!(prevMessage);
                            const replyToMsg = message.replyTo ? messages.find(m => m.id === message.replyTo) : undefined;

                            return (
                                <MessageBubble
                                    key={message.id}
                                    message={message}
                                    isSameSenderAsPrevious={isSameSender}
                                    replyToMessage={replyToMsg}
                                    onReply={handleReply}
                                    onDelete={handleDelete}
                                    onCopy={(content) => handleCopy(content, message.id)}
                                    onReact={handleReact}
                                />
                            );
                        })}
                    </div>
                ))}

                {/* Indicador de escritura */}
                {/* <TypingIndicator/> */}
            </ScrollArea>

            {/* Toast de copiado */}
            <AnimatePresence>
                {copiedMessageId && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2"
                    >
                        <Check className="w-4 h-4" />
                        <span className="text-sm">Mensaje copiado</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
