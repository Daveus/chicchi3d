'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogIn, UserPlus, LogOut, Settings, Heart, Package, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/lib/userActions';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AccountDropdown() {
    const { user, isLoading, isLoginOpen, openLogin, closeLogin, login, logout } = useAuth();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeLogin();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [closeLogin]);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoginError(null);
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        try {
            const res = await loginUser(formData);
            if (res.error) {
                setLoginError(res.error);
                toast.error(res.error);
            } else if (res.user) {
                login(res.user as any);
                toast.success(`Bentornato, ${res.user.nome}!`);
            }
        } catch (error) {
            console.error(error);
            setLoginError('Errore di connessione.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* User Icon Trigger */}
            <button
                onClick={isLoginOpen ? closeLogin : openLogin}
                className={`text-foreground hover:text-primary transition-soft relative p-1 rounded-full ${isLoginOpen ? 'text-primary' : ''}`}
            >
                <User className="w-6 h-6" />
                {user && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                )}
            </button>

            {/* Dropdown Card */}
            <AnimatePresence>
                {isLoginOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute right-0 mt-4 w-80 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden z-[60]"
                    >
                        {isLoading ? (
                            <div className="p-12 flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : !user ? (
                            /* Login Form View */
                            <div className="p-6">
                                <h3 className="text-xl font-black text-foreground mb-1">Accedi</h3>
                                <p className="text-xs text-stone-500 mb-6 font-medium">Inserisci le tue credenziali per continuare</p>

                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            placeholder="la-tua@email.com"
                                            className="w-full h-11 px-4 rounded-xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500">Password</label>
                                            <button type="button" className="text-[10px] font-bold text-primary hover:underline">Dimenticata?</button>
                                        </div>
                                        <input
                                            name="password"
                                            type="password"
                                            required
                                            placeholder="••••••••"
                                            className="w-full h-11 px-4 rounded-xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                        />
                                    </div>

                                    {loginError && (
                                        <p className="text-red-500 text-[11px] font-bold text-center bg-red-50 py-2 rounded-lg">{loginError}</p>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full h-12 bg-primary text-foreground font-black rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <LogIn className="w-5 h-5" />}
                                        Accedi
                                    </button>
                                </form>

                                <div className="mt-6 pt-6 border-t border-gray-50 text-center">
                                    <p className="text-xs text-stone-500 font-medium mb-3">Non hai ancora un account?</p>
                                    <Link
                                        href="/register"
                                        onClick={closeLogin}
                                        className="inline-flex items-center gap-2 text-sm font-black text-foreground hover:text-primary transition-colors"
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Registrati Gratis
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            /* User Info View */
                            <div className="p-0">
                                <div className="p-6 bg-surface-hover">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-foreground font-black text-xl shadow-sm">
                                            {user.nome[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-black text-foreground leading-tight">Ciao, {user.nome}!</h3>
                                            <p className="text-[11px] text-stone-500 font-bold truncate">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <Link
                                        href="/account"
                                        onClick={closeLogin}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-surface-hover hover:text-foreground transition-all"
                                    >
                                        <Package className="w-5 h-5 text-secondary" />
                                        I miei Ordini
                                    </Link>
                                    <Link
                                        href="/account?tab=favorites"
                                        onClick={closeLogin}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-surface-hover hover:text-foreground transition-all"
                                    >
                                        <Heart className="w-5 h-5 text-primary" />
                                        Lista dei desideri
                                    </Link>
                                    <Link
                                        href="/account?tab=settings"
                                        onClick={closeLogin}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-gray-600 hover:bg-surface-hover hover:text-foreground transition-all"
                                    >
                                        <Settings className="w-5 h-5 text-accent" />
                                        Impostazioni Profilo
                                    </Link>

                                    <div className="h-px bg-gray-50 my-2 mx-4"></div>

                                    <button
                                        onClick={async () => {
                                            await logout();
                                            closeLogin();
                                            toast.success("Ti sei disconnesso con successo.");
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-red-400 hover:bg-red-50 transition-all text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
