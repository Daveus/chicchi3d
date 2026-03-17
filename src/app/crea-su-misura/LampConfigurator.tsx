'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Image as ImageIcon, 
    Upload, 
    X, 
    ChevronRight, 
    ChevronLeft, 
    Save, 
    Type, 
    FileText,
    Loader2,
    Info
} from 'lucide-react';
import { submitCustomOrder } from '@/lib/customActions';
import { toast } from 'sonner';

interface LampConfiguratorProps {
    userId: string;
    onSuccess: () => void;
}

type FaceConfig = {
    description: string;
    images: string[]; // Base64 strings
};

const faces = ['A', 'B', 'C', 'D'];

export default function LampConfigurator({ userId, onSuccess }: LampConfiguratorProps) {
    const [currentFaceIndex, setCurrentFaceIndex] = useState(0);
    const [faceConfigs, setFaceConfigs] = useState<Record<string, FaceConfig>>({
        'A': { description: '', images: [] },
        'B': { description: '', images: [] },
        'C': { description: '', images: [] },
        'D': { description: '', images: [] },
    });
    const [baseText, setBaseText] = useState('');
    const [notes, setNotes] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinalStep, setIsFinalStep] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDescriptionChange = (val: string) => {
        const face = faces[currentFaceIndex];
        setFaceConfigs(prev => ({
            ...prev,
            [face]: { ...prev[face], description: val }
        }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const face = faces[currentFaceIndex];
        const newImages: string[] = [];

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFaceConfigs(prev => ({
                    ...prev,
                    [face]: { ...prev[face], images: [...prev[face].images, base64String] }
                }));
            };
            reader.readAsDataURL(file);
        });
        
        // Reset input for next same-file upload if needed
        e.target.value = '';
    };

    const removeImage = (face: string, idx: number) => {
        setFaceConfigs(prev => ({
            ...prev,
            [face]: { ...prev[face], images: prev[face].images.filter((_, i) => i !== idx) }
        }));
    };

    const handleSubmit = async () => {
        // Validazione: almeno una facciata deve avere una descrizione
        const hasSomeContent = Object.values(faceConfigs).some(f => f.description.trim().length > 0);
        if (!hasSomeContent) {
            toast.error('Per favore, inserisci almeno una descrizione per una delle facciate.');
            return;
        }

        setIsSubmitting(true);
        const res = await submitCustomOrder({
            userId,
            productType: 'LAMPADE',
            configurationData: {
                faces: faceConfigs
            },
            baseText,
            notes
        });

        if (res.success) {
            onSuccess();
        } else {
            toast.error('Errore durante l\'invio. Riprova più tardi.');
            setIsSubmitting(false);
        }
    };

    const currentFace = faces[currentFaceIndex];

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
            
            {/* Sidebar / Face Navigation */}
            <div className="w-full md:w-64 bg-surface-hover p-8 space-y-8">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-2">Configurazione</p>
                    <div className="flex flex-col gap-2">
                        {faces.map((f, idx) => (
                            <button
                                key={f}
                                onClick={() => { setCurrentFaceIndex(idx); setIsFinalStep(false); }}
                                className={`w-full h-12 rounded-xl flex items-center justify-between px-4 text-sm font-black transition-all ${
                                    currentFaceIndex === idx && !isFinalStep
                                    ? 'bg-secondary text-white shadow-lg shadow-secondary/20 scale-105 z-10'
                                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                                }`}
                            >
                                Facciata {f}
                                {faceConfigs[f].description.trim() && (
                                    <div className="w-2 h-2 rounded-full bg-current opacity-40" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-200" />

                <button
                    onClick={() => setIsFinalStep(true)}
                    className={`w-full h-12 rounded-xl flex items-center gap-3 px-4 text-sm font-black transition-all ${
                        isFinalStep
                        ? 'bg-foreground text-white shadow-lg shadow-black/10 scale-105 z-10'
                        : 'text-stone-500 hover:bg-stone-100 hover:text-stone-700'
                    }`}
                >
                    <Save className="w-4 h-4" />
                    Riepilogo e Invio
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-8 md:p-12">
                <AnimatePresence mode="wait">
                    {!isFinalStep ? (
                        <motion.div
                            key={currentFace}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="space-y-10"
                        >
                            <div className="flex justify-between items-end">
                                <div>
                                    <h2 className="text-3xl font-black text-foreground">Facciata {currentFace}</h2>
                                    <p className="text-stone-500 font-medium">Cosa vorresti vedere su questo lato della lampada?</p>
                                </div>
                                <span className="text-4xl font-black text-stone-100 select-none">0{currentFaceIndex + 1}</span>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="w-3 h-3" /> Descrizione della scena
                                    </label>
                                    <textarea
                                        value={faceConfigs[currentFace].description}
                                        onChange={(e) => handleDescriptionChange(e.target.value)}
                                        placeholder="Esempio: Una scena di montagna al tramonto con due persone che camminano..."
                                        className="w-full h-40 p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 font-medium transition-all resize-none placeholder:text-stone-300"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <ImageIcon className="w-3 h-3" /> Immagini di riferimento (opzionali)
                                    </label>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {faceConfigs[currentFace].images.map((img, idx) => (
                                            <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                                <img src={img} className="w-full h-full object-cover" />
                                                <button
                                                    onClick={() => removeImage(currentFace, idx)}
                                                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 text-stone-400 hover:border-secondary/30 hover:text-secondary hover:bg-secondary/5 transition-all"
                                        >
                                            <Upload className="w-6 h-6" />
                                            <span className="text-[10px] font-black uppercase tracking-tight">Carica</span>
                                        </button>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        hidden
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 flex justify-between items-center">
                                <button
                                    onClick={() => setCurrentFaceIndex(i => Math.max(0, i - 1))}
                                    disabled={currentFaceIndex === 0}
                                    className="flex items-center gap-2 text-stone-400 hover:text-foreground disabled:opacity-0 transition-colors font-black text-xs uppercase tracking-widest"
                                >
                                    <ChevronLeft className="w-4 h-4" /> Precedente
                                </button>
                                
                                {currentFaceIndex < 3 ? (
                                    <button
                                        onClick={() => setCurrentFaceIndex(i => i + 1)}
                                        className="h-14 px-8 bg-secondary text-white rounded-2xl font-black flex items-center gap-2 hover:shadow-lg hover:shadow-secondary/20 transition-all active:scale-95"
                                    >
                                        Prossima Facciata <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setIsFinalStep(true)}
                                        className="h-14 px-8 bg-foreground text-white rounded-2xl font-black flex items-center gap-2 hover:bg-stone-800 transition-all active:scale-95"
                                    >
                                        Vai al riepilogo <ChevronRight className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="final"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-10"
                        >
                            <div>
                                <h2 className="text-3xl font-black text-foreground tracking-tight">Quasi finito!</h2>
                                <p className="text-stone-500 font-medium">Aggiungi gli ultimi dettagli per concludere la richiesta.</p>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Type className="w-3 h-3" /> Scritta sulla base (opzionale)
                                    </label>
                                    <input
                                        type="text"
                                        value={baseText}
                                        onChange={(e) => setBaseText(e.target.value)}
                                        placeholder="Esempio: 'A mamma e papà, con amore'"
                                        className="w-full h-14 px-5 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 font-medium transition-all placeholder:text-stone-300"
                                    />
                                    <p className="text-[10px] text-stone-400 bg-stone-50 p-3 rounded-lg flex items-center gap-2 italic">
                                        <Info className="w-3 h-3" /> Verrà incisa con laser sulla base in legno o plastica della lampada.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <FileText className="w-3 h-3" /> Note aggiuntive
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Qualsiasi altra istruzione o informazione utile per il progetto..."
                                        className="w-full h-32 p-5 bg-gray-50 border border-gray-100 rounded-[1.5rem] outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/5 font-medium transition-all resize-none placeholder:text-stone-300"
                                    />
                                </div>
                            </div>

                            <div className="pt-10 flex flex-col md:flex-row gap-4">
                                <button
                                    onClick={() => setIsFinalStep(false)}
                                    className="flex-1 h-14 bg-stone-100 text-stone-600 rounded-2xl font-black flex justify-center items-center gap-2 hover:bg-stone-200 transition-all"
                                >
                                    Rivedi facciate
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="flex-[2] h-14 bg-primary text-white rounded-2xl font-black flex justify-center items-center gap-2 hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                                >
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {isSubmitting ? 'Invio in corso...' : 'Invia Proposta Progetto'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
