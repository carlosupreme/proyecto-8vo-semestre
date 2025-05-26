import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageIcon, Mic, Paperclip, SendHorizonal, Smile } from "lucide-react";
import { useIsMobile } from "@/hooks/useMobile";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
} 

export function MessageInput({
  message,
  onMessageChange,
  onSend,
  onKeyPress,
}: MessageInputProps) {
  const isMobile = useIsMobile(1200);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFocus = () => setIsExpanded(true);
  const handleBlur = () => message.trim() === '' && setIsExpanded(false);

  return (
    <motion.div 
      layout
      className="flex flex-col space-y-2 p-4"
    >
      {isExpanded && !isMobile && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between px-1"
        >
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-full px-3 h-8">
              <ImageIcon className="h-3.5 w-3.5 mr-1" />
              Photos
            </Button>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground rounded-full px-3 h-8">
              <Paperclip className="h-3.5 w-3.5 mr-1" />
              Files
            </Button>
          </div>
        </motion.div>
      )}
      
      <div className={cn(
        "flex items-center space-x-2 bg-card/30 p-1 rounded-full border shadow-sm",
        isExpanded && "ring-1 ring-primary/20"
      )}>
        {!isMobile && (
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 flex-shrink-0">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
        )}
        
        <Input
          type="text"
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-2"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={onKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        
        {message.trim() === '' ? (
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 flex-shrink-0">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            className="rounded-full h-9 w-9 bg-primary hover:bg-primary/90 flex-shrink-0"
            onClick={onSend}
          >
            <SendHorizonal className="h-5 w-5 text-primary-foreground" />
          </Button>
        )}
      </div>
    </motion.div>
  );
}
