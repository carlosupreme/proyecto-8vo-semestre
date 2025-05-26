import {createFileRoute} from '@tanstack/react-router'
import {ChatLayout} from "@/domains/chats";

export const Route = createFileRoute('/chats/')({
    component: ChatsIndex,
})

function ChatsIndex() {
    return (
        <ChatLayout showChatList={true}/>
    )
}