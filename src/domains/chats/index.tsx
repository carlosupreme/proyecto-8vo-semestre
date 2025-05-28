import React, {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "@tanstack/react-router";
import {useIsMobile} from "@/hooks/useMobile";
import {cn} from "@/lib/utils";
import {AnimatePresence, motion} from "framer-motion";
import {useChatById, useChats, useSendMessage} from "@/domains/chats/hooks/useChatData.ts";
import {ChatListHeader} from "@/domains/chats/components/chat-list/ChatListHeader.tsx";
import {ChatList} from "@/domains/chats/components/chat-list/ChatList.tsx";
import {ConversationHeader} from "@/domains/chats/components/conversation/ConversationHeader.tsx";
import {MessageList} from "@/domains/chats/components/conversation/MessageList.tsx";
import {MessageInput} from "@/domains/chats/components/conversation/MessageInput.tsx";
import {EmptyState} from "@/domains/chats/components/conversation/EmptyState.tsx";

interface ChatLayoutProps {
    chatId?: string;
    showChatList?: boolean;
}

export function ChatLayout({ chatId, showChatList = true }: ChatLayoutProps) {
    const navigate = useNavigate();
    const isMobile = useIsMobile(768);

    const [searchTerm, setSearchTerm] = useState("");
    const [newMessage, setNewMessage] = useState("");
    const messageEndRef = useRef<HTMLDivElement>(null);

    const {data: chats} = useChats();
    const {data: selectedChat, isLoading: isChatLoading} = useChatById(chatId);
    const {mutate: sendMessage} = useSendMessage();

    // Filtrar chats
    const filteredChats = useMemo(() => {
        if (!chats?.conversations) return [];
        return chats.conversations.filter(chat =>
            chat.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [chats, searchTerm]);

    const handleChatSelect = (selectedChatId: string) => {
        localStorage.setItem('bar', 'false');
        void navigate({to: `/chats/${selectedChatId}`});
    };

    // Volver a la lista (móvil)
    const handleBackToList = () => {
        void navigate({to: "/chats"});
    };

    // Enviar mensaje
    const handleSendMessage = () => {
        if (newMessage.trim() === "" || !chatId) return;

        sendMessage(
            {chatId, message: newMessage.trim()},
            {
                onSettled: () => {
                    setNewMessage("");
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

    // Scroll al final cuando cambia el chat
    useEffect(() => {
        setNewMessage("");
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({behavior: "smooth"});
        }, 100);
    }, [chatId]);

    // Lógica para mostrar/ocultar elementos
    const shouldShowChatList = showChatList && (!isMobile || !chatId);

    return (
        <div className="h-screen flex bg-background">
            {/* Lista de Chats */}
            <AnimatePresence mode="wait">
                {shouldShowChatList && (
                    <motion.div
                        initial={isMobile ? {x: -100, opacity: 0} : false}
                        animate={{x: 0, opacity: 1}}
                        exit={isMobile ? {x: -100, opacity: 0} : {}}
                        className={cn(
                            "flex flex-col bg-card border-r",
                            isMobile ? "w-full absolute inset-0 z-20" : "w-1/3 max-w-md"
                        )}
                    >
                        <ChatListHeader
                            searchTerm={searchTerm}
                            onSearch={setSearchTerm}
                        />
                        <ChatList
                            chats={filteredChats}
                            selectedChatId={chatId || null}
                            onChatSelect={handleChatSelect}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Área de Conversación */}
            <div className={cn(
                "flex-1 flex flex-col",
                // En móvil, ocupar toda la pantalla cuando hay chat seleccionado
                isMobile && chatId ? "w-full" : "",
                // En móvil sin chat, ocultar completamente
                isMobile && !chatId ? "hidden" : ""
            )}>
                {chatId && selectedChat ? (
                    <motion.div
                        key={chatId}
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        className="flex flex-col h-full"
                    >
                        <ConversationHeader
                            chat={selectedChat}
                            onBack={handleBackToList}
                        />
                        <MessageList
                            messages={selectedChat.messages}
                            isLoading={isChatLoading}
                        />
                        <div ref={messageEndRef}/>
                        <MessageInput
                            message={newMessage}
                            onMessageChange={setNewMessage}
                            onSend={handleSendMessage}
                            onKeyPress={handleKeyPress}
                        />
                    </motion.div>
                ) : (
                    // Solo mostrar EmptyState en desktop cuando no hay chat seleccionado
                    !isMobile && <EmptyState/>
                )}
            </div>
        </div>
    );
}