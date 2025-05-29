// components/RunParametersCard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gauge, RotateCcw, Info } from "lucide-react";
import { useRunConfiguration } from "../../hooks/useRunConfiguration";


export function RunParametersCard() {
    const { runConfig, updateRunConfig, resetToDefaults } = useRunConfiguration();

    const getTemperatureDescription = (value: number) => {
        if (value <= 0.3) return "Muy preciso y consistente";
        if (value <= 0.5) return "Balanceado";
        if (value <= 0.7) return "Creativo y variado";
        return "Muy creativo e impredecible";
    };

    const getTopPDescription = (value: number) => {
        if (value <= 0.5) return "Respuestas más enfocadas";
        if (value <= 0.8) return "Balance entre diversidad y coherencia";
        return "Máxima diversidad de respuestas";
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Gauge className="w-5 h-5" />
                    Parámetros de Conversación
                </CardTitle>
                <CardDescription>
                    Ajusta cómo responde el asistente en cada conversación
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <Alert>
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                        Estos parámetros se aplican a cada nueva conversación con el asistente, 
                        no al asistente en sí. Ajústalos según el tipo de respuestas que prefieras.
                    </AlertDescription>
                </Alert>

                {/* Temperatura */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Creatividad (Temperature)
                        </Label>
                        <span className="text-sm font-medium text-primary">
                            {runConfig.temperature}
                        </span>
                    </div>
                    <Slider
                        value={[runConfig.temperature]}
                        onValueChange={([value]) => updateRunConfig({ temperature: value })}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Preciso</span>
                        <span>Creativo</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        {getTemperatureDescription(runConfig.temperature)}
                    </p>
                </div>

                {/* Max Tokens */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Longitud Máxima de Respuesta
                        </Label>
                        <span className="text-sm font-medium text-primary">
                            {runConfig.max_tokens} tokens
                        </span>
                    </div>
                    <Slider
                        value={[runConfig.max_tokens]}
                        onValueChange={([value]) => updateRunConfig({ max_tokens: value })}
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
                        value={(runConfig.max_tokens / 4096) * 100} 
                        className="h-2"
                    />
                </div>

                {/* Top P */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Diversidad de Vocabulario (Top P)
                        </Label>
                        <span className="text-sm font-medium text-primary">
                            {runConfig.top_p}
                        </span>
                    </div>
                    <Slider
                        value={[runConfig.top_p]}
                        onValueChange={([value]) => updateRunConfig({ top_p: value })}
                        min={0.1}
                        max={1.0}
                        step={0.1}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Enfocado</span>
                        <span>Diverso</span>
                    </div>
                    <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                        {getTopPDescription(runConfig.top_p)}
                    </p>
                </div>

                {/* Frequency Penalty */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Penalización por Repetición
                        </Label>
                        <span className="text-sm font-medium text-primary">
                            {runConfig.frequency_penalty}
                        </span>
                    </div>
                    <Slider
                        value={[runConfig.frequency_penalty]}
                        onValueChange={([value]) => updateRunConfig({ frequency_penalty: value })}
                        min={-2.0}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Más repetición</span>
                        <span>Menos repetición</span>
                    </div>
                </div>

                {/* Presence Penalty */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">
                            Penalización por Presencia
                        </Label>
                        <span className="text-sm font-medium text-primary">
                            {runConfig.presence_penalty}
                        </span>
                    </div>
                    <Slider
                        value={[runConfig.presence_penalty]}
                        onValueChange={([value]) => updateRunConfig({ presence_penalty: value })}
                        min={-2.0}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Más uso de temas previos</span>
                        <span>Más temas nuevos</span>
                    </div>
                </div>

                {/* Botón para resetear */}
                <div className="pt-4 border-t">
                    <Button 
                        variant="outline" 
                        onClick={resetToDefaults}
                        className="gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Restaurar valores por defecto
                    </Button>
                </div>

                {/* Indicadores de valores actuales */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                    <Badge variant="secondary" className="justify-center">
                        Temp: {runConfig.temperature}
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                        Tokens: {runConfig.max_tokens}
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                        Top P: {runConfig.top_p}
                    </Badge>
                    <Badge variant="secondary" className="justify-center">
                        Freq: {runConfig.frequency_penalty}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}