import { SignedIn, SignedOut, UserButton, Waitlist } from "@clerk/clerk-react";
import { Button } from "./ui/button";
import Hero from "./ui/Hero";
import { Card } from "@/components/ui/card";
import { Check, X, Calendar, CalendarDays, MessageCircle, MessageSquare } from "lucide-react";

const Testimonials = () => {
    const testimonials = [
        {
            name: "Dr. María González",
            role: "Psicóloga Clínica",
            content: "Clara ha transformado mi práctica. Ahora puedo enfocarme completamente en mis pacientes mientras ella se encarga de toda la gestión administrativa.",
            avatar: "MG"
        },
        {
            name: "Dr. Carlos Ruiz",
            role: "Psicólogo Infantil",
            content: "La integración con WhatsApp es perfecta. Mis pacientes se sienten cómodos comunicándose y yo tengo todo organizado automáticamente.",
            avatar: "CR"
        },
        {
            name: "Dra. Ana López",
            role: "Terapia de Pareja",
            content: "Increíble cómo Clara mantiene el tono profesional y empático en cada conversación. Es como tener una asistente perfecta 24/7.",
            avatar: "AL"
        }
    ];

    return (
        <section id="testimonials" className="container mx-auto px-4 py-20 bg-gradient-to-br from-amber-50/70 via-stone-50/50 to-orange-50/70">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-stone-800 mb-4">
                    Psicólogos confían en Clara
                </h2>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    Únete a cientos de profesionales que ya están automatizando su práctica
                    y ofreciendo una mejor experiencia a sus pacientes.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {testimonials.map((testimonial, index) => (
                    <Card
                        key={index}
                        className="p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm bg-white/80 backdrop-blur-sm animate-fade-in"
                        style={{ animationDelay: `${index * 0.2}s` }}
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-600/80 to-orange-700/80 rounded-full flex items-center justify-center text-white font-bold mr-4">
                                {testimonial.avatar}
                            </div>
                            <div>
                                <h4 className="font-bold text-stone-800">{testimonial.name}</h4>
                                <p className="text-stone-600 text-sm">{testimonial.role}</p>
                            </div>
                        </div>
                        <p className="text-stone-700 leading-relaxed">"{testimonial.content}"</p>
                    </Card>
                ))}
            </div>
        </section>
    );
};

const Pricing = () => {
    const plans = [
        {
            name: "Básico",
            price: "1,599",
            period: "mes",
            description: "Psicólogos que inician",
            features: [
                { name: "Hasta 20 pacientes", included: true },
                { name: "WhatsApp personalizado", included: true },
                { name: "Respuestas automatizadas", included: true },
                { name: "Notas automáticas por cita", included: true },
                { name: "Resúmenes semanales", included: false },
                { name: "Recordatorios por WhatsApp", included: false },
                { name: "Soporte Prioritario", included: false },
                { name: "Atención personalizada para ajustes", included: false }
            ],
            pricePerPatient: "$79.95",
            popular: false,
            icon: "📱"
        },
        {
            name: "Estándar",
            price: "1,859",
            period: "mes",
            description: "Profesionales activos",
            features: [
                { name: "Hasta 50 pacientes", included: true },
                { name: "WhatsApp personalizado", included: true },
                { name: "Respuestas automatizadas", included: true },
                { name: "Notas automáticas por cita", included: true },
                { name: "Resúmenes semanales", included: true },
                { name: "Recordatorios por WhatsApp", included: true },
                { name: "Soporte Prioritario", included: false },
                { name: "Atención personalizada para ajustes", included: false }
            ],
            pricePerPatient: "$37.18",
            popular: true,
            icon: "⭐"
        },
        {
            name: "Premium",
            price: "2,293",
            period: "mes",
            description: "Clínicas o psicólogos top",
            features: [
                { name: "Hasta 100 pacientes", included: true },
                { name: "WhatsApp personalizado", included: true },
                { name: "Respuestas automatizadas", included: true },
                { name: "Notas automáticas por cita", included: true },
                { name: "Resúmenes semanales", included: true },
                { name: "Recordatorios por WhatsApp", included: true },
                { name: "Soporte Prioritario", included: true },
                { name: "Atención personalizada para ajustes", included: true }
            ],
            pricePerPatient: "$45.86",
            popular: false,
            icon: "👑"
        }
    ];

    return (
        <section id="pricing" className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-stone-800 mb-4">
                    Planes transparentes para cada necesidad
                </h2>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    Elige el plan que mejor se adapte a tu práctica profesional.
                    Todos incluyen prueba gratuita de 14 días.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {plans.map((plan, index) => (
                    <Card
                        key={index}
                        className={`p-8 text-center hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative ${plan.popular ? 'border-2 border-amber-600/60 shadow-xl scale-105 bg-gradient-to-br from-amber-50/90 to-orange-50/90' : 'border-0 shadow-lg bg-white/80'
                            } backdrop-blur-sm animate-fade-in`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        {plan.popular && (
                            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                <span className="bg-gradient-to-r from-amber-600/90 to-orange-700/90 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    Más Popular
                                </span>
                            </div>
                        )}

                        <div className="text-4xl mb-4">{plan.icon}</div>
                        <h3 className="text-2xl font-bold text-stone-800 mb-2">{plan.name}</h3>
                        <p className="text-stone-600 mb-6">{plan.description}</p>

                        <div className="mb-6">
                            <span className="text-4xl font-bold text-stone-800">${plan.price}</span>
                            <span className="text-stone-600"> MXN/{plan.period}</span>
                        </div>

                        <div className="mb-6 p-3 bg-gradient-to-r from-amber-50/80 to-orange-50/80 rounded-lg border border-amber-200/50">
                            <span className="text-sm text-amber-800">
                                Precio por paciente: <strong>{plan.pricePerPatient}</strong>
                            </span>
                        </div>

                        <Button
                            className={`w-full mb-8 ${plan.popular
                                ? 'bg-gradient-to-r from-amber-600/90 to-orange-700/90 hover:from-amber-700/90 hover:to-orange-800/90 text-white'
                                : 'bg-stone-700 text-white hover:bg-stone-800'
                                }`}
                        >
                            {plan.popular ? 'Comenzar Gratis' : 'Elegir Plan'}
                        </Button>

                        <div className="text-left space-y-4">
                            {plan.features.map((feature, featureIndex) => (
                                <div key={featureIndex} className="flex items-center justify-between">
                                    <span className="text-stone-700 text-sm">{feature.name}</span>
                                    {feature.included ? (
                                        <Check className="w-5 h-5 text-green-700/80 flex-shrink-0" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-600/80 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="text-center mt-12">
                <p className="text-stone-600 mb-4">
                    ¿Necesitas un plan personalizado para tu institución?
                </p>
                <Button variant="outline" className="border-stone-300 text-stone-700 hover:bg-stone-50">
                    Contactar Ventas
                </Button>
            </div>
        </section>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-stone-800 via-stone-900 to-amber-950 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Logo y descripción */}
                    <div className="md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-600/90 to-orange-700/90 rounded-lg flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">Clara</span>
                        </div>
                        <p className="text-stone-300 mb-6 max-w-md">
                            La asistente de IA que revoluciona la práctica psicológica.
                            Automatiza tu consulta y mejora la experiencia de tus pacientes.
                        </p>
                        <div className="flex space-x-4">
                            <MessageCircle className="w-6 h-6 text-stone-400 hover:text-amber-400 cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Enlaces */}
                    <div>
                        <h4 className="font-bold mb-4">Producto</h4>
                        <ul className="space-y-2 text-stone-300">
                            <li><a href="#" className="hover:text-white transition-colors">Características</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Precios</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Seguridad</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Integraciones</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-4">Soporte</h4>
                        <ul className="space-y-2 text-stone-300">
                            <li><a href="#" className="hover:text-white transition-colors">Centro de Ayuda</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentación</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Estado del Servicio</a></li>
                        </ul>
                    </div>
                </div>

                <hr className="border-stone-700 my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-stone-400 text-sm">
                        © 2024 Clara. Todos los derechos reservados.
                    </p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="text-stone-400 hover:text-white text-sm transition-colors">
                            Política de Privacidad
                        </a>
                        <a href="#" className="text-stone-400 hover:text-white text-sm transition-colors">
                            Términos de Servicio
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const Features = () => {
    const features = [
        {
            icon: MessageCircle,
            title: "Integración WhatsApp",
            description: "Conecta directamente con WhatsApp Business para comunicarte con tus pacientes de forma natural y automática.",
            color: "text-green-700/80",
            bgColor: "bg-green-50/80"
        },
        {
            icon: CalendarDays,
            title: "Agenda Inteligente",
            description: "Clara gestiona tu calendario automáticamente, agenda citas y envía recordatorios sin tu intervención.",
            color: "text-amber-700/80",
            bgColor: "bg-amber-50/80"
        },
        {
            icon: MessageSquare,
            title: "Conversaciones IA",
            description: "Responde preguntas frecuentes, recopila información inicial y mantiene un tono profesional y empático.",
            color: "text-orange-700/80",
            bgColor: "bg-orange-50/80"
        },
        {
            icon: Calendar,
            title: "Recordatorios Automáticos",
            description: "Envía recordatorios de citas, seguimientos post-consulta y mensajes de bienestar personalizados.",
            color: "text-stone-700/80",
            bgColor: "bg-stone-50/80"
        }
    ];

    return (
        <section id="features" className="container mx-auto px-4 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-stone-800 mb-4">
                    Todo lo que necesitas en una sola plataforma
                </h2>
                <p className="text-xl text-stone-600 max-w-2xl mx-auto">
                    Clara combina inteligencia artificial con las herramientas que ya usas
                    para crear la experiencia perfecta para ti y tus pacientes.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="p-6 text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-0 shadow-sm bg-white/80 backdrop-blur-sm animate-fade-in"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200/30`}>
                            <feature.icon className={`w-8 h-8 ${feature.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-stone-800 mb-3">{feature.title}</h3>
                        <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                    </Card>
                ))}
            </div>

            {/* Additional Feature Section */}
            <div className="mt-20 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-700/90 rounded-2xl p-12 text-white text-center">
                <h3 className="text-3xl font-bold mb-4">Integración sin complicaciones</h3>
                <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
                    Clara se integra con tu flujo de trabajo actual. No necesitas cambiar tus herramientas,
                    solo potenciarlas con inteligencia artificial.
                </p>
                <div className="grid md:grid-cols-3 gap-8 text-center">
                    <div>
                        <div className="text-4xl font-bold mb-2">5 min</div>
                        <div className="opacity-90">Tiempo de configuración</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">24/7</div>
                        <div className="opacity-90">Disponibilidad</div>
                    </div>
                    <div>
                        <div className="text-4xl font-bold mb-2">99%</div>
                        <div className="opacity-90">Precisión en citas</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const LandingPage = () => {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="border-b border-stone-200/60 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-amber-600/90 to-orange-700/90 rounded-lg flex items-center justify-center">
                            <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-stone-800">Clara</span>
                    </div>

                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-stone-600 hover:text-amber-700 transition-colors">Características</a>
                        <a href="#testimonials" className="text-stone-600 hover:text-amber-700 transition-colors">Testimonios</a>
                        <a href="#pricing" className="text-stone-600 hover:text-amber-700 transition-colors">Precios</a>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <SignedIn>
                            <UserButton
                                appearance={{
                                    elements: {
                                        avatarBox: "w-10 h-10"
                                    }
                                }}
                            />
                        </SignedIn>
                    </div>
                </div>
            </header>

            <Hero />

            <div className="bg-gradient-to-br from-stone-50/70 via-amber-50/50 to-orange-50/70">
                <Features />
                <Testimonials />
                <Pricing />
            </div>

            {/* Waitlist Section */}
            <SignedOut>
                <section className="py-16 bg-gradient-to-r from-amber-600/90 via-orange-600/90 to-amber-700/90">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                            ¿Listo para revolucionar tu práctica?
                        </h2>
                        <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
                            Únete a la lista de espera y sé uno de los primeros en experimentar el poder de Clara.
                        </p>
                        <Waitlist />
                    </div>
                </section>
            </SignedOut>

            <Footer />
        </div>
    );
};