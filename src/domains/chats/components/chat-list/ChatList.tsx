import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatTimestamp } from "@/lib/utils";
import {
  AlertCircle,
  Archive,
  BellOff,
  CheckCircle2,
  Clock,
  Image,
  MessageSquare,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Pin,
  RefreshCw,
  Shield,
  Trash2,
  User,
  Video
} from 'lucide-react';
import React, { useCallback, useState } from 'react';
import type { GetAllConversationsResponse, Message } from "../../types";
 
const getMessagePreview = (message: Message): { text: string; hasMedia: boolean; mediaType?: string } => {
  const hasMedia = !!message.media;
  let mediaType = '';

  if (hasMedia && message.media) {
    if (message.media.type.includes('image')) mediaType = 'image';
    else if (message.media.type.includes('video')) mediaType = 'video';
    else if (message.media.type.includes('audio')) mediaType = 'audio';
    else mediaType = 'file';
  }

  const text = message.content || (hasMedia ? `${mediaType === 'image' ? '📷' : mediaType === 'video' ? '🎥' : mediaType === 'audio' ? '🎵' : '📎'} ${message.media?.caption || 'Archivo multimedia'}` : 'Mensaje vacío');

  return { text, hasMedia, mediaType };
};

// Componente de Estado Vacío
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 space-y-4 bg-gray-50 rounded-lg m-4">
    <div className="p-4 bg-white rounded-full shadow-sm">
      <MessageSquare className="w-12 h-12 text-gray-400" />
    </div>
    <div className="text-center space-y-2">
      <h3 className="text-lg font-semibold text-gray-900">No hay conversaciones</h3>
      <p className="text-sm text-gray-500 max-w-sm">
        Las conversaciones aparecerán aquí cuando los clientes te envíen mensajes
      </p>
    </div>
    <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2">
      <RefreshCw className="w-4 h-4" />
      Actualizar
    </Button>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="m-4">
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error al cargar conversaciones</AlertTitle>
      <AlertDescription className="space-y-2">
        <p>{error}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Reintentar
        </Button>
      </AlertDescription>
    </Alert>
  </div>
);

// Componente de Estado de Carga
const LoadingState = () => (
  <div className="space-y-0">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-start space-x-3 p-4 border-b">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Componente de Item de Chat Mejorado
interface ChatListItemProps {
  chat: GetAllConversationsResponse['conversations'][number];
  isSelected: boolean;
  onClick: () => void;
  onAction: (action: string, chatId: string) => void;
}

function ChatListItem({ chat, isSelected, onClick, onAction }: ChatListItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const messagePreview = getMessagePreview(chat.lastMessage);
  const clientName = chat.client?.name || 'Cliente desconocido';
  const clientInitials = clientName.substring(0, 2).toUpperCase();

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    onAction(action, chat.id);
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative w-full text-left border-b border-border transition-all duration-200",
          isSelected && "bg-blue-50 border-l-4 border-l-blue-500",
          isHovered && !isSelected && "bg-gray-50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="w-full px-4 py-3 flex items-start space-x-3"
          onClick={onClick}
          aria-label={`Conversación con ${clientName}`}
        >
          {/* Avatar con indicador de estado */}
          <div className="relative flex-shrink-0">
            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
              <AvatarImage
                src={chat.client?.photo}
                alt={clientName}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {clientInitials}
              </AvatarFallback>
            </Avatar>
            {chat.newClientMessagesCount > 0 && (
              <div className="absolute -top-1 -right-1 animate-pulse">
                <div className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-sm">
                  {chat.newClientMessagesCount > 9 ? '9+' : chat.newClientMessagesCount}
                </div>
              </div>
            )}
          </div>

          {/* Contenido del chat */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-2">
                <h3 className={cn(
                  "font-semibold truncate",
                  chat.newClientMessagesCount > 0 && "text-blue-900"
                )}>
                  {clientName}
                </h3>
                {chat.client?.phoneNumber && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Phone className="w-3 h-3 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{chat.client.phoneNumber}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center gap-1">
                <span className={cn(
                  "text-xs flex items-center gap-1",
                  chat.newClientMessagesCount > 0 ? "text-blue-600 font-medium" : "text-gray-500"
                )}>
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(chat.lastMessage.timestamp)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {messagePreview.hasMedia && (
                  <Badge variant="secondary" className="flex-shrink-0 h-5 px-1.5 text-xs">
                    {messagePreview.mediaType === 'image' && <Image className="w-3 h-3" />}
                    {messagePreview.mediaType === 'video' && <Video className="w-3 h-3" />}
                    {messagePreview.mediaType === 'audio' && <Mic className="w-3 h-3" />}
                    {messagePreview.mediaType === 'file' && <Paperclip className="w-3 h-3" />}
                  </Badge>
                )}
                <p className={cn(
                  "text-sm truncate",
                  chat.newClientMessagesCount > 0 ? "text-gray-900 font-medium" : "text-gray-600"
                )}>
                  {chat.lastMessage.role === 'business' && (
                    <span className="text-gray-500">Tú: </span>
                  )}
                  {messagePreview.text}
                </p>
              </div>
            </div>
          </div>

          {/* Menú de acciones */}
          <div className={cn(
            "flex-shrink-0 transition-opacity duration-200",
            isHovered || isSelected ? "opacity-100" : "opacity-0 sm:opacity-0"
          )}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => handleAction(e, 'profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Ver perfil del cliente
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleAction(e, 'pin')}>
                  <Pin className="mr-2 h-4 w-4" />
                  Fijar conversación
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleAction(e, 'mute')}>
                  <BellOff className="mr-2 h-4 w-4" />
                  Silenciar notificaciones
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={(e) => handleAction(e, 'archive')}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archivar conversación
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleAction(e, 'delete')}
                  className="text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar conversación
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

interface ChatListProps {
  chats: GetAllConversationsResponse['conversations'];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
  isLoading = false,
  error = null,
  onRefresh = () => { },
  onLoadMore = () => { },
  hasMore = false
}: ChatListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAction = useCallback((action: string, chatId: string) => {
    switch (action) {
      case 'delete':
        setChatToDelete(chatId);
        setDeleteDialogOpen(true);
        break;
      case 'archive':
        setSuccessMessage('Conversación archivada');
        setTimeout(() => setSuccessMessage(null), 3000);
        break;
      case 'pin':
        setSuccessMessage('Conversación fijada');
        setTimeout(() => setSuccessMessage(null), 3000);
        break;
      case 'mute':
        setSuccessMessage('Notificaciones silenciadas');
        setTimeout(() => setSuccessMessage(null), 3000);
        break;
      case 'profile':
        // Implementar navegación al perfil
        break;
    }
  }, []);

  const handleDeleteConfirm = () => {
    if (chatToDelete) {
      // Implementar lógica de eliminación
      setSuccessMessage('Conversación eliminada');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
    setDeleteDialogOpen(false);
    setChatToDelete(null);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop === clientHeight && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  // Renderizar estados especiales
  if (isLoading && chats.length === 0) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={onRefresh} />;
  }

  if (!isLoading && chats.length === 0) {
    return <EmptyState onRefresh={onRefresh} />;
  }

  return (
    <>
      {/* Notificaciones de éxito */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2">
          <Alert className="w-auto shadow-lg border-green-200 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Barra de información */}
      <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <Shield className="w-4 h-4" />
          <span>Chats cifrados de extremo a extremo</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          disabled={isLoading}
          className="gap-1 text-blue-700 hover:text-blue-900"
        >
          <RefreshCw className={cn("w-3 h-3", isLoading && "animate-spin")} />
          Actualizar
        </Button>
      </div>

      {/* Lista de chats */}
      <ScrollArea
        className="flex-1 h-[calc(100vh-14rem)]"
        onScroll={handleScroll}
      >
        <div className="divide-y divide-border">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onChatSelect(chat.id)}
              onAction={handleAction}
            />
          ))}
        </div>

        {/* Indicador de carga adicional */}
        {isLoading && chats.length > 0 && (
          <div className="p-4 flex justify-center">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Cargando más conversaciones...
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Diálogo de confirmación de eliminación */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar conversación?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Se eliminarán todos los mensajes de esta conversación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
