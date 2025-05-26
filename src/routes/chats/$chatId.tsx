import {createFileRoute} from '@tanstack/react-router'
import {ChatLayout} from "@/domains/chats";

export const Route = createFileRoute('/chats/$chatId')({
    component: ChatDetail,
})

function ChatDetail() {
    const {chatId} = Route.useParams()

    return (
        <ChatLayout
            chatId={chatId}
            showChatList={true}
            // En desktop: muestra lista + chat
            // En mobile: muestra solo el chat (la lista se oculta automáticamente)
        />
    )
}