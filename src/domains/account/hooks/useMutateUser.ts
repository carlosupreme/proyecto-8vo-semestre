import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApi } from "../../../hooks/useApi";
import type { User } from "../types";
import { USER_QUERY_KEY } from "./useGetUser";
import { toast } from "sonner";

export function useMutateUser() {
    const api = useApi();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: Partial<User>) => {
            await api.put(`/auth/user`, data)
        },
        onSuccess: (_data, variables) => {
            void queryClient.invalidateQueries({
                queryKey: USER_QUERY_KEY,
            })

            if (variables.assistantConfig) {
                toast.success(variables.assistantConfig.enabled ? "IA Encendida" : "IA Apagada")
            }

        }
    })
}
