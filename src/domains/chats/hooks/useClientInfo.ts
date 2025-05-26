import { useQuery } from "@tanstack/react-query";
import { waapiService, type WaapiClientInfo } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";

export const CLIENT_INFO_QUERY_KEY = ['client-info'] as const;

export function useClientInfo() {
  const { data: user } = useGetUser();
  
  return useQuery({
    queryKey: CLIENT_INFO_QUERY_KEY,
    queryFn: async () => {
      if (!user) throw Error("User not found");
      
      return await waapiService.clientInfo(user.instanceId);
    },
    staleTime: Infinity,
    enabled: !!user
  });
}
