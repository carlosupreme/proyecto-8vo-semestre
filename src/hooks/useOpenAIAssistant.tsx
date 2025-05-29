import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AssistantUpdateParams } from 'openai/resources/beta/assistants.mjs';
import { useOpenaiContext } from "../contexts/OpenaiContext";
import { useGetUser } from "../domains/account/hooks/useGetUser";

export function useOpenAIAssistant() {
    const { openai } = useOpenaiContext()
    const { data: user, isLoading: isUserLoading, error: userError } = useGetUser()

    const assistantQuery = useQuery({
        queryKey: ['openai-assistant', user?.assistantConfig?.id],
        queryFn: async () => {
            const assistantId = user?.assistantConfig?.id
            if (!assistantId) {
                throw new Error("No assistant ID configured for this user")
            }

            try {
                const assistant = await openai.beta.assistants.retrieve(assistantId)
                return assistant
            } catch (error) {
                throw new Error(`Failed to retrieve assistant`)
            }
        },
        enabled: !!user?.assistantConfig?.id && !isUserLoading && !userError,
        retry: 2,
        staleTime: 5 * 60 * 1000,
    })

    return {
        ...assistantQuery,
        isUserLoading,
        userError,
    }
}

export function useUpdateAssistant() {
    const { openai } = useOpenaiContext()
    const { data: user } = useGetUser()
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (updateData: AssistantUpdateParams) => {
            const assistantId = user?.assistantConfig?.id
            if (!assistantId) {
                throw new Error("No assistant ID found")
            }

            try {
                const updatedAssistant = await openai.beta.assistants.update(
                    assistantId,
                    updateData
                )
                return updatedAssistant
            } catch (error) {
                throw new Error(`Failed to update assistant`)
            }
        },
        onSuccess: (updatedAssistant) => {
            // Actualizar el caché con los nuevos datos
            queryClient.setQueryData(
                ['openai-assistant', user?.assistantConfig?.id],
                updatedAssistant
            )

            // Invalidar queries relacionadas
            queryClient.invalidateQueries({
                queryKey: ['openai-assistant']
            })
        },
        onError: (error) => {
            console.error('Error updating assistant:', error)
        }
    })
}

// Hook adicional para obtener modelos disponibles
export function useAvailableModels() {
    const { openai } = useOpenaiContext()

    return useQuery({
        queryKey: ['openai-models'],
        queryFn: async () => {
            try {
                const models = await openai.models.list()
                // Filtrar solo modelos que soportan assistants
                return models.data.filter(model =>
                    model.id.includes('gpt-4') ||
                    model.id.includes('gpt-3.5') ||
                    model.id.includes('o1')
                )
            } catch (error) {
                throw new Error(`Failed to fetch models`)
            }
        },
        staleTime: 30 * 60 * 1000, // 30 minutos
    })
}