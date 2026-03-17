'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
    return (
        <div className="relative overflow-hidden bg-background">
            {/* Decorative background shapes */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-10 right-10 w-[30rem] h-[30rem] bg-secondary/30 rounded-full blur-3xl opacity-50"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 md:pt-32 md:pb-32 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Column: Text & CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col space-y-8"
                    >
                        <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm border border-primary/20 text-primary-dark rounded-full px-4 py-2 w-max shadow-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-bold">Nuova collezione Primavera</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-foreground leading-tight tracking-tight">
                            Diamo forma alle <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-dark to-secondary-dark">
                                tue idee
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-stone-600 max-w-lg leading-relaxed">
                            Design unici, stampati in 3D con amore e materiali ecosostenibili. Scopri la magia della nostra collezione per rendere ogni angolo più colorato!
                        </p>

                        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
                            <Link
                                href="/shop"
                                className="bg-foreground text-background font-bold text-lg px-8 py-4 rounded-2xl shadow-hover hover:-translate-y-1 hover:shadow-lg transition-all flex items-center justify-center space-x-2 active:scale-95"
                            >
                                <span>Esplora lo Shop</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/crea-su-misura"
                                className="bg-white text-foreground border border-gray-100 font-bold text-lg px-8 py-4 rounded-2xl hover:bg-surface-hover hover:-translate-y-1 transition-all flex items-center justify-center active:scale-95"
                            >
                                Crea su misura
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right Column: 3D Visualization Placeholder / Video */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="relative lg:h-[600px] flex items-center justify-center"
                    >
                        <div className="w-full aspect-square md:aspect-auto md:h-full bg-gradient-to-br from-white/40 to-white/10 backdrop-blur-xl border border-white/40 rounded-[3rem] shadow-2xl flex items-center justify-center overflow-hidden relative group">

                            {/* Spinning generic shape representing 3D placeholder */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="relative z-10 w-64 h-64 border-4 border-dashed border-primary/40 rounded-full flex items-center justify-center"
                            >
                                <div className="w-32 h-32 bg-secondary rounded-2xl rotate-45 shadow-lg flex items-center justify-center">
                                    <span className="text-white font-black rotate-[-45deg] text-xl">3D</span>
                                </div>
                            </motion.div>

                            <div className="absolute inset-x-0 bottom-10 flex justify-center">
                                <div className="bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-sm text-sm font-bold text-gray-600">
                                    Sostituisci con render 3D (es. Spline / Three.js)
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
}
