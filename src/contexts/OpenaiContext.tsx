import { OpenAI } from 'openai'
import { createContext, useContext, type ReactNode } from 'react'

interface OpenaiContextType {
    openai: OpenAI
}

const OpenaiContext = createContext<OpenaiContextType | undefined>(undefined)

export const useOpenaiContext = () => {
    const context = useContext(OpenaiContext)
    if (!context) {
        throw new Error('useOpenaiContext must be used within OpenaiProvider')
    }
    return context
}

const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true })

export const OpenaiProvider = ({ children }: { children: ReactNode }) => {
    return (
        <OpenaiContext.Provider value={{ openai }}>
            {children}
        </OpenaiContext.Provider>
    )
}