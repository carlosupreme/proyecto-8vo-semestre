import { useQuery } from "@tanstack/react-query";
import { useApi } from "../../../hooks/useApi";
import type { Tag } from "../types";

export const TAGS_QUERY_KEY = ['tags'] as const;

export const useGetTags = () => {
    const api = useApi()

    return useQuery({
        queryKey: TAGS_QUERY_KEY,
        queryFn: async () => {
            const response = await api.get<Tag[]>("tags");
            return response.data;
        },
        initialData: []
    });
};