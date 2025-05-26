import { createFileRoute } from '@tanstack/react-router'
import Chats from '../domains/chats'

export const Route = createFileRoute('/chats')({
  component: Chats,
})
