import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
    Settings,
    Shield,
    Sparkles,
    Sun,
    Trash2,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
import { useOpenAIAssistant, useUpdateAssistant } from "../../hooks/useOpenAIAssistant";
import { RunParametersCard } from "./RunParametersCard";

export default function SettingsIndex() {
    const { data: assistant, isLoading: isAssistantLoading, error: assistantError, refetch } = useOpenAIAssistant();
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
                instructions: assistant.instructions?.split("Notas técnicas")[0] || "",
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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="container mx-auto p-4 lg:p-8">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <Settings className="w-6 h-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-semibold">Cargando configuración</h3>
                                <p className="text-muted-foreground">Preparando tu asistente personalizado...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (assistantError) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
                <div className="container mx-auto p-4 lg:p-8">
                    <div className="max-w-2xl mx-auto mt-20">
                        <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <AlertDescription className="text-red-800 dark:text-red-200">
                                <div className="space-y-3">
                                    <p className="font-medium">Error al cargar el asistente</p>
                                    <p className="text-sm">{assistantError.message}</p>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleRefresh}
                                        className="w-full sm:w-auto"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Reintentar
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
            {/* Hero Header */}
            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 z-40">
                <div className="container mx-auto p-4 lg:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-3 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl border border-primary/20">
                                    <Settings className="w-7 h-7 text-primary" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                                    Configuración
                                </h1>
                                <p className="text-sm lg:text-base text-muted-foreground mt-1">
                                    Personaliza tu asistente de IA y preferencias
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                onClick={handleRefresh}
                                disabled={isAssistantLoading}
                                className="flex-1 sm:flex-none"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isAssistantLoading ? 'animate-spin' : ''}`} />
                                Actualizar
                            </Button>
                            <Button
                                onClick={handleSaveAssistant}
                                disabled={!hasChanges || updateAssistantMutation.isPending}
                                className="flex-1 sm:flex-none gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
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
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto p-4 lg:p-8 pb-20">
                <div className="max-w-5xl mx-auto">
                    {/* Status Alerts */}
                    <div className="space-y-4 mb-8">
                        {updateAssistantMutation.isSuccess && (
                            <Alert className="border-green-200 bg-green-50/50 dark:bg-green-950/20 backdrop-blur-sm">
                                <Check className="w-4 h-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    ¡Asistente actualizado exitosamente!
                                </AlertDescription>
                            </Alert>
                        )}

                        {updateAssistantMutation.isError && (
                            <Alert className="border-red-200 bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm">
                                <AlertCircle className="w-4 h-4 text-red-600" />
                                <AlertDescription className="text-red-800 dark:text-red-200">
                                    Error al actualizar: {updateAssistantMutation.error?.message}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="assistant" className="space-y-8">
                        <div className="flex justify-center">
                            <TabsList className="grid w-full max-w-md grid-cols-3 h-12 p-1 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                                <TabsTrigger 
                                    value="assistant" 
                                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                                >
                                    <Bot className="w-4 h-4" />
                                    <span className="hidden sm:inline">Asistente</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="general" 
                                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                                >
                                    <Palette className="w-4 h-4" />
                                    <span className="hidden sm:inline">General</span>
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="privacy" 
                                    className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm"
                                >
                                    <Shield className="w-4 h-4" />
                                    <span className="hidden sm:inline">Privacidad</span>
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <TabsContent value="assistant" className="space-y-8">
                            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                                <CardHeader className="pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
                                            <Sparkles className="w-5 h-5 text-primary" />
                                        </div>
                                        Personalidad y Comportamiento
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Define cómo se comporta y responde tu asistente
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    {/* Instrucciones personalizadas */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="instructions" className="text-lg font-semibold">
                                                Instrucciones del Sistema
                                            </Label>
                                            <Badge variant="secondary" className="gap-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200">
                                                <Zap className="w-3 h-3" />
                                                Avanzado
                                            </Badge>
                                        </div>
                                        <Textarea
                                            id="instructions"
                                            value={assistantConfig.instructions}
                                            onChange={(e) => handleInputChange('instructions', e.target.value)}
                                            rows={6}
                                            placeholder="Define cómo quieres que se comporte tu asistente..."
                                            className="resize-none text-base bg-white/50 dark:bg-slate-800/50 border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm"
                                        />
                                        <Alert className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/50 dark:border-blue-800/50">
                                            <Info className="w-4 h-4 text-blue-600" />
                                            <AlertDescription className="text-blue-800 dark:text-blue-200">
                                                <strong>Consejo:</strong> Estas instrucciones definen el comportamiento base del asistente.
                                                Sé específico sobre el tono, estilo y tipo de respuestas que esperas.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50 rounded-xl shadow-xl">
                                <RunParametersCard />
                            </div>

                            {/* Nota informativa */}
                            <Alert className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm">
                                <Info className="w-5 h-5 text-blue-600" />
                                <AlertDescription className="text-blue-800 dark:text-blue-200 space-y-2">
                                    <p className="font-semibold">Configuración del Asistente vs Conversación</p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="space-y-1">
                                            <p className="font-medium">🤖 Configuración del Asistente</p>
                                            <p>Se aplica globalmente (nombre, instrucciones, modelo)</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="font-medium">💬 Parámetros de Conversación</p>
                                            <p>Se aplican a cada chat individual (temperatura, tokens)</p>
                                        </div>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        </TabsContent>

                        <TabsContent value="general" className="space-y-8">
                            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                                <CardHeader className="pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
                                            <Palette className="w-5 h-5 text-primary" />
                                        </div>
                                        Apariencia
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Personaliza el aspecto de la aplicación
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-4">
                                        <Label className="text-lg font-semibold">Tema</Label>
                                        <RadioGroup value={theme} onValueChange={setTheme}>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                                <Label htmlFor="light" className="cursor-pointer">
                                                    <Card className={`hover:bg-accent/50 transition-all duration-200 hover:scale-105 ${
                                                        theme === 'light' ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'bg-white/50 dark:bg-slate-800/50'
                                                    }`}>
                                                        <CardContent className="flex items-center gap-3 p-6">
                                                            <RadioGroupItem value="light" id="light" />
                                                            <Sun className="w-5 h-5 text-amber-500" />
                                                            <span className="font-medium">Claro</span>
                                                        </CardContent>
                                                    </Card>
                                                </Label>
                                                <Label htmlFor="dark" className="cursor-pointer">
                                                    <Card className={`hover:bg-accent/50 transition-all duration-200 hover:scale-105 ${
                                                        theme === 'dark' ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'bg-white/50 dark:bg-slate-800/50'
                                                    }`}>
                                                        <CardContent className="flex items-center gap-3 p-6">
                                                            <RadioGroupItem value="dark" id="dark" />
                                                            <Moon className="w-5 h-5 text-indigo-500" />
                                                            <span className="font-medium">Oscuro</span>
                                                        </CardContent>
                                                    </Card>
                                                </Label>
                                                <Label htmlFor="system" className="cursor-pointer">
                                                    <Card className={`hover:bg-accent/50 transition-all duration-200 hover:scale-105 ${
                                                        theme === 'system' ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'bg-white/50 dark:bg-slate-800/50'
                                                    }`}>
                                                        <CardContent className="flex items-center gap-3 p-6">
                                                            <RadioGroupItem value="system" id="system" />
                                                            <Laptop className="w-5 h-5 text-slate-500" />
                                                            <span className="font-medium">Sistema</span>
                                                        </CardContent>
                                                    </Card>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <Separator className="bg-slate-200/50 dark:bg-slate-700/50" />

                                    <div className="space-y-4">
                                        <Label className="text-lg font-semibold flex items-center gap-2">
                                            <Languages className="w-5 h-5 text-primary" />
                                            Idioma
                                        </Label>
                                        <RadioGroup value={language} onValueChange={setLanguage}>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <Label htmlFor="es" className="cursor-pointer">
                                                    <Card className={`hover:bg-accent/50 transition-all duration-200 ${
                                                        language === 'es' ? 'border-primary shadow-md ring-2 ring-primary/20' : 'bg-white/50 dark:bg-slate-800/50'
                                                    }`}>
                                                        <CardContent className="flex items-center gap-3 p-4">
                                                            <RadioGroupItem value="es" id="es" />
                                                            <span className="text-2xl">🇪🇸</span>
                                                            <span className="font-medium">Español</span>
                                                        </CardContent>
                                                    </Card>
                                                </Label>
                                                <Label htmlFor="en" className="cursor-pointer">
                                                    <Card className={`hover:bg-accent/50 transition-all duration-200 ${
                                                        language === 'en' ? 'border-primary shadow-md ring-2 ring-primary/20' : 'bg-white/50 dark:bg-slate-800/50'
                                                    }`}>
                                                        <CardContent className="flex items-center gap-3 p-4">
                                                            <RadioGroupItem value="en" id="en" />
                                                            <span className="text-2xl">🇺🇸</span>
                                                            <span className="font-medium">English</span>
                                                        </CardContent>
                                                    </Card>
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="privacy" className="space-y-8">
                            <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm border-slate-200/50 dark:border-slate-800/50 shadow-xl">
                                <CardHeader className="pb-6">
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg">
                                            <Shield className="w-5 h-5 text-primary" />
                                        </div>
                                        Privacidad y Datos
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        Controla cómo se manejan tus datos
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-8">
                                    <div className="space-y-6">
                                        <div className="flex items-start justify-between gap-6 p-6 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                                            <div className="space-y-2 flex-1">
                                                <Label htmlFor="saveHistory" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                                                    💾 Guardar historial de conversaciones
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Las conversaciones se guardan localmente en tu dispositivo para mejorar tu experiencia
                                                </p>
                                            </div>
                                            <Switch
                                                id="saveHistory"
                                                checked={saveHistory}
                                                onCheckedChange={setSaveHistory}
                                                className="shrink-0"
                                            />
                                        </div>

                                        <div className="flex items-start justify-between gap-6 p-6 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                                            <div className="space-y-2 flex-1">
                                                <Label htmlFor="analytics" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                                                    📊 Compartir análisis de uso
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Ayúdanos a mejorar el producto compartiendo datos anónimos de uso
                                                </p>
                                            </div>
                                            <Switch
                                                id="analytics"
                                                checked={analytics}
                                                onCheckedChange={setAnalytics}
                                                className="shrink-0"
                                            />
                                        </div>

                                        <Alert className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200/50 dark:border-green-800/50">
                                            <Shield className="w-4 h-4 text-green-600" />
                                            <AlertDescription className="text-green-800 dark:text-green-200">
                                                <div className="space-y-2">
                                                    <p className="font-semibold">🔒 Tu privacidad es importante</p>
                                                    <p className="text-sm">
                                                        Todos tus datos se almacenan localmente en tu dispositivo.
                                                        No compartimos información personal con terceros.
                                                    </p>
                                                </div>
                                            </AlertDescription>
                                        </Alert>

                                        <div className="pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                            <div className="space-y-4">
                                                <h4 className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-2">
                                                    <Trash2 className="w-4 h-4" />
                                                    Zona de peligro
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    Esta acción eliminará permanentemente todos tus datos locales.
                                                </p>
                                                <Button
                                                    variant="destructive"
                                                    className="gap-2"
                                                    onClick={() => {
                                                        if (confirm("¿Estás seguro de que quieres borrar todos tus datos? Esta acción no se puede deshacer.")) {
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
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}