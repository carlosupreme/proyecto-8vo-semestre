import { useIsMobile } from "@/hooks/useMobile";
import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ChatList, ChatListHeader } from "./components/chat-list";
import { ConversationHeader, EmptyState, MessageInput, MessageList } from "./components/conversation";
import { useChats, useSendMessage } from "./hooks/useChatData";
import type { GetAllConversationsResponse, GetConversationByIdResponse } from "./types";
import { AnimatePresence, motion } from "framer-motion";

export default function Chats() {
    const isMobile = useIsMobile(1200);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const messageEndRef = useRef<HTMLDivElement>(null);

    const { data: chats } = useChats();
    const { mutate: sendMessage } = useSendMessage();

    const filteredChats = useMemo(() => {
        if (!chats) return [];

        return chats.conversations.filter(chat => chat.client?.name.toLowerCase().includes(searchTerm.toLowerCase()));

    }, [chats, searchTerm]) as GetAllConversationsResponse['conversations'];

    const selectedChat = useMemo(() => {
        return chats?.conversations.find(chat => chat.id === selectedChatId);
    }, [chats, selectedChatId]) as GetConversationByIdResponse | undefined;

    const handleSendMessage = () => {
        if (newMessage.trim() === '' || !selectedChatId) return;

        sendMessage(
            { chatId: selectedChatId, message: newMessage.trim() },
            {
                onSettled: () => {
                    setNewMessage('');
                }
            }
        );
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    useEffect(() => {
        setNewMessage('');
        // Scroll to bottom when chat changes
        setTimeout(() => {
            messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
    }, [selectedChatId]);

    const handleBackToList = () => {
        setSelectedChatId(null);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
    };

    const handleChatSelect = (chatId: string) => {
        setSelectedChatId(chatId);
    };

    const handleMessageChange = (value: string) => {
        setNewMessage(value);
    };

    return (
        <div className="w-full h-full flex flex-col bg-background">
            <div className="w-full flex-1 flex overflow-hidden">
                {/* Chat List - Hidden on mobile when a chat is selected */}
                <AnimatePresence>
                    {(!isMobile || !selectedChatId) && (
                        <motion.div 
                            initial={isMobile ? { x: -300, opacity: 0 } : false}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                                "flex flex-col h-full bg-card border-r shadow-sm",
                                isMobile ? "w-full absolute z-10" : "w-80 min-w-80"
                            )}
                        >
                            <ChatListHeader
                                searchTerm={searchTerm}
                                onSearch={handleSearch}
                            />
                            <div className="flex-1 overflow-hidden">
                                <ChatList
                                    chats={filteredChats}
                                    selectedChatId={selectedChatId}
                                    onChatSelect={handleChatSelect}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Conversation Area - Full width on mobile when a chat is selected */}
                <div className={cn(
                    "bg-background flex flex-col h-full relative",
                    isMobile && selectedChatId ? "w-full" : "flex-1"
                )}>
                    {selectedChat ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col h-full"
                        >
                            <ConversationHeader
                                chat={selectedChat}
                                onBack={handleBackToList}
                            />
                            <div className="flex-1 overflow-y-auto bg-background">
                                <MessageList messages={selectedChat.conversation.messages} />
                                <div ref={messageEndRef} />
                            </div>
                            <div className="p-4 border-t bg-card/50 backdrop-blur-sm">
                                <MessageInput
                                    message={newMessage}
                                    onMessageChange={handleMessageChange}
                                    onSend={handleSendMessage}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="h-full"
                        >
                            <EmptyState />
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
