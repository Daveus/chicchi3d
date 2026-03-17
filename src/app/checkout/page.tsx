'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { createOrder } from '@/lib/userActions';
import { toast } from 'sonner';
import { ShoppingCart, ArrowLeft, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        nome: '',
        cognome: '',
        email: '',
        indirizzo: '',
        citta: '',
        cap: '',
    });

    // Pre-compila i dati se l'utente è loggato
    useEffect(() => {
        if (user) {
            setForm(prev => ({
                ...prev,
                nome: user.nome ?? '',
                cognome: user.cognome ?? '',
                email: user.email ?? '',
                indirizzo: user.indirizzo ?? '',
                citta: user.citta ?? '',
                cap: user.cap ?? '',
            }));
        }
    }, [user]);

    // Redirect se il carrello è vuoto (solo lato client dopo hydration)
    useEffect(() => {
        if (items.length === 0) {
            router.push('/');
        }
    }, [items, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const result = await createOrder({
            items: items.map(i => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
            })),
            totale: totalPrice,
            nomeSpedizione: `${form.nome} ${form.cognome}`,
            indirizzoSpedizione: `${form.indirizzo}, ${form.citta} ${form.cap}`,
            guestEmail: user ? undefined : form.email,
        });

        setIsSubmitting(false);

        if (result.error) {
            toast.error(result.error);
            return;
        }

        clearCart();
        router.push('/checkout/success');
    };

    if (items.length === 0) return null; // Mentre fa redirect

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Back */}
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-foreground transition-soft mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Continua lo shopping
                </Link>

                <h1 className="text-3xl font-black text-foreground mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                    {/* Form spedizione */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-surface rounded-3xl p-8 shadow-soft border border-gray-100"
                    >
                        <h2 className="text-xl font-bold text-foreground mb-6">Dati di Spedizione</h2>

                        {user && (
                            <div className="mb-6 px-4 py-3 bg-primary/20 rounded-2xl text-sm text-foreground/70">
                                ✨ Dati pre-compilati dal tuo profilo. Puoi modificarli prima di confermare.
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="nome" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Nome *</label>
                                    <input
                                        id="nome"
                                        name="nome"
                                        type="text"
                                        required
                                        value={form.nome}
                                        onChange={handleChange}
                                        placeholder="Mario"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cognome" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Cognome *</label>
                                    <input
                                        id="cognome"
                                        name="cognome"
                                        type="text"
                                        required
                                        value={form.cognome}
                                        onChange={handleChange}
                                        placeholder="Rossi"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Email *</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="mario.rossi@email.it"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                />
                            </div>

                            <div>
                                <label htmlFor="indirizzo" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Indirizzo *</label>
                                <input
                                    id="indirizzo"
                                    name="indirizzo"
                                    type="text"
                                    required
                                    value={form.indirizzo}
                                    onChange={handleChange}
                                    placeholder="Via Roma, 42"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="citta" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">Città *</label>
                                    <input
                                        id="citta"
                                        name="citta"
                                        type="text"
                                        required
                                        value={form.citta}
                                        onChange={handleChange}
                                        placeholder="Milano"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cap" className="block text-xs font-semibold text-stone-600 uppercase tracking-wider mb-1.5">CAP *</label>
                                    <input
                                        id="cap"
                                        name="cap"
                                        type="text"
                                        required
                                        value={form.cap}
                                        onChange={handleChange}
                                        placeholder="20121"
                                        maxLength={10}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary-dark/50 transition-soft"
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-2 bg-foreground text-background font-bold py-4 rounded-2xl hover:opacity-80 disabled:opacity-50 transition-soft mt-4 text-base"
                            >
                                <Lock className="w-4 h-4" />
                                {isSubmitting ? 'Elaborazione...' : 'Conferma Ordine'}
                            </button>

                            <p className="text-center text-xs text-stone-500 mt-2">
                                🔒 Ordine simulato — nessun pagamento reale verrà addebitato
                            </p>
                        </form>
                    </motion.div>

                    {/* Riepilogo ordine */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-surface rounded-3xl p-8 shadow-soft border border-gray-100 lg:sticky lg:top-24"
                    >
                        <h2 className="text-xl font-bold text-foreground mb-6">Riepilogo Ordine</h2>

                        <div className="space-y-4 mb-6">
                            {items.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <ShoppingCart className="w-5 h-5 text-primary-dark/40" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-foreground line-clamp-1">{item.name}</p>
                                        <p className="text-xs text-stone-500">Qtà: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-bold text-foreground flex-shrink-0">
                                        €{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-4 space-y-2">
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Subtotale</span>
                                <span>€{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-stone-600">
                                <span>Spedizione</span>
                                <span className="text-green-500 font-medium">Gratuita</span>
                            </div>
                            <div className="flex justify-between text-xl font-black text-foreground pt-2 border-t border-gray-100">
                                <span>Totale</span>
                                <span>€{totalPrice.toFixed(2)}</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
