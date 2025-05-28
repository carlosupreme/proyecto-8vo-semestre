import { io } from "socket.io-client"
import { toast } from "sonner"
import queryClient from "./queryClient";
import type { Message } from "../domains/chats/types";
import { WHATSAPP_QUERY_KEY, type WhatsAppData } from "../domains/chats/hooks/useWhatsAppData";

export const socket = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000')

socket.on(
    'newClientMessage',
    async (_data: { conversationId: string; message: Message }) => {
        await queryClient.invalidateQueries({
            queryKey: ['chats'],
        })
    }
)

socket.on('assistantFailed', (_data: { conversationId: string }) => {
    toast.error('El asistente tuvo un problema al ejecutar una accion')
})

socket.on('newAppointmentCreated', () => {
    toast.success('Una nueva cita ha sido creada.')
})

// socket.on('creditsUpdated', async () => {
//     await queryClient.refetchQueries({
//         queryKey: UserQueryKey,
//     })
// })

socket.on('qrStatus', (data) => {
    queryClient.setQueryData(WHATSAPP_QUERY_KEY, (whatsAppData: WhatsAppData) => {
        if (!whatsAppData) return whatsAppData;
        return { ...whatsAppData, qr: data }
    })
})

socket.on('ready', () => {
    toast.success('WhatsApp listo para recibir mensajes')
    queryClient.invalidateQueries(  {
        queryKey: WHATSAPP_QUERY_KEY,
    })
})
    