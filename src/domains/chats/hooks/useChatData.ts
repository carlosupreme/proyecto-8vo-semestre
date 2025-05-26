import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useApi} from "@/hooks/useApi.ts";
import {useWebSocket} from "@/hooks/useWebSocket.ts";
import type {GetAllConversationsResponse, GetConversationByIdResponse} from "../types";
import type {AxiosInstance} from "axios";

export const CHATS_QUERY_KEY = 'chats' as const

const fetchChatById = async (api: AxiosInstance, chatId: string): Promise<GetConversationByIdResponse> => {
    const response = await api.get<GetConversationByIdResponse>(`/chats/${chatId}`)

    return response.data
}

const fetchChats = async (api: AxiosInstance): Promise<GetAllConversationsResponse> => {
    const response = await api.get<GetAllConversationsResponse>('/chats')
    console.log(response.data)
    return response.data
};

export const useChats = () => {
    const api = useApi()

    return useQuery({
        queryKey: [CHATS_QUERY_KEY],
        queryFn: async () => await fetchChats(api),
    });
};

export const useChatById = (chatId: string | undefined) => {
    const api = useApi()


    return useQuery({
        queryKey: [CHATS_QUERY_KEY, chatId],
        queryFn: async () => {
            if (!chatId) {
                throw new Error('Chat ID is required');
            }

            return await fetchChatById(api, chatId)
        },
        enabled: !!chatId,
    });
}

export const useSendMessage = () => {
    const queryClient = useQueryClient();
    const {sendMessage} = useWebSocket();

    return useMutation({
        mutationFn: async ({chatId, message}: { chatId: string; message: string }) => {
            sendMessage({conversationId: chatId, message})
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
