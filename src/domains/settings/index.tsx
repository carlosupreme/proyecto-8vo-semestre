import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function Settings() {
    const [assistantConfig, setAssistantConfig] = useState({
        name: "Clara",
        prompt: "Eres Clara, una asistente virtual amigable y servicial. Tu objetivo es ayudar al usuario con sus tareas y responder a sus preguntas de manera clara y concisa.",
        temperature: "0.7",
        maxTokens: "2048"
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAssistantConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Aquí se implementaría la lógica para guardar la configuración
        // Por ejemplo, guardar en localStorage o enviar a un API
        localStorage.setItem("assistantConfig", JSON.stringify(assistantConfig));
        alert("Configuración guardada con éxito");
    };

    return (
        <div className="container mx-auto p-6 pb-20 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Configuración</h1>
            </div>
            
            <Separator />
            
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold mb-4">General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label htmlFor="theme" className="block text-sm font-medium">
                                Tema
                            </label>
                            <select 
                                id="theme" 
                                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                            >
                                <option value="light">Claro</option>
                                <option value="dark">Oscuro</option>
                                <option value="system">Sistema</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="language" className="block text-sm font-medium">
                                Idioma
                            </label>
                            <select 
                                id="language" 
                                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs"
                            >
                                <option value="es">Español</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <Separator />
                
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <h2 className="text-xl font-semibold">Configuración del Asistente</h2>
                        <Badge variant="secondary">Personalizable</Badge>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm font-medium">
                                Nombre del Asistente
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={assistantConfig.name}
                                onChange={handleChange}
                                placeholder="Nombre de tu asistente"
                            />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label htmlFor="temperature" className="block text-sm font-medium">
                                    Temperatura
                                    <span className="text-xs text-muted-foreground ml-1">
                                        (0.1 - 1.0)
                                    </span>
                                </label>
                                <Input
                                    id="temperature"
                                    name="temperature"
                                    type="number"
                                    min="0.1"
                                    max="1.0"
                                    step="0.1"
                                    value={assistantConfig.temperature}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Valores más bajos generan respuestas más predecibles, valores más altos más creativas.
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <label htmlFor="maxTokens" className="block text-sm font-medium">
                                    Máximo de Tokens
                                </label>
                                <Input
                                    id="maxTokens"
                                    name="maxTokens"
                                    type="number"
                                    min="256"
                                    max="4096"
                                    step="256"
                                    value={assistantConfig.maxTokens}
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Limita la longitud de las respuestas generadas.
                                </p>
                            </div>
                        </div>
                        
                        <div className="space-y-2">
                            <label htmlFor="prompt" className="block text-sm font-medium">
                                Prompt del Asistente
                                <span className="text-xs text-muted-foreground ml-1">
                                    (Personaliza el comportamiento)
                                </span>
                            </label>
                            <Textarea
                                id="prompt"
                                name="prompt"
                                value={assistantConfig.prompt}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Describe cómo quieres que se comporte tu asistente"
                                className="min-h-[150px]"
                            />
                            <p className="text-xs text-muted-foreground">
                                Define la personalidad y comportamiento de tu asistente. Sé específico sobre cómo quieres que responda.
                            </p>
                        </div>
                        
                        <div className="flex justify-end">
                            <Button onClick={handleSave}>
                                Guardar Configuración
                            </Button>
                        </div>
                    </div>
                </div>
                
                <Separator />
                
                <div>
                    <h2 className="text-xl font-semibold mb-4">Privacidad y Datos</h2>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="saveHistory"
                                className="mt-1"
                            />
                            <div>
                                <label htmlFor="saveHistory" className="block text-sm font-medium">
                                    Guardar historial de conversaciones
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Tus conversaciones se guardarán localmente para referencia futura.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="analytics"
                                className="mt-1"
                            />
                            <div>
                                <label htmlFor="analytics" className="block text-sm font-medium">
                                    Compartir datos anónimos de uso
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Ayúdanos a mejorar compartiendo datos anónimos de uso.
                                </p>
                            </div>
                        </div>
                        
                        <Button variant="outline" className="text-destructive">
                            Borrar todos los datos
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}