'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Box, 
    Lamp, 
    MessageSquare, 
    CreditCard, 
    ArrowRight, 
    Type,
    ArrowLeft,
    CheckCircle2,
    Clock
} from 'lucide-react';
import LampConfigurator from './LampConfigurator';
import { useAuth } from '@/context/AuthContext';

const categories = [
    {
        id: 'CONTENITORI',
        title: 'Contenitori',
        description: 'Scatole personalizzate con incisioni e texture uniche.',
        icon: Box,
        color: 'bg-primary'
    },
    {
        id: 'LAMPADE',
        title: 'Lampade',
        description: 'Lampade 3D atmosferiche con le tue foto e scene.',
        icon: Lamp,
        color: 'bg-secondary'
    },
    {
        id: 'VIGNETTE',
        title: 'Vignette',
        description: 'Diorami in 3D che raccontano una storia.',
        icon: MessageSquare,
        color: 'bg-accent'
    },
    {
        id: 'BIGLIETTI_3D',
        title: 'Biglietti 3D',
        description: 'Biglietti d\'auguri che prendono vita.',
        icon: CreditCard,
        color: 'bg-stone-800'
    }
];

export default function CreaSuMisuraPage() {
    const { user, openLogin } = useAuth();
    const [step, setStep] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleCategorySelect = (id: string) => {
        if (!user) {
            openLogin();
            return;
        }
        setSelectedCategory(id);
        setStep(2);
    };

    if (isSubmitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-primary/5 text-center space-y-6 border border-gray-100"
                >
                    <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-black text-foreground">Richiesta Inviata!</h2>
                    <p className="text-stone-500 font-medium">
                        La tua richiesta di personalizzazione è stata ricevuta correttamente. Riceverai una notifica non appena l'admin avrà valutato il progetto e preparato un preventivo su misura.
                    </p>
                    <button 
                        onClick={() => window.location.href = '/account'}
                        className="w-full h-14 bg-foreground text-white rounded-2xl font-black hover:bg-stone-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                        Vai ai miei ordini
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-6 py-12">
            <AnimatePresence mode="wait">
                {step === 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-12"
                    >
                        <div className="text-center space-y-4 max-w-2xl mx-auto">
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight italic">
                                Crea su <span className="text-primary italic">Misura</span>
                            </h1>
                            <p className="text-stone-500 text-lg font-medium">
                                Dai vita alle tue idee. Seleziona una categoria per iniziare a configurare il tuo prodotto unico.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className="group relative bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all text-left flex flex-col items-start gap-6 overflow-hidden"
                                >
                                    <div className={`w-14 h-14 ${cat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                                        <cat.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-foreground mb-2">{cat.title}</h3>
                                        <p className="text-stone-500 text-sm font-medium leading-relaxed">
                                            {cat.description}
                                        </p>
                                    </div>
                                    <div className="mt-auto flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                        Personalizza <ArrowRight className="w-4 h-4" />
                                    </div>
                                    
                                    {/* Decorazione */}
                                    <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${cat.color} opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity`} />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === 2 && selectedCategory === 'LAMPADE' && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        <button 
                            onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-stone-500 hover:text-foreground font-black text-xs uppercase tracking-widest transition-colors mb-4"
                        >
                            <ArrowLeft className="w-4 h-4" /> Torna alla selezione
                        </button>
                        
                        <LampConfigurator 
                            userId={user?.id || ''} 
                            onSuccess={() => setIsSubmitted(true)} 
                        />
                    </motion.div>
                )}

                {step === 2 && selectedCategory !== 'LAMPADE' && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-[40vh] flex flex-col items-center justify-center space-y-6 text-center"
                    >
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                            <Clock className="w-8 h-8" />
                        </div>
                        <h2 className="text-2xl font-black text-foreground">Prossimamente</h2>
                        <p className="text-stone-500 font-medium max-w-sm">
                            Il configuratore per <strong>{selectedCategory}</strong> è attualmente in fase di sviluppo. Torna presto a trovarci!
                        </p>
                        <button 
                            onClick={() => setStep(1)}
                            className="bg-foreground text-white px-8 h-12 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-stone-800 transition-all"
                        >
                            Cambia categoria
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
