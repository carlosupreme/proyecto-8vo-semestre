import type {Message} from "@/domains/chats/types.ts";
import {useState} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {AnimatePresence, motion} from "framer-motion";
import {cn, formatMessageTime} from "@/lib/utils.ts";
import {Button} from "@/components/ui/button.tsx";
import {Copy, Download, Edit, File, MoreVertical, Play, Reply, Share, Star, Trash2} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {MessageReactions} from "@/domains/chats/components/conversation/MessageReactions.tsx";
import {MessageStatus} from "@/domains/chats/components/conversation/MessageStatus.tsx";

interface MessageBubbleProps {
    message: Message;
    isSameSenderAsPrevious: boolean;
    replyToMessage?: Message;
    onReply: (message: Message) => void;
    onDelete: (messageId: string) => void;
    onCopy: (content: string) => void;
    onReact: (messageId: string, emoji: string) => void;
}

export function MessageBubble({
                                  message,
                                  isSameSenderAsPrevious,
                                  replyToMessage,
                                  onReply,
                                  onDelete,
                                  onCopy,
                                  onReact
                              }: MessageBubbleProps) {
    const [showActions, setShowActions] = useState(false);
    const isMe = message.role === "business" || message.role === "assistant";

    const handleCopy = () => {
        onCopy(message.content);
        // Mostrar toast de confirmación
    };

    return (
        <TooltipProvider>
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.2}}
                className={cn(
                    "flex items-start gap-2 group relative",
                    isMe ? "justify-end" : "justify-start",
                    !isSameSenderAsPrevious && "mt-4"
                )}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >


                <div className={cn("max-w-[70%] relative my-1", isMe && "flex flex-col items-end")}>
                    {/* Respuesta previa */}
                    {replyToMessage && (
                        <div className={cn(
                            "mb-1 p-2 rounded-lg text-xs border-l-2",
                            isMe ? "bg-blue-50 border-blue-300" : "bg-gray-50 border-gray-300"
                        )}>
                            <p className="font-medium text-gray-600 mb-0.5">
                                {replyToMessage.role === 'business' ? 'Tú' : 'Cliente'}
                            </p>
                            <p className="text-gray-500 line-clamp-1">{replyToMessage.content}</p>
                        </div>
                    )}

                    {/* Mensaje principal */}
                    <div
                        className={cn(
                            "p-3 rounded-2xl shadow-sm relative",
                            isMe
                                ? "bg-blue-600 text-white rounded-br-sm"
                                : "bg-white border border-gray-200 rounded-bl-sm"
                        )}
                    >
                        {/* Contenido */}
                        <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}

                        </p>

                        {/* Media */}
                        {message.media && (
                            <div className="mt-2">
                                {message.media.type.startsWith('image') || message.media.type.startsWith('sticker') ? (
                                    <div className="relative group/media">
                                        <img
                                            src={message.media.url}
                                            alt={message.media.caption || 'Imagen'}
                                            className="rounded-lg max-w-full max-h-64 object-cover cursor-pointer"
                                            onClick={() => window.open(message.media?.url, '_blank')}
                                        />
                                        <div
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover/media:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                            <Button variant="ghost" size="sm" className="text-white gap-2">
                                                <Download className="w-4 h-4"/>
                                                Descargar
                                            </Button>
                                        </div>
                                    </div>
                                ) : message.media.type.startsWith('video') ? (
                                    <div className="relative">
                                        <video
                                            src={message.media.url}
                                            controls
                                            className="rounded-lg max-w-full max-h-64"
                                        />
                                    </div>
                                ) : message.media.type.startsWith('audio') ? (
                                    <div className="flex items-center gap-2 p-2 bg-black/10 rounded-lg">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                                            <Play className="w-4 h-4"/>
                                        </Button>
                                        <div className="flex-1 h-1 bg-black/20 rounded-full">
                                            <div className="h-full w-1/3 bg-black/40 rounded-full"/>
                                        </div>
                                        <span className="text-xs">0:24</span>
                                    </div>
                                ) : (
                                    <div className={cn(
                                        "p-2 rounded-lg text-xs flex items-center gap-2",
                                        isMe ? "bg-blue-500" : "bg-gray-100"
                                    )}>
                                        <File className="w-4 h-4"/>
                                        <span className="truncate flex-1">
                      {message.media.filename || 'Archivo'}
                    </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={() => window.open(message.media?.url, '_blank')}
                                        >
                                            <Download className="w-3 h-3"/>
                                        </Button>
                                    </div>
                                )}
                                {message.media.caption && (
                                    <p className="text-xs mt-1 opacity-80">{message.media.caption}</p>
                                )}
                            </div>
                        )}

                        {/* Hora y estado */}
                        <div className={cn(
                            "flex items-center gap-1 text-xs mt-1",
                            isMe ? "text-blue-200" : "text-gray-400"
                        )}>
                            <span>{formatMessageTime(message.timestamp)}</span>
                            {message.editedAt && (
                                <span className={cn(
                                    "text-xs",
                                    isMe ? "text-blue-200" : "text-gray-400"
                                )}>(editado)</span>
                            )}
                            <MessageStatus status={message.status || ""} isMe={isMe}/>
                        </div>
                    </div>

                    {/* Reacciones */}
                    <MessageReactions
                        reactions={message.reactions}
                        messageId={message.id}
                        onReact={onReact}
                    />

                    {/* Acciones rápidas */}
                    <AnimatePresence>
                        {showActions && (
                            <motion.div
                                initial={{opacity: 0, scale: 0.8}}
                                animate={{opacity: 1, scale: 1}}
                                exit={{opacity: 0, scale: 0.8}}
                                className={cn(
                                    "absolute top-0 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-lg p-1",
                                    isMe ? "right-full mr-2" : "left-full ml-2"
                                )}
                            >
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={() => onReply(message)}
                                        >
                                            <Reply className="w-3 h-3"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Responder</TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                            onClick={handleCopy}
                                        >
                                            <Copy className="w-3 h-3"/>
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Copiar</TooltipContent>
                                </Tooltip>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 w-7 p-0"
                                        >
                                            <MoreVertical className="w-3 h-3"/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align={isMe ? "end" : "start"}>
                                        <DropdownMenuItem>
                                            <Star className="mr-2 h-4 w-4"/>
                                            Destacar mensaje
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Share className="mr-2 h-4 w-4"/>
                                            Compartir
                                        </DropdownMenuItem>
                                        {isMe && (
                                            <>
                                                <DropdownMenuItem>
                                                    <Edit className="mr-2 h-4 w-4"/>
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator/>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                    onClick={() => onDelete(message.id)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4"/>
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </>
                                        )}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </TooltipProvider>
    );
}
