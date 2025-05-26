import { ScrollArea } from "@/components/ui/scroll-area";
import { type Message } from "../../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className="flex-1 p-4 space-y-4 bg-background h-[calc(100vh-12rem)]">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isSameSenderAsPrevious={
            index > 0 && messages[index - 1].role === message.role
          }
        />
      ))}
    </ScrollArea>
  );
}
