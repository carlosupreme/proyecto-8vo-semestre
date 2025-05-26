import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatListItem } from "./ChatListItem";
import type { GetAllConversationsResponse } from "../../types";

interface ChatListProps {
  chats: GetAllConversationsResponse['conversations']
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
}

export function ChatList({ chats, selectedChatId, onChatSelect }: ChatListProps) {
  return (
    <ScrollArea className="flex-1 h-[calc(100vh-12rem)]">
      {chats.map((chat) => (
        <ChatListItem
          key={chat.id}
          chat={chat}
          isSelected={selectedChatId === chat.id}
          onClick={() => onChatSelect(chat.id)}
        />
      ))}
    </ScrollArea>
  );
} 
