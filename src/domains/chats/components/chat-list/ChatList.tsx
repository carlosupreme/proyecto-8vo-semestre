import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, MessageSquare, RefreshCw } from 'lucide-react';
import React, { useCallback, useState, useEffect } from 'react';
import type { GetAllConversationsResponse } from "../../types"; // Asumo que estas rutas son correctas
import { ChatListItem } from "./ChatListItem"; // Importar el componente ChatListItem

// Componente de Estado Vacío
const EmptyState = ({ onRefresh }: { onRefresh: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full p-6 sm:p-8 text-center">
    <div className="p-3 sm:p-4 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
      <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 dark:text-gray-500" />
    </div>
    <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">No hay conversaciones</h3>
    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-xs sm:max-w-sm mb-4">
      Cuando los clientes te envíen mensajes, las conversaciones aparecerán aquí.
    </p>
    <Button onClick={onRefresh} variant="outline" size="sm" className="gap-2 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
      <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      Actualizar
    </Button>
  </div>
);

// Componente de Estado de Error
const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <div className="m-4">
    <Alert variant="destructive" className="dark:bg-red-900/30 dark:border-red-700">
      <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      <AlertTitle className="dark:text-red-300">Error al cargar</AlertTitle>
      <AlertDescription className="space-y-2 dark:text-red-400">
        <p>{error || "Ocurrió un error inesperado."}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="gap-2 mt-2 dark:text-gray-300 dark:border-red-700 dark:hover:bg-red-800/50">
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
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3 px-3 sm:px-4 py-3 border-b border-border dark:border-gray-700">
        <Skeleton className="w-10 h-10 sm:w-11 sm:h-11 rounded-full dark:bg-gray-700" />
        <div className="flex-1 space-y-1.5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20 sm:w-28 dark:bg-gray-700" />
            <Skeleton className="h-3 w-10 sm:w-12 dark:bg-gray-700" />
          </div>
          <Skeleton className="h-3.5 w-3/4 sm:w-4/5 dark:bg-gray-700" />
        </div>
      </div>
    ))}
  </div>
);


interface ChatListProps {
  chats: GetAllConversationsResponse['conversations'];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  isLoading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  onLoadMore?: () => void; // Asumo que esto se llama cuando se llega al final del scroll
  hasMore?: boolean; // Indica si hay más chats para cargar
  // Prop para manejar acciones desde ChatListItem (opcional, se puede manejar dentro de ChatList también)
  // onChatAction?: (action: string, chatId: string) => void; 
}

export function ChatList({
  chats,
  selectedChatId,
  onChatSelect,
  isLoading = false,
  error = null,
  onRefresh = () => { },
  onLoadMore = () => { },
  hasMore = false,
}: ChatListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [chatToAction, setChatToAction] = useState<string | null>(null); // Para cualquier acción que necesite confirmación o estado
  const [currentAction, setCurrentAction] = useState<string | null>(null); // Para saber qué acción se está realizando
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleAction = useCallback((action: string, chatId: string) => {
    setChatToAction(chatId);
    setCurrentAction(action);

    switch (action) {
      case 'delete':
        setDeleteDialogOpen(true);
        break;
      case 'archive':
        // Lógica para archivar (ej. llamar a API)
        console.log(`Archivar chat: ${chatId}`);
        showSuccessMessage('Conversación archivada');
        // Aquí podrías filtrar el chat de la lista localmente si la API no lo hace instantáneamente
        break;
      case 'pin':
        console.log(`Fijar chat: ${chatId}`);
        showSuccessMessage('Conversación fijada');
        // Lógica para fijar
        break;
      case 'mute':
        console.log(`Silenciar chat: ${chatId}`);
        showSuccessMessage('Notificaciones silenciadas');
        // Lógica para silenciar
        break;
      case 'profile':
        console.log(`Ver perfil del cliente del chat: ${chatId}`);
        // Aquí podrías navegar a otra vista o abrir un modal de perfil
        break;
      default:
        console.warn(`Acción desconocida: ${action}`);
    }
  }, []);

  const handleDeleteConfirm = () => {
    if (chatToAction) {
      console.log(`Eliminar chat confirmado: ${chatToAction}`);
      // Implementar lógica de eliminación (ej. llamar a API)
      showSuccessMessage('Conversación eliminada');
      // Aquí podrías filtrar el chat de la lista localmente
    }
    setDeleteDialogOpen(false);
    setChatToAction(null);
    setCurrentAction(null);
  };

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    // Cargar más cuando falten ~300px para llegar al final, o si ya se llegó
    const threshold = 300;
    if (target.scrollHeight - target.scrollTop - target.clientHeight < threshold && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [hasMore, isLoading, onLoadMore]);

  // Efecto para resetear el estado de acción si el diálogo se cierra por otros medios
  useEffect(() => {
    if (!deleteDialogOpen && currentAction === 'delete') {
      setChatToAction(null);
      setCurrentAction(null);
    }
  }, [deleteDialogOpen, currentAction]);

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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900"> {/* Contenedor principal para altura completa */}
      {successMessage && (
        <div className="fixed top-4 right-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <Alert className="w-auto shadow-lg border-green-200 bg-green-50 dark:bg-green-800/30 dark:border-green-700">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300 text-sm">
              {successMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <ScrollArea
        className="flex-1 w-full" // flex-1 para que ocupe el espacio disponible
        // h-[calc(100vh-VAR)] -> Si tienes una altura fija para el header/footer de la app.
        // Si ChatList es el único contenido de una sección que ya tiene altura definida,
        // className="h-full" o "flex-1" puede ser suficiente.
        onScroll={handleScroll}
      >
        {/* No es necesario el div con divide-y si ChatListItem ya tiene border-b */}
        <div className="w-full">
          {chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              isSelected={selectedChatId === chat.id}
              onClick={() => onChatSelect(chat.id)}
              onAction={handleAction} // Pasar la función de acción
            />
          ))}
        </div>

        {isLoading && chats.length > 0 && (
          <div className="p-3 sm:p-4 flex justify-center items-center">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
              Cargando más...
            </div>
          </div>
        )}
        {!isLoading && chats.length > 0 && !hasMore && (
          <div className="p-3 sm:p-4 text-center text-xs sm:text-sm text-gray-400 dark:text-gray-500">
            No hay más conversaciones.
          </div>
        )}
      </ScrollArea>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="dark:text-gray-100">¿Eliminar conversación?</AlertDialogTitle>
            <AlertDialogDescription className="dark:text-gray-400">
              Esta acción no se puede deshacer. Todos los mensajes de esta conversación se eliminarán permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}