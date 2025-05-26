import {AlertCircle, Check, CheckCheck, Clock} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

export const MessageStatus = ({status, isMe}: { status: string; isMe: boolean }) => {
    if (!isMe || !status) return null;

    const icons = {
        sending: <Clock className="w-3 h-3 animate-spin"/>,
        sent: <Check className="w-3 h-3"/>,
        delivered: <CheckCheck className="w-3 h-3"/>,
        read: <CheckCheck className="w-3 h-3 text-blue-500"/>,
        failed: <AlertCircle className="w-3 h-3 text-red-500"/>
    }[status];

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className="ml-1">{icons}</span>
            </TooltipTrigger>
            <TooltipContent>
                <p className="text-xs">
                    {status === 'sending' && 'Enviando...'}
                    {status === 'sent' && 'Enviado'}
                    {status === 'delivered' && 'Entregado'}
                    {status === 'read' && 'Leído'}
                    {status === 'failed' && 'Error al enviar'}
                </p>
            </TooltipContent>
        </Tooltip>
    );
};

