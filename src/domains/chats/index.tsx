import { ChatList } from "@/domains/chats/components/chat-list/ChatList.tsx";
import { ChatListHeader } from "@/domains/chats/components/chat-list/ChatListHeader.tsx";
import { ConversationHeader } from "@/domains/chats/components/conversation/ConversationHeader.tsx";
import { EmptyState as ConversationEmptyState } from "@/domains/chats/components/conversation/EmptyState.tsx"; // Renombrar para evitar colisión si se usa otro EmptyState
import { MessageInput } from "@/domains/chats/components/conversation/MessageInput.tsx";
import { MessageList } from "@/domains/chats/components/conversation/MessageList.tsx";
import { useChatById, useChats, useSendMessage } from "@/domains/chats/hooks/useChatData.ts"; // Rutas de dominio
import { useIsMobile } from "@/hooks/useMobile"; // Asegúrate que esta ruta es correcta
import { cn } from "@/lib/utils"; // Asegúrate que esta ruta es correcta
import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface ChatLayoutProps {
    chatId?: string;
    showChatList?: boolean; // Esta prop podría no ser necesaria si la lógica de isMobile y chatId es suficiente
}

export function ChatLayout({ chatId, showChatList = true }: ChatLayoutProps) {
    const navigate = useNavigate();
    const isMobile = useIsMobile(768); // Breakpoint md

    const [searchTerm, setSearchTerm] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    // Hooks de datos
    // Añadir manejo de isLoading y error para useChats también sería bueno
    const { data: chatsData, isLoading: isLoadingChats, error: chatsError, refetch: refetchChats } = useChats();
    const { data: selectedChat, isLoading: isChatLoading, error: selectedChatError } = useChatById(chatId);
    const { mutate: sendMessage } = useSendMessage();

    const filteredChats = useMemo(() => {
        if (!chatsData?.conversations) return [];
        return chatsData.conversations.filter(chat =>
            chat.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [chatsData, searchTerm]);

    const handleChatSelect = (selectedChatId: string) => {
        // localStorage.setItem('bar', 'false'); // Considerar si esta línea es realmente necesaria
        void navigate({ to: `/chats/${selectedChatId}` });
    };

    const handleBackToList = () => {
        void navigate({ to: "/chats" });
    };

    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !chatId) return;
        sendMessage(
            { chatId, message: newMessage.trim() },
            {
                onSettled: () => {
                    setNewMessage("");
                    // Podrías querer refetchear el chat actual para ver el mensaje enviado inmediatamente
                    // o manejar la actualización optimista.
                }
            }
        );
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        setNewMessage(""); // Limpiar input al cambiar de chat
        // Scroll al final con un pequeño delay para asegurar que el DOM está actualizado
        const timer = setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "auto" }); // 'auto' puede ser más rápido que 'smooth' aquí
        }, 50); // Reducido el delay
        return () => clearTimeout(timer);
    }, [selectedChat?.messages, chatId]); // Depender de messages o chatId

    // Lógica de visibilidad mejorada
    const listVisible = showChatList && (!isMobile || !chatId);
    const conversationVisible = !isMobile || (isMobile && !!chatId);

    return (
        <div className="h-screen flex flex-row overflow-hidden bg-background dark:bg-gray-900">
            {/* --- Columna de Lista de Chats --- */}
            <AnimatePresence mode="wait">
                {listVisible && (
                    <motion.aside // Cambiado a <aside> por semántica
                        key="chat-list-panel"
                        initial={isMobile ? { x: "-100%", opacity: 0 } : { width: 0, opacity: 0 }}
                        animate={isMobile ? { x: 0, opacity: 1 } : { width: "auto", opacity: 1 }}
                        exit={isMobile ? { x: "-100%", opacity: 0 } : { width: 0, opacity: 0 }}
                        transition={{ type: "tween", duration: 0.3 }}
                        className={cn(
                            "flex flex-col bg-card dark:bg-gray-800 border-r border-border dark:border-gray-700",
                            // En móvil, ocupa toda la pantalla y se superpone
                            isMobile ? "absolute inset-0 z-20" : "relative flex-shrink-0 w-80 md:w-96", // Ancho fijo para desktop
                            // Si no es mobile, debe tener un ancho definido para que 'width: "auto"' funcione bien con la animación
                            // o podrías animar `flexBasis` o `maxWidth` en lugar de `width`.
                            // Para simplificar, usaré un ancho fijo en desktop y quitaré la animación de width para desktop por ahora,
                            // ya que puede ser compleja de manejar con `flex-shrink-0`.
                        )}
                    // Aplicar estilos de ancho directamente si no se anima el width en desktop
                    // style={!isMobile ? { width: '320px' /* o 384px */ } : {}}
                    >
                        <ChatListHeader
                            searchTerm={searchTerm}
                            onSearch={setSearchTerm}
                        // Podrías pasar isLoadingChats aquí para mostrar un spinner en el header si los chats están cargando
                        />
                        {/* El componente ChatList internamente debe usar flex-1 en su ScrollArea */}
                        <ChatList
                            chats={filteredChats}
                            selectedChatId={chatId || null}
                            onChatSelect={handleChatSelect}
                            isLoading={isLoadingChats} // Pasar estado de carga
                            error={chatsError?.message} // Pasar mensaje de error
                            onRefresh={refetchChats} // Pasar función de refresco
                        // onLoadMore y hasMore si tienes paginación para la lista de chats
                        />
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* --- Área de Conversación --- */}
            {/* Este div actúa como el contenedor principal para la conversación y EmptyState en desktop */}
            <main className={cn( // Cambiado a <main> por semántica
                "flex-1 flex flex-col overflow-hidden", // overflow-hidden para que el scroll interno de MessageList funcione
                isMobile && !chatId && "hidden" // Ocultar completamente en móvil si no hay chat seleccionado
            )}>
                {conversationVisible && chatId && selectedChat ? (
                    <motion.div
                        key={chatId} // `key` aquí fuerza el remount y la animación al cambiar de chat
                        initial={{ opacity: 0, y: isMobile ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col h-full" // h-full es crucial aquí
                    >
                        <ConversationHeader
                            chat={selectedChat} // Asumo que selectedChat tiene la estructura que ConversationHeader espera
                            onBack={handleBackToList} // Botón de atrás solo en móvil
                            isLoading={isChatLoading} // Pasar estado de carga del chat actual
                        />
                        {/* MessageList debe tener overflow-y-auto y flex-1 internamente */}
                        <MessageList
                            messages={selectedChat.messages || []} // Asegurar que messages es un array
                            isLoading={isChatLoading} // Podría mostrar skeletons dentro de MessageList
                            chatId={chatId} // Pasar chatId para diferenciar mensajes
                        />
                        {/* Div invisible para hacer scroll al final */}
                        <div ref={messageEndRef} className="h-0" />
                        <MessageInput
                            message={newMessage}
                            onMessageChange={setNewMessage}
                            onSend={handleSendMessage}
                            onKeyPress={handleKeyPress}
                            // Podrías deshabilitar el input si selectedChatError existe
                            disabled={!!selectedChatError}
                        />
                    </motion.div>
                ) : conversationVisible && !chatId && !isMobile ? (
                    // Mostrar EmptyState en desktop si no hay chat seleccionado y la conversación es visible
                    <ConversationEmptyState />
                ) : null}
            </main>
        </div>
    );
}