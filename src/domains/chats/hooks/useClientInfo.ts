import { useQuery } from "@tanstack/react-query";
import { waapiService } from "../../../lib/waapi-service";
import { useGetUser } from "../../account/hooks/useGetUser";

export const WAAPI_CLIENT_INFO_QUERY_KEY = ['client-info'] as const;

export function useClientInfo() {
  const { data: user } = useGetUser();
  
  return useQuery({
    queryKey: WAAPI_CLIENT_INFO_QUERY_KEY,
    queryFn: async () => {
      if (!user) throw Error("User not found");
      
      return await waapiService.clientInfo(user.instanceId);
    },
    staleTime: Infinity,
    enabled: !!user
  });
}
