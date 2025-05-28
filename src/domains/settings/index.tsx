import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
    Bot,
    Brain,
    Briefcase,
    Check,
    Gauge,
    Heart,
    Info,
    Languages,
    Laptop,
    Moon,
    Palette,
    Save,
    SettingsIcon,
    Shield,
    Sparkles,
    Sun,
    Trash2,
    Zap
} from "lucide-react";
import { useState } from "react";

export function Settings() {
    const [assistantConfig, setAssistantConfig] = useState({
        name: "Clara",
        prompt: "Eres Clara, una asistente virtual amigable y servicial. Tu objetivo es ayudar al usuario con sus tareas y responder a sus preguntas de manera clara y concisa.",
        temperature: 0.7,
        maxTokens: 2048,
        avatar: "friendly",
        personality: "friendly"
    });

    const [theme, setTheme] = useState("system");
    const [language, setLanguage] = useState("es");
    const [saveHistory, setSaveHistory] = useState(true);
    const [analytics, setAnalytics] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const personalities = [
        { 
            id: "friendly", 
            name: "Amigable", 
            icon: <Heart className="w-4 h-4" />, 
            description: "Cálido y cercano",
            prompt: "Eres un asistente amigable y servicial. Tu objetivo es ayudar con calidez y empatía."
        },
        { 
            id: "professional", 
            name: "Profesional", 
            icon: <Briefcase className="w-4 h-4" />, 
            description: "Formal y eficiente",
            prompt: "Eres un asistente profesional y eficiente. Proporcionas respuestas claras y concisas."
        },
        { 
            id: "creative", 
            name: "Creativo", 
            icon: <Sparkles className="w-4 h-4" />, 
            description: "Innovador y original",
            prompt: "Eres un asistente creativo e innovador. Ofreces soluciones originales y pensamiento lateral."
        },
        { 
            id: "technical", 
            name: "Técnico", 
            icon: <Brain className="w-4 h-4" />, 
            description: "Preciso y detallado",
            prompt: "Eres un asistente técnico y preciso. Proporcionas información detallada y exacta."
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAssistantConfig(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        localStorage.setItem("assistantConfig", JSON.stringify(assistantConfig));
        localStorage.setItem("appSettings", JSON.stringify({ theme, language, saveHistory, analytics }));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handlePersonalityChange = (personalityId: string) => {
        const personality = personalities.find(p => p.id === personalityId);
        if (personality) {
            setAssistantConfig(prev => ({
                ...prev,
                personality: personalityId,
                prompt: personality.prompt
            }));
        }
    };

    const getTemperatureDescription = (value: number) => {
        if (value <= 0.3) return "Muy preciso y consistente";
        if (value <= 0.5) return "Balanceado";
        if (value <= 0.7) return "Creativo y variado";
        return "Muy creativo e impredecible";
    };

    return (
        <div className="container mx-auto p-6 pb-20 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <SettingsIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Configuración</h1>
                        <p className="text-sm text-muted-foreground">Personaliza tu experiencia</p>
                    </div>
                </div>
                <Button 
                    onClick={handleSave} 
                    className="gap-2"
                    variant={saveSuccess ? "default" : "default"}
                >
                    {saveSuccess ? (
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

            {saveSuccess && (
                <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
                    <Check className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-200">
                        ¡Configuración guardada exitosamente!
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
                                Personaliza tu Asistente
                            </CardTitle>
                            <CardDescription>
                                Dale una personalidad única a tu asistente de IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Preview del asistente */}
                            <div className="bg-muted/50 rounded-lg p-6 text-center space-y-3">
                                <Avatar className="w-20 h-20 mx-auto">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/bottts/svg?seed=${assistantConfig.name}`} />
                                    <AvatarFallback>{assistantConfig.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-lg">{assistantConfig.name}</h3>
                                    <p className="text-sm text-muted-foreground">Tu asistente personal</p>
                                </div>
                            </div>

                            {/* Nombre del asistente */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-base font-medium">
                                    Nombre del Asistente
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={assistantConfig.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Clara, Max, Luna..."
                                    className="text-lg"
                                />
                            </div>

                            {/* Personalidad */}
                            <div className="space-y-3">
                                <Label className="text-base font-medium">
                                    Personalidad
                                </Label>
                                <RadioGroup 
                                    value={assistantConfig.personality}
                                    onValueChange={handlePersonalityChange}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                >
                                    {personalities.map((personality) => (
                                        <Label
                                            key={personality.id}
                                            htmlFor={personality.id}
                                            className="cursor-pointer"
                                        >
                                            <Card className={`hover:bg-accent transition-colors ${
                                                assistantConfig.personality === personality.id ? 'border-primary' : ''
                                            }`}>
                                                <CardContent className="flex items-start gap-3 p-4">
                                                    <RadioGroupItem value={personality.id} id={personality.id} />
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            {personality.icon}
                                                            <span className="font-medium">{personality.name}</span>
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">
                                                            {personality.description}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* Prompt personalizado */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="prompt" className="text-base font-medium">
                                        Instrucciones Personalizadas
                                    </Label>
                                    <Badge variant="secondary" className="gap-1">
                                        <Zap className="w-3 h-3" />
                                        Avanzado
                                    </Badge>
                                </div>
                                <Textarea
                                    id="prompt"
                                    name="prompt"
                                    value={assistantConfig.prompt}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe cómo quieres que se comporte tu asistente..."
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground flex items-start gap-1">
                                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                    Puedes agregar detalles específicos sobre cómo quieres que responda
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Gauge className="w-5 h-5" />
                                Parámetros de Respuesta
                            </CardTitle>
                            <CardDescription>
                                Ajusta cómo responde tu asistente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Temperatura */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">
                                        Creatividad
                                    </Label>
                                    <span className="text-sm font-medium text-primary">
                                        {assistantConfig.temperature}
                                    </span>
                                </div>
                                <Slider
                                    value={[assistantConfig.temperature]}
                                    onValueChange={([value]) => 
                                        setAssistantConfig(prev => ({ ...prev, temperature: value }))
                                    }
                                    min={0.1}
                                    max={1}
                                    step={0.1}
                                    className="w-full"
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Preciso</span>
                                    <span>Creativo</span>
                                </div>
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                                    {getTemperatureDescription(assistantConfig.temperature)}
                                </p>
                            </div>

                            {/* Max Tokens */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-medium">
                                        Longitud de Respuesta
                                    </Label>
                                    <span className="text-sm font-medium text-primary">
                                        {assistantConfig.maxTokens} tokens
                                    </span>
                                </div>
                                <Slider
                                    value={[assistantConfig.maxTokens]}
                                    onValueChange={([value]) => 
                                        setAssistantConfig(prev => ({ ...prev, maxTokens: value }))
                                    }
                                    min={256}
                                    max={4096}
                                    step={256}
                                    className="w-full"
                                />
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>Corto</span>
                                    <span>Largo</span>
                                </div>
                                <Progress 
                                    value={(assistantConfig.maxTokens / 4096) * 100} 
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
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
                                            <Card className={`hover:bg-accent transition-colors ${
                                                theme === 'light' ? 'border-primary' : ''
                                            }`}>
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <RadioGroupItem value="light" id="light" />
                                                    <Sun className="w-4 h-4" />
                                                    <span>Claro</span>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                        <Label htmlFor="dark" className="cursor-pointer">
                                            <Card className={`hover:bg-accent transition-colors ${
                                                theme === 'dark' ? 'border-primary' : ''
                                            }`}>
                                                <CardContent className="flex items-center gap-3 p-4">
                                                    <RadioGroupItem value="dark" id="dark" />
                                                    <Moon className="w-4 h-4" />
                                                    <span>Oscuro</span>
                                                </CardContent>
                                            </Card>
                                        </Label>
                                        <Label htmlFor="system" className="cursor-pointer">
                                            <Card className={`hover:bg-accent transition-colors ${
                                                theme === 'system' ? 'border-primary' : ''
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