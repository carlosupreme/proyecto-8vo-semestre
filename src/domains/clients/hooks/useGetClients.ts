import { useApi } from "../../../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import type { Client } from "../types";

export const CLIENTS_QUERY_KEY = ['clients'] as const;

export function useGetClients() {
    const api = useApi();

    return useQuery({
        queryKey: CLIENTS_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get<Client[]>(`/clients`)

            return response.data;
        },
        staleTime: Infinity,
    })
}
