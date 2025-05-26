import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
    AlertCircle,
    CheckCircle,
    MessageSquare,
    QrCode,
    RefreshCw
} from "lucide-react";
import { useEffect, useState } from "react";
import { useWhatsAppData } from "../../hooks/useWhatsAppData";

export function ConnectWhatsApp({ 
    open, 
    onOpenChange 
}: { 
    open: boolean; 
    onOpenChange: (open: boolean) => void 
}) {
    const { data, isLoading, error, refetch } = useWhatsAppData();
    const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
    const [isConnected] = useState(false);

    // Simulador de countdown para expiración del QR
    useEffect(() => {
        if (!data?.qr || isConnected) return;
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [data?.qr, isConnected]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleRefresh = () => {
        setTimeLeft(120);
        void refetch?.();
    };

    // Estados de la interfaz
    const renderContent = () => {
        // Estado de éxito
        if (isConnected) {
            return (
                <div className="flex flex-col items-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-green-800">
                            ¡WhatsApp conectado!
                        </h3>
                        <p className="text-sm text-green-600 mt-1">
                            Clara ya tiene acceso a tu WhatsApp
                        </p>
                    </div>
                </div>
            );
        }

        // Estado de error
        if (error) {
            return (
                <div className="flex flex-col items-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-red-800">
                            Error de conexión
                        </h3>
                        <p className="text-sm text-red-600 mt-1">
                            No se pudo generar el código QR
                        </p>
                    </div>
                    <Button 
                        onClick={handleRefresh}
                        variant="outline"
                        className="mt-4"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Intentar de nuevo
                    </Button>
                </div>
            );
        }

        // Estado de carga
        if (isLoading || !data?.qr) {
            return (
                <div className="flex flex-col items-center space-y-4 py-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">
                            Generando código QR...
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            Esto puede tomar unos segundos
                        </p>
                    </div>
                </div>
            );
        }

        // Estado principal con QR
        return (
            <div className="space-y-6">
                {/* QR Code Section */}
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        <div className="bg-white p-4 rounded-xl border-2 shadow-sm">
                            <img 
                                src={data.qr} 
                                alt="Código QR para conectar WhatsApp con Clara" 
                                className="w-48 h-48 sm:w-56 sm:h-56"
                            />
                        </div>
                        
                        {/* Countdown badge */}
                        <Badge 
                            variant={timeLeft < 30 ? "destructive" : "secondary"}
                            className="absolute -top-2 -right-2"
                        >
                            {formatTime(timeLeft)}
                        </Badge>
                    </div>

                    {timeLeft === 0 && (
                        <div className="text-center space-y-2">
                            <p className="text-sm text-red-600 font-medium">
                                El código QR ha expirado
                            </p>
                            <Button 
                                onClick={handleRefresh}
                                size="sm"
                                variant="outline"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Generar nuevo código
                            </Button>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Instructions */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <QrCode className="w-5 h-5 text-primary" />
                        <h4 className="font-semibold">Cómo conectar:</h4>
                    </div>
                    
                    <div className="space-y-3 text-sm">
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                1
                            </div>
                            <div>
                                <p className="font-medium">Abre WhatsApp en tu teléfono</p>
                                <p className="text-muted-foreground">
                                    Toca el menú (⋮) y selecciona "Dispositivos vinculados"
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                2
                            </div>
                            <div>
                                <p className="font-medium">Escanea este código QR</p>
                                <p className="text-muted-foreground">
                                    Toca "Vincular un dispositivo" y apunta la cámara al código
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                                3
                            </div>
                            <div>
                                <p className="font-medium">¡Listo!</p>
                                <p className="text-muted-foreground">
                                    Clara podrá acceder a tus conversaciones de WhatsApp
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security note */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                        <MessageSquare className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div className="text-xs text-blue-800">
                            <p className="font-medium">Conexión segura</p>
                            <p>Clara solo accede a los mensajes necesarios para ayudarte. Puedes desconectar en cualquier momento desde WhatsApp.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="space-y-3">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">
                                Conecta tu WhatsApp
                            </DialogTitle>
                            <DialogDescription>
                                Permite que Clara acceda a tus conversaciones para brindarte mejor asistencia
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-2">
                    {renderContent()}
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            {isConnected ? 'Continuar' : 'Cancelar'}
                        </Button>
                    </DialogClose>
                    
                    {!isConnected && !isLoading && !error && (
                        <Button 
                            onClick={handleRefresh}
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                        >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Actualizar código
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}