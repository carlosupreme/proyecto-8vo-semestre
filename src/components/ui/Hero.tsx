import { Button } from "@/components/ui/button";
import { MessageCircle, Calendar, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { SignedIn, } from "@clerk/clerk-react";
import { useNavigate } from "@tanstack/react-router";
import { AuroraBackground } from "./aurora-background";

const Hero = () => {
    const navigate = useNavigate();

    const handleAgendaClick = () => {
        navigate({ to: "/agenda" });
    };

    return (
        <AuroraBackground>
            <motion.div
                initial={{ opacity: 0.0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                    delay: 0.3,
                    duration: 0.8,
                    ease: "easeInOut",
                }}
                className="relative flex flex-col gap-8 items-center justify-center px-4 text-center z-10"
            >
                <div className="mb-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full bg-amber-50/90 backdrop-blur-sm text-amber-800 text-sm font-medium border border-amber-200/50">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        IA para Psicólogos
                    </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white leading-tight max-w-4xl">
                    Automatiza tu práctica con{" "}
                    <span className="bg-gradient-to-r from-amber-600/90 to-orange-700/90 bg-clip-text text-transparent">
                        Clara
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-stone-600 dark:text-neutral-200 max-w-3xl leading-relaxed font-light">
                    La asistente de IA que revoluciona tu consulta. Gestiona citas automáticamente
                    y mantén conversaciones inteligentes con tus pacientes a través de WhatsApp.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <SignedIn>
                        <Button
                            size="lg"
                            onClick={handleAgendaClick}
                            className="bg-gradient-to-r from-amber-600/90 to-orange-700/90 hover:from-amber-700/90 hover:to-orange-800/90 text-white px-8 py-4 text-lg hover:scale-[1.02] transition-all duration-200 shadow-lg"
                        >
                            <Calendar className="w-5 h-5 mr-2" />
                            Ir a la Agenda
                        </Button>
                    </SignedIn>

                    <Button
                        size="lg"
                        variant="outline"
                        className="border-stone-300 bg-white/80 backdrop-blur-sm text-stone-700 hover:bg-stone-50/90 hover:border-amber-300 px-8 py-4 text-lg hover:scale-[1.02] transition-all duration-200 shadow-lg"
                    >
                        <Calendar className="w-5 h-5 mr-2" />
                        Ver Demo
                    </Button>
                </div>

                {/* Feature Preview Cards */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mt-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5, duration: 0.6 }}
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-stone-200/30 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-green-50/80 rounded-full flex items-center justify-center border border-green-200/50">
                                <MessageCircle className="w-5 h-5 text-green-700/80" />
                            </div>
                            <span className="font-semibold text-stone-800">WhatsApp</span>
                        </div>
                        <p className="text-stone-600">"Hola, soy Clara. ¿Te gustaría agendar una cita?"</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-xl border border-stone-200/30 hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center space-x-3 mb-3">
                            <div className="w-8 h-8 bg-amber-50/80 rounded-full flex items-center justify-center border border-amber-200/50">
                                <Calendar className="w-5 h-5 text-amber-700/80" />
                            </div>
                            <span className="font-semibold text-stone-800">Agenda</span>
                        </div>
                        <p className="text-stone-600">Cita agendada para el 15 de Junio a las 3:00 PM</p>
                    </motion.div>
                </div>
            </motion.div>
        </AuroraBackground>
    );
};

export default Hero;