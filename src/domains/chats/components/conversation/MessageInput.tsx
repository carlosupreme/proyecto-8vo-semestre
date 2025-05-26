import type { Message } from "@/domains/chats/types.ts";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useMobile.ts";
import { Textarea } from "@/components/ui/textarea";
import {
  X,
  Reply,
  Mic,
  Send,
  Paperclip, Camera, Smile,
} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { AnimatePresence, motion } from "framer-motion";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {cn} from "@/lib/utils.ts";

interface MessageInputProps {
  message: string;
  onMessageChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: KeyboardEvent) => void;
  replyTo?: Message | null;
  onCancelReply?: () => void;
  disabled?: boolean;
}

export function MessageInput({
  message,
  onMessageChange,
  onSend,
  onKeyPress,
  replyTo,
  onCancelReply,
  disabled = false
}: MessageInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSend = () => {
    if (message.trim() || isRecording) {
      onSend();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="bg-white border-t">
      {/* Respuesta */}
      <AnimatePresence>
        {replyTo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 pt-3 overflow-hidden"
          >
            <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Reply className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-600">
                    Respondiendo a {replyTo.role === 'business' ? 'ti mismo' : 'cliente'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{replyTo.content}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onCancelReply}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input principal */}
      <div className="p-4">
        <div className="flex items-end gap-2">
          {/* Botones de acción */}
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  disabled={disabled}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Adjuntar archivo</TooltipContent>
            </Tooltip>

            {!isMobile && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9"
                    disabled={disabled}
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Cámara</TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Campo de texto */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyDown={onKeyPress}
              placeholder="Escribe un mensaje..."
              className="min-h-[40px] max-h-[120px] resize-none pr-10"
              disabled={disabled}
              rows={1}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 bottom-1 h-8 w-8 p-0"
              onClick={() => setShowEmojis(!showEmojis)}
            >
              <Smile className="h-5 w-5 text-gray-400" />
            </Button>
          </div>

          {/* Botón de enviar/grabar */}
          {message.trim() ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSend}
                  disabled={disabled || !message.trim()}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Enviar mensaje</TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={isRecording ? "destructive" : "default"}
                  onClick={() => setIsRecording(!isRecording)}
                  disabled={disabled}
                  className="rounded-full h-10 w-10 p-0"
                >
                  <Mic className={cn("h-5 w-5", isRecording && "animate-pulse")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isRecording ? 'Detener grabación' : 'Grabar mensaje de voz'}
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Indicador de grabación */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-2 flex items-center gap-2 text-sm text-red-600"
            >
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
              <span>Grabando mensaje de voz...</span>
              <span className="ml-auto">0:05</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}