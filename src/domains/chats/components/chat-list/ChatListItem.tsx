import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type Chat } from "../../types";
import { cn } from "../../../../lib/utils";

interface ChatListItemProps {
  chat: Chat;
  isSelected: boolean;
  onClick: () => void;
}

export function ChatListItem({ chat, isSelected, onClick }: ChatListItemProps) {
  return (
    <button
      className={cn(
        "w-full text-left px-4 py-3 border-b border-border hover:bg-muted/50 flex items-start space-x-3 transition-colors",
        isSelected && "bg-muted"
      )}
      onClick={onClick}
    >
      <Avatar className="flex-shrink-0 w-10 h-10 border">
        <AvatarImage src={chat.avatar} alt={chat.name} />
        <AvatarFallback>{chat.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center w-full">
          <h3 className="font-semibold truncate mr-2">{chat.name}</h3>
          <span className="text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
            {chat.time}
          </span>
        </div>
        <div className="flex items-center justify-between w-full">
          <p className="text-sm text-muted-foreground truncate mr-2">
            {chat.lastMessage.substring(0, 30)}...
          </p>
          {chat.unreadCount && chat.unreadCount > 0 && (
            <div className="flex-shrink-0 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {chat.unreadCount}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
