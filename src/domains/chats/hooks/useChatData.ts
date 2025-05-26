import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../../hooks/useApi";
import { useWebSocket } from "../../../hooks/useWebSocket";
import type { GetAllConversationsResponse, GetConversationByIdResponse } from "../types";

export const CHATS_QUERY_KEY = 'chats' as const

const fetchChats = async (): Promise<GetAllConversationsResponse> => {
  const api = useApi()

  const response = await api.get<GetAllConversationsResponse>('/chats')

  return response.data
};

const fetchChatById = async (chatId: string): Promise<GetConversationByIdResponse> => {
  const api = useApi()

  const response = await api.get<GetConversationByIdResponse>(`/chats/${chatId}`)

  return response.data
}

export const useChats = () => {
  return useQuery({
    queryKey: [CHATS_QUERY_KEY],
    queryFn: fetchChats,
  });
};

export const useChatById = (chatId: string) => {
  return useQuery({
    queryKey: [CHATS_QUERY_KEY, chatId],
    queryFn: () => fetchChatById(chatId),
  });
}

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { sendMessage } = useWebSocket();

  return useMutation({
    mutationFn: async ({ chatId, message }: { chatId: string; message: string }) => {
      sendMessage({ conversationId: chatId, message })
    },
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [CHATS_QUERY_KEY, variables.chatId],
      })

      void queryClient.invalidateQueries({
        queryKey: [CHATS_QUERY_KEY],
      })
    },
  });
};
