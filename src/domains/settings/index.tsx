import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertCircle,
    Bot,
    Check,
    Info,
    Languages,
    Laptop,
    Loader2,
    Moon,
    Palette,
    RefreshCw,
    Save,
    SettingsIcon,
    Shield,
    Sun,
    Trash2
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAvailableModels, useOpenAIAssistant, useUpdateAssistant } from "../../hooks/useOpenAIAssistant";
import { RunParametersCard } from "./RunParametersCard";

export function Settings() {
    const { data: assistant, isLoading: isAssistantLoading, error: assistantError, refetch } = useOpenAIAssistant();
    const { data: availableModels, isLoading: isModelsLoading } = useAvailableModels();
    const updateAssistantMutation = useUpdateAssistant();

    const [assistantConfig, setAssistantConfig] = useState({
        name: "",
        instructions: "",
        model: "",
        description: "",
        personality: "friendly"
    });

    const [theme, setTheme] = useState("system");
    const [language, setLanguage] = useState("es");
    const [saveHistory, setSaveHistory] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Sincronizar con datos del asistente
    useEffect(() => {
        if (assistant) {
            setAssistantConfig({
                name: assistant.name || "",
                instructions: assistant.instructions || "",
                model: assistant.model || "",
                description: assistant.description || "",
                personality: assistant.metadata?.personality || "friendly"
            });
        }
    }, [assistant]);

    // Detectar cambios
    useEffect(() => {
        if (assistant) {
            const originalConfig = {
                name: assistant.name || "",
                instructions: assistant.instructions || "",
                model: assistant.model || "",
                description: assistant.description || "",
                personality: assistant.metadata?.personality || "friendly"
            };

            const hasConfigChanges = JSON.stringify(originalConfig) !== JSON.stringify(assistantConfig);
            setHasChanges(hasConfigChanges);
        }
    }, [assistant, assistantConfig]);


    const handleInputChange = (field: string, value: string) => {
        setAssistantConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };


    const handleSaveAssistant = async () => {
        try {
            await updateAssistantMutation.mutateAsync({
                name: assistantConfig.name,
                instructions: assistantConfig.instructions,
                model: assistantConfig.model,
                description: assistantConfig.description,
                metadata: {
                    personality: assistantConfig.personality
                }
            });

            // Guardar configuraciones locales
            localStorage.setItem("appSettings", JSON.stringify({ theme, language, saveHistory, analytics }));
        } catch (error) {
            console.error('Error saving assistant:', error);
        }
    };

    const handleRefresh = () => {
        refetch();
    };

    if (isAssistantLoading) {
        return (
            <div className="container mx-auto p-6 pb-20 max-w-6xl">
                <div className="flex items-center justify-center h-64">
                    <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <p>Cargando configuración del asistente...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (assistantError) {
        return (
            <div className="container mx-auto p-6 pb-20 max-w-6xl">
                <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                        Error al cargar el asistente: {assistantError.message}
                        <Button
                            variant="outline"
                            size="sm"
                            className="ml-3"
                            onClick={handleRefresh}
                        >
                            <RefreshCw className="w-4 h-4 mr-1" />
                            Reintentar
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 pb-20 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Configuración</h1>
                        <p className="text-sm text-muted-foreground">
                            Personaliza tu asistente de IA
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleRefresh}
                        disabled={isAssistantLoading}
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${isAssistantLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button
                        onClick={handleSaveAssistant}
                        disabled={!hasChanges || updateAssistantMutation.isPending}
                        className="gap-2"
                    >
                        {updateAssistantMutation.isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Guardando...
                            </>
                        ) : updateAssistantMutation.isSuccess ? (
                            <>
                                <Check className="w-4 h-4" />
                                Guardado
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Guardar cambios
                            </>
                        )}
                    </Button>
                </div>
            </div>

            {updateAssistantMutation.isSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
                    <Check className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        ¡Asistente actualizado exitosamente!
                    </AlertDescription>
                </Alert>
            )}

            {updateAssistantMutation.isError && (
                <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-950/20">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800 dark:text-red-200">
                        Error al actualizar: {updateAssistantMutation.error?.message}
                    </AlertDescription>
                </Alert>
            )}

            <Tabs defaultValue="assistant" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="assistant" className="gap-2">
                        <Bot className="w-4 h-4" />
                        Asistente
                    </TabsTrigger>
                    <TabsTrigger value="general" className="gap-2">
                        <Palette className="w-4 h-4" />
                        General
                    </TabsTrigger>
                    <TabsTrigger value="privacy" className="gap-2">
                        <Shield className="w-4 h-4" />
                        Privacidad
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="assistant" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bot className="w-5 h-5" />
                                Información del Asistente
                            </CardTitle>
                            <CardDescription>
                                Configuración básica de tu asistente de IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Modelo */}
                            <div className="space-y-2">
                                <Label className="text-base font-medium">
                                    Modelo de IA
                                </Label>
                                <Select
                                    value={assistantConfig.model}
                                    onValueChange={(value) => handleInputChange('model', value)}
                                    disabled={isModelsLoading}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={isModelsLoading ? "Cargando modelos..." : "Selecciona un modelo"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableModels?.map((model) => (
                                            <SelectItem key={model.id} value={model.id}>
                                                {model.id}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground">
                                    El modelo determina las capacidades y velocidad de respuesta
                                </p>
                            </div>
                        </CardContent>
                    </Card>



                    <RunParametersCard />

                    {/* Nota sobre la diferencia entre configuración de asistente y run */}
                    <Alert>
                        <Info className="w-4 h-4" />
                        <AlertDescription>
                            <strong>Configuración del Asistente vs Conversación:</strong><br />
                            • La configuración del asistente (nombre, instrucciones, modelo) se aplica globalmente<br />
                            • Los parámetros de conversación (temperatura, tokens) se aplican a cada chat individual<br />
                            • Ambos tipos de configuración trabajan juntos para personalizar tu experiencia
                        </AlertDescription>
                    </Alert>
                </TabsContent>

                <TabsContent value="general" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                Apariencia
                            </CardTitle>
                            <CardDescription>
                                Personaliza el aspecto de la aplicación
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-3">
                                <Label className="text-base font-medium">Tema</Label>
                                <RadioGroup value={theme} onValueChange={setTheme}>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <Label htmlFor="light" className="cursor-pointer">
                                            <Card className={`hover:bg-accent transition-colors ${theme === 'light' ? 'border-primary' : ''
                                                }`}>
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <RadioGroupItem value="light" id="light" />
                                                    <Sun className="w-4 h-4" />
                                                    <span>Claro</span>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                        <Label htmlFor="dark" className="cursor-pointer">
                                            <Card className={`hover:bg-accent transition-colors ${theme === 'dark' ? 'border-primary' : ''
                                                }`}>
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <RadioGroupItem value="dark" id="dark" />
                                                    <Moon className="w-4 h-4" />
                                                    <span>Oscuro</span>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                        <Label htmlFor="system" className="cursor-pointer">
                                            <Card className={`hover:bg-accent transition-colors ${theme === 'system' ? 'border-primary' : ''
                                                }`}>
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <RadioGroupItem value="system" id="system" />
                                                    <Laptop className="w-4 h-4" />
                                                    <span>Sistema</span>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    </div>
                                </RadioGroup>
                            </div>

                            <Separator />

                            <div className="space-y-3">
                                <Label className="text-base font-medium flex items-center gap-2">
                                    <Languages className="w-4 h-4" />
                                    Idioma
                                </Label>
                                <RadioGroup value={language} onValueChange={setLanguage}>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="es" id="es" />
                                            <Label htmlFor="es" className="font-normal cursor-pointer">
                                                Español
                                            </Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="en" id="en" />
                                            <Label htmlFor="en" className="font-normal cursor-pointer">
                                                English
                                            </Label>
                                        </div>
                                    </div>
                                </RadioGroup>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="privacy" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Shield className="w-5 h-5" />
                                Privacidad y Datos
                            </CardTitle>
                            <CardDescription>
                                Controla cómo se manejan tus datos
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-start justify-between space-x-4 py-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="saveHistory" className="text-base font-medium cursor-pointer">
                                            Guardar historial de conversaciones
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Las conversaciones se guardan localmente en tu dispositivo
                                        </p>
                                    </div>
                                    <Switch
                                        id="saveHistory"
                                        checked={saveHistory}
                                        onCheckedChange={setSaveHistory}
                                    />
                                </div>

                                <Separator />

                                <div className="flex items-start justify-between space-x-4 py-3">
                                    <div className="space-y-1">
                                        <Label htmlFor="analytics" className="text-base font-medium cursor-pointer">
                                            Compartir análisis de uso
                                        </Label>
                                        <p className="text-sm text-muted-foreground">
                                            Ayúdanos a mejorar compartiendo datos anónimos
                                        </p>
                                    </div>
                                    <Switch
                                        id="analytics"
                                        checked={analytics}
                                        onCheckedChange={setAnalytics}
                                    />
                                </div>

                                <Separator />

                                <Alert>
                                    <Info className="w-4 h-4" />
                                    <AlertDescription>
                                        Todos tus datos se almacenan localmente en tu dispositivo.
                                        No compartimos información personal con terceros.
                                    </AlertDescription>
                                </Alert>

                                <div className="pt-4">
                                    <Button
                                        variant="destructive"
                                        className="gap-2"
                                        onClick={() => {
                                            if (confirm("¿Estás seguro de que quieres borrar todos tus datos?")) {
                                                localStorage.clear();
                                                window.location.reload();
                                            }
                                        }}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Borrar todos los datos
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}