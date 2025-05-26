import { useMutation, useQueryClient } from "@tanstack/react-query";
import { waapiService } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";
import { WHATSAPP_QUERY_KEY } from "./useWhatsAppData";
import { CLIENT_STATUS_QUERY_KEY } from "./useClientStatus";
import { CLIENT_INFO_QUERY_KEY } from "./useClientInfo";

export function useLogoutWhatsApp() {
  const { data: user } = useGetUser();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      if (!user) throw Error("User not found");
      
      return await waapiService.logout(user.instanceId);
    },
    onSuccess: () => {
      // Invalidate related queries to refresh data after logout
      queryClient.invalidateQueries({ queryKey: WHATSAPP_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CLIENT_STATUS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: CLIENT_INFO_QUERY_KEY });
    }
  });
}
