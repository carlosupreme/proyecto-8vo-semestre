import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/useMobile";
import { ArrowLeft, Info, Phone, Search, Video } from "lucide-react";
import { cn } from "../../../../lib/utils";
import { type GetConversationByIdResponse } from "../../types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface ConversationHeaderProps {
  chat: GetConversationByIdResponse;
  onBack: () => void;
}

export function ConversationHeader({ chat, onBack }: ConversationHeaderProps) {
  const isMobile = useIsMobile(1200);

  return (
    <motion.div 
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={cn(
        "flex items-center justify-between p-3 sticky top-0 z-10 bg-card/80 backdrop-blur-sm", 
        !isMobile && "border-b"
      )}
    >
      <div className="flex items-center space-x-3">
        {isMobile && (
          <Button variant="ghost" size="icon" className="rounded-full h-9 w-9" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <Avatar className="w-10 h-10 border ring-2 ring-primary/10">
          <AvatarImage src={chat.client?.photo} alt={chat.client?.name} />
          <AvatarFallback className="bg-primary/10 text-primary">
            {chat.client?.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{chat.client?.name}</h3>
            <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal text-muted-foreground border-muted-foreground/20">
              Client
            </Badge>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
            <p className="text-xs text-muted-foreground">Online now</p>
          </div>
        </div>
      </div>  
      <div className="flex items-center space-x-1">
        {!isMobile && (
          <>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Phone className="h-4 w-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
              <Video className="h-4 w-4 text-muted-foreground" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
          <Info className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    </motion.div>
  );
}
