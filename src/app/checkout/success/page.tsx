'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export default function CheckoutSuccessPage() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="text-center max-w-md mx-auto"
            >
                {/* Icona successo */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300, damping: 20 }}
                    className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                >
                    <CheckCircle className="w-12 h-12 text-green-500" />
                </motion.div>

                {/* Messaggio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 className="text-3xl font-black text-foreground mb-3">
                        Ordine confermato! 🎉
                    </h1>
                    <p className="text-stone-600 text-lg leading-relaxed mb-2">
                        Grazie per il tuo acquisto su <span className="font-bold text-foreground">Chicchi 3D</span>.
                    </p>
                    <p className="text-stone-500 text-sm mb-10">
                        Riceverai presto una conferma via email. Il tuo articolo unico verrà stampato con cura artigianale. 🖨️
                    </p>

                    {/* Decorazione */}
                    <div className="bg-primary/20 rounded-3xl p-6 mb-10 text-left space-y-2">
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <span>✅</span>
                            <span>Ordine salvato nel sistema</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <span>🎨</span>
                            <span>Produzione artigianale in corso</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <span>📦</span>
                            <span>Spedizione entro 3–5 giorni lavorativi</span>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            href="/shop"
                            className="inline-flex items-center justify-center gap-2 bg-foreground text-background font-bold px-6 py-3 rounded-2xl hover:opacity-80 transition-soft"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continua lo Shopping
                        </Link>
                        <Link
                            href="/account"
                            className="inline-flex items-center justify-center gap-2 bg-primary/20 text-foreground font-semibold px-6 py-3 rounded-2xl hover:bg-primary/40 transition-soft"
                        >
                            I miei Ordini
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
