import type { Message } from "../domains/chats/types";
import { socket } from "../lib/web-socket";

export const useWebSocket = () => {
    const sendMessage = (data: { conversationId: string; message: string }) => {
        socket.emit('newBusinessMessage', {
            content: data.message,
            role: 'business',
            timestamp: Date.now()
        } satisfies Omit<Message, "id">)
    }

    const emit = (event: string, data: unknown) => {
        socket.emit(event, data)
    }

    return { sendMessage, emit }
}