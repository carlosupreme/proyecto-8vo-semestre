import { useApi } from "../../../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import type { User } from "../types";

export const USER_QUERY_KEY = ['user'] as const;

export function useGetUser() {
    const api = useApi();

    return useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get<User>(`/auth/user`)

            return response.data;
        },
        staleTime: Infinity,
        retry: 3,
        retryDelay: 1000,
    })
}
