import type {Client} from "../clients/types"

export type Media = {
    url: string
    type: string
    caption?: string
    filename?: string
    mimetype?: string
}

export type Message = {
    id: string
    content: string
    role: Role
    timestamp: number
    media?: Media
    editedAt?: number
    status?: string
    reactions?: { [emoji: string]: string[] }
    replyTo?: string
}

export type Role = 'user' | 'assistant' | 'business';

export type GetAllConversationsResponse = {
    conversations: {
        id: string,
        client: Client | undefined,
        lastMessage: Message,
        newClientMessagesCount: number,
    }[],
    meta: {
        perPage: number,
        pageNumber: number,
        total: number,
        hasNextPage: boolean,
        nextPage: number
    }
}

export type OpenAIThreadAssistant = {
    id: string;
    enabled: boolean;
}

export type Conversation = {
    id: string;
    clientId: string;
    businessId: string;
    messages: Message[];
    thread: OpenAIThreadAssistant;
    newClientMessagesCount: number;
}

export type GetConversationByIdResponse = Conversation & {
    client: Client | undefined
}