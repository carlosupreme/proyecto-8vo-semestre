import { createFileRoute } from '@tanstack/react-router'
import ChatSettings  from '../domains/settings/ChatSettings'

export const Route = createFileRoute('/cuenta')({
  component: ChatSettings,
})
