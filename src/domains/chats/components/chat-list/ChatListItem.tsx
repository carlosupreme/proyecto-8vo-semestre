import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatTimestamp } from "@/lib/utils";
import {
  Archive,
  BellOff,
  Image as ImageIcon,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  Trash2,
  User,
  Video
} from 'lucide-react'; // MessageSquare no se usa aquí, pero puede estar en otro lado
import React from 'react';
import type { GetAllConversationsResponse, Message } from "../../types"; // Asumo que estas rutas son correctas

// Helper para obtener una vista previa del mensaje
const getMessagePreview = (message: Message): { text: string; hasMedia: boolean; mediaType?: string } => {
  const hasMedia = !!message.media;
  let mediaType = '';

  if (hasMedia && message.media) {
    if (message.media.type.includes('image')) mediaType = 'image';
    else if (message.media.type.includes('video')) mediaType = 'video';
    else if (message.media.type.includes('audio')) mediaType = 'audio';
    else mediaType = 'file';
  }

  const text = message.content || (hasMedia ? `${mediaType === 'image' ? '📷' : mediaType === 'video' ? '🎥' : mediaType === 'audio' ? '🎵' : '📎'} ${message.media?.caption || 'Archivo'}` : 'Mensaje vacío');

  return { text, hasMedia, mediaType };
};


interface ChatListItemProps {
  chat: GetAllConversationsResponse['conversations'][number];
  isSelected: boolean;
  onClick: () => void;
  onAction: (action: string, chatId: string) => void;
}

export function ChatListItem({ chat, isSelected, onClick, onAction }: ChatListItemProps) {
  // isHovered ya no es necesario para la lógica de visibilidad del botón de acciones,
  // pero se puede mantener si se usa para otros efectos de hover.
  // const [isHovered, setIsHovered] = useState(false); 

  const messagePreview = getMessagePreview(chat.lastMessage);
  const clientName = chat.client?.name || 'Cliente Desconocido';
  const clientInitials = clientName.length > 1 
    ? clientName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : clientName.substring(0, 2).toUpperCase();

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation(); // Prevenir que el click se propague al onClick del item
    onAction(action, chat.id);
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "group relative w-full text-left border-b border-border transition-colors duration-150 cursor-pointer",
          isSelected ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500 dark:border-l-blue-400" : "hover:bg-gray-100 dark:hover:bg-gray-800/50",
        )}
        // onMouseEnter={() => setIsHovered(true)} // Opcional
        // onMouseLeave={() => setIsHovered(false)} // Opcional
        onClick={onClick}
        role="button" // Mejor semántica para elementos clickeables
        tabIndex={0} // Para que sea enfocable
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(); }} // Accesibilidad
        aria-label={`Conversación con ${clientName}. ${chat.newClientMessagesCount > 0 ? `${chat.newClientMessagesCount} mensajes nuevos.` : ''} Último mensaje: ${messagePreview.text}`}
        aria-selected={isSelected}
      >
        <div className="px-3 sm:px-4 py-3 flex items-center space-x-3">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10 sm:w-11 sm:h-11 border-2 border-white dark:border-gray-700 shadow-sm">
              <AvatarImage
                src={chat.client?.photo}
                alt={`Foto de ${clientName}`}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <AvatarFallback className="bg-gradient-to-br from-clara-beige to-clara-sage text-white dark:from-clara-beige/80 dark:to-clara-sage/80 dark:text-gray-200 text-sm font-medium">
                {clientInitials}
              </AvatarFallback>
            </Avatar>
            {chat.newClientMessagesCount > 0 && (
              <div className="absolute -top-1 -right-1">
                <div className="bg-red-500 text-white text-[0.65rem] leading-tight rounded-full min-w-[1.125rem] h-[1.125rem] px-1 flex items-center justify-center font-bold shadow-md">
                  {chat.newClientMessagesCount > 99 ? '99+' : chat.newClientMessagesCount}
                </div>
              </div>
            )}
          </div>

          {/* Contenido del Chat */}
          <div className="flex-1 min-w-0"> {/* min-w-0 es crucial para el truncamiento */}
            <div className="flex justify-between items-center mb-0.5">
              <div className="flex items-center gap-1.5 min-w-0 pr-1"> {/* pr-1 para espacio antes de la hora */}
                <h3 className={cn(
                  "font-semibold text-sm sm:text-base truncate text-gray-800 dark:text-gray-100",
                  chat.newClientMessagesCount > 0 && "text-blue-700 dark:text-blue-400"
                )}>
                  {clientName}
                </h3>
                {chat.client?.phoneNumber && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                        onClick={(e) => e.stopPropagation()} // Evitar que el click abra el chat
                        aria-label="Ver número de teléfono"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{chat.client.phoneNumber}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <span className={cn(
                "text-xs flex-shrink-0 ml-auto", // ml-auto para empujar a la derecha si hay espacio
                chat.newClientMessagesCount > 0 ? "text-clara-terracotta dark:text-clara-terracotta/90 font-medium" : "text-gray-500 dark:text-gray-400"
              )}>
                {formatTimestamp(chat.lastMessage.timestamp)}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-1 min-w-0"> {/* gap-1 para un poco menos de espacio */}
                {messagePreview.hasMedia && (
                  <Badge
                    variant="outline"
                    className="flex-shrink-0 h-5 px-1.5 text-[0.7rem] border-gray-300 bg-gray-100 text-gray-600 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300"
                  >
                    {messagePreview.mediaType === 'image' && <ImageIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {messagePreview.mediaType === 'video' && <Video className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {messagePreview.mediaType === 'audio' && <Mic className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                    {messagePreview.mediaType === 'file' && <Paperclip className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                  </Badge>
                )}
                <p className={cn(
                  "truncate",
                  chat.newClientMessagesCount > 0 ? "text-clara-terracotta dark:text-clara-terracotta/90 font-medium" : "text-gray-600 dark:text-gray-300"
                )}>
                  {chat.lastMessage.role === 'business' && (
                    <span className="font-medium">Tú: </span>
                  )}
                  {messagePreview.text}
                </p>
              </div>
            </div>
          </div>

          {/* Menú de Acciones */}
          <div className={cn(
            "flex-shrink-0 self-center ml-1 sm:ml-2", // Margen izquierdo sutil
            // Siempre visible en sm y mayores. En pantallas más pequeñas, visible si group-hover o seleccionado.
            "opacity-0 group-hover:opacity-100 focus-within:opacity-100 sm:opacity-100",
            isSelected && "opacity-100" // Asegura visibilidad si está seleccionado
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 sm:h-8 sm:w-8 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Más acciones"
                >
                  <MoreVertical className="h-4 w-4 sm:h-4.5 sm:w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52 sm:w-56 dark:bg-gray-800"> {/* Ancho responsivo y dark mode */}
                <DropdownMenuLabel className="dark:text-gray-300">Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-gray-700 dark:text-gray-200" onClick={(e) => handleAction(e, 'profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Ver perfil
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-gray-700 dark:text-gray-200" onClick={(e) => handleAction(e, 'pin')}>
                  <Pin className="mr-2 h-4 w-4" />
                  Fijar chat
                </DropdownMenuItem>
                <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-gray-700 dark:text-gray-200" onClick={(e) => handleAction(e, 'mute')}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Silenciar
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700"/>
                <DropdownMenuItem className="focus:bg-gray-100 dark:focus:bg-gray-700 dark:text-gray-200" onClick={(e) => handleAction(e, 'archive')}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archivar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleAction(e, 'delete')}
                  className="text-red-600 hover:!text-red-600 focus:!text-red-600 hover:!bg-red-50 focus:!bg-red-50 dark:hover:!bg-red-500/20 dark:focus:!bg-red-500/20 dark:text-red-400"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}