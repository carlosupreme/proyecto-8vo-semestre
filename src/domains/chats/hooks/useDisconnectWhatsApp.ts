import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { waapiService } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";
import { WAAPI_CLIENT_INFO_QUERY_KEY } from "./useClientInfo";
import { WHATSAPP_QUERY_KEY } from "./useWhatsAppData";

export function useDisconnectWhatsApp() {
    const { data: user } = useGetUser();
    const queryClient = useQueryClient();

    const { mutateAsync: disconnectWhatsApp } = useMutation({
        mutationFn: async () => {
            if (!user) throw Error("User not found");
            await waapiService.logout(user.instanceId);
        },
        onSuccess: () => {
            toast.success("WhatsApp desconectado");
        },
        onError: () => {
            toast.error("Error al desconectar WhatsApp");
        },
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEY });
            void queryClient.invalidateQueries({ queryKey: WAAPI_CLIENT_INFO_QUERY_KEY });
        }
    });

    return {
        disconnectWhatsApp
    }
}