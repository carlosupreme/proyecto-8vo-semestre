// hooks/useRunConfiguration.ts
import { useEffect, useState } from 'react';
import { useOpenaiContext } from "../contexts/OpenaiContext";
import { useGetUser } from "../domains/account/hooks/useGetUser";

export interface RunConfiguration {
    temperature: number;
    max_tokens: number;
    top_p: number;
    frequency_penalty: number;
    presence_penalty: number;
}

const DEFAULT_RUN_CONFIG: RunConfiguration = {
    temperature: 0.7,
    max_tokens: 2048,
    top_p: 1.0,
    frequency_penalty: 0,
    presence_penalty: 0
};

export function useRunConfiguration() {
    const [runConfig, setRunConfig] = useState<RunConfiguration>(DEFAULT_RUN_CONFIG);

    // Cargar configuración desde localStorage
    useEffect(() => {
        const saved = localStorage.getItem('runConfiguration');
        if (saved) {
            try {
                const parsedConfig = JSON.parse(saved);
                setRunConfig({ ...DEFAULT_RUN_CONFIG, ...parsedConfig });
            } catch (error) {
                console.error('Error parsing run configuration:', error);
            }
        }
    }, []);

    const updateRunConfig = (updates: Partial<RunConfiguration>) => {
        const newConfig = { ...runConfig, ...updates };
        setRunConfig(newConfig);
        localStorage.setItem('runConfiguration', JSON.stringify(newConfig));
    };

    const resetToDefaults = () => {
        setRunConfig(DEFAULT_RUN_CONFIG);
        localStorage.setItem('runConfiguration', JSON.stringify(DEFAULT_RUN_CONFIG));
    };

    return {
        runConfig,
        updateRunConfig,
        resetToDefaults
    };
}

// Hook para crear un run con la configuración actual
export function useCreateAssistantRun() {
    const { openai } = useOpenaiContext();
    const { data: user } = useGetUser();
    const { runConfig } = useRunConfiguration();

    return async (threadId: string, message?: string) => {
        const assistantId = user?.assistantConfig?.id;
        if (!assistantId) {
            throw new Error("No assistant ID found");
        }

        try {
            // Si hay un mensaje, agregarlo al thread primero
            if (message) {
                await openai.beta.threads.messages.create(threadId, {
                    role: "user",
                    content: message
                });
            }

            // Crear el run con la configuración actual
            const run = await openai.beta.threads.runs.create(threadId, {
                assistant_id: assistantId,
                temperature: runConfig.temperature,
                max_completion_tokens: runConfig.max_tokens,
                top_p: runConfig.top_p,
            });

            return run;
        } catch (error) {
            throw new Error(`Failed to create run`);
        }
    };
}