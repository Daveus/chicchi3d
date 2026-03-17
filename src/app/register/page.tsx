'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, ArrowRight, Loader2, Mail, Lock, User, MapPin } from 'lucide-react';
import { registerUser } from '@/lib/userActions';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries()) as any;

        // Basic validation
        if (data.password.length < 8) {
            toast.error("La password deve essere di almeno 8 caratteri.");
            setIsLoading(false);
            return;
        }

        try {
            const res = await registerUser(data);
            if (res.error) {
                toast.error(res.error);
            } else if (res.user) {
                login(res.user as any);
                toast.success("Registrazione completata con successo!");
                router.push('/account');
                router.refresh();
            }
        } catch (error) {
            console.error(error);
            toast.error("Errore durante la registrazione.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 bg-surface flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-xl w-full"
            >
                <div className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 md:p-12">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-4">
                            <UserPlus className="w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black text-foreground mb-2">Crea il tuo Account</h1>
                        <p className="text-stone-500 font-medium">Entra nel mondo di Chicchi 3D e gestisci i tuoi preferiti</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nome *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        name="nome"
                                        type="text"
                                        required
                                        placeholder="Mario"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Cognome *</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                    <input
                                        name="cognome"
                                        type="text"
                                        required
                                        placeholder="Rossi"
                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Email *</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="mario.rossi@esempio.it"
                                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Password *</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Almeno 8 caratteri"
                                    className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="h-px bg-gray-50 my-2"></div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-foreground flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-secondary" />
                                Indirizzo di Spedizione (Opzionale)
                            </h3>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Via / Piazza</label>
                                <input
                                    name="indirizzo"
                                    type="text"
                                    placeholder="Via delle Rose, 10"
                                    className="w-full h-12 px-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Città</label>
                                    <input
                                        name="citta"
                                        type="text"
                                        placeholder="Verona"
                                        className="w-full h-12 px-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">CAP</label>
                                    <input
                                        name="cap"
                                        type="text"
                                        placeholder="37100"
                                        className="w-full h-12 px-4 rounded-2xl bg-surface border border-gray-100 focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 bg-primary text-foreground font-black text-lg rounded-2xl shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UserPlus className="w-6 h-6" />}
                            Crea Account
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-stone-500 text-sm font-medium">
                            Hai già un account? {' '}
                            <Link href="/" className="text-primary font-black hover:underline inline-flex items-center gap-1 group">
                                Accedi dall'Header
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
