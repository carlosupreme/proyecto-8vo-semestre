import { useQuery } from "@tanstack/react-query";
import { waapiService, type WaapiClientStatus } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";

export const CLIENT_STATUS_QUERY_KEY = ['client-status'] as const;

export function useClientStatus() {
  const { data: user } = useGetUser();
  
  return useQuery({
    queryKey: CLIENT_STATUS_QUERY_KEY,
    queryFn: async () => {
      if (!user) throw Error("User not found");
      
      return await waapiService.clientStatus(user.instanceId);
    },
    staleTime: Infinity,
    enabled: !!user
  });
}
