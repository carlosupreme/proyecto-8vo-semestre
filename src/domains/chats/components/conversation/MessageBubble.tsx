import { cn } from "@/lib/utils";
import { type Message } from "../../types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
  
interface MessageBubbleProps {
  message: Message;
  isSameSenderAsPrevious: boolean;
}

export function MessageBubble({ message, isSameSenderAsPrevious }: MessageBubbleProps) {
  const isMe = message.role === "user";
  const showAvatar = !isSameSenderAsPrevious && !isMe;
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-end gap-2 group",
        isMe ? "justify-end" : "justify-start",
        !isSameSenderAsPrevious && "mt-6"
      )}
    >
      {/* Avatar for other person's messages */}
      {showAvatar && (
        <Avatar className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <AvatarImage src="/avatar-placeholder.png" alt="Avatar" />
          <AvatarFallback>CL</AvatarFallback>
        </Avatar>
      )}
      
      {/* Spacer when avatar is hidden */}
      {!showAvatar && !isMe && <div className="w-8" />}
      
      <div
        className={cn(
          "p-3 rounded-2xl max-w-[70%] shadow-sm",
          isMe
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-card text-card-foreground border rounded-tl-none",
          isSameSenderAsPrevious && isMe && "mr-0",
          isSameSenderAsPrevious && !isMe && "ml-0"
        )}
      >
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {message.media && (
          <div className="mt-2">
            {message.media.type.startsWith('image') ? (
              <img 
                src={message.media.url} 
                alt={message.media.caption || 'Image'} 
                className="rounded-md max-w-full max-h-60 object-contain"
              />
            ) : (
              <div className="p-2 bg-muted rounded-md text-xs flex items-center gap-2">
                <span className="truncate">{message.media.filename || 'File'}</span>
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex items-center gap-1 text-xs mt-1",
            isMe 
              ? 'text-primary-foreground/70 justify-end' 
              : 'text-muted-foreground justify-start'
          )}
        >
          <span>{formattedTime}</span>
          {isMe && (
            <span className="ml-1">
              <CheckCheck className="h-3 w-3" />
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
