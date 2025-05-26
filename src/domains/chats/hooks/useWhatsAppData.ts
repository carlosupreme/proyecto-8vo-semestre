import { useQuery } from "@tanstack/react-query";
import { waapiService, type WaapiClientStatus } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";

export const WHATSAPP_QUERY_KEY = ['whatsapp'] as const

export type WhatsAppData = WaapiClientStatus & {
    qr: string;
}

export function useWhatsAppData() {
    const { data: user } = useGetUser();

    return useQuery({
        queryKey: WHATSAPP_QUERY_KEY,
        queryFn: async () => {
            if (!user) throw Error("User not found");

            const data = await waapiService.clientStatus(user.instanceId);
            const qr = await waapiService.qr(user.instanceId);
            return { ...data, qr: qr.data.qr_code }
        },
        staleTime: Infinity,
        enabled: !!user
    })
}