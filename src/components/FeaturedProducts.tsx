'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

import { mockProducts } from '@/lib/mockData';

// Prendiamo i primi 4 prodotti di categorie diverse o semplicemente i primi 4 come prodotti in evidenza
const DUMMY_PRODUCTS = mockProducts.slice(0, 4);

export default function FeaturedProducts() {
    return (
        <section className="py-24 bg-surface-hover">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center space-x-2 text-primary-dark font-bold mb-2">
                            <Sparkles className="w-5 h-5" />
                            <span>Prodotti di Punta</span>
                        </div>
                        <h2 className="text-4xl font-black text-foreground tracking-tight">Novità & Best Sellers</h2>
                    </div>
                    <a href="/shop" className="text-secondary-dark font-bold mt-4 md:mt-0 hover:underline hover:text-secondary transition-soft">
                        Vedi tutti i prodotti ➔
                    </a>
                </div>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={{
                        hidden: {},
                        show: {
                            transition: {
                                staggerChildren: 0.1
                            }
                        }
                    }}
                >
                    {DUMMY_PRODUCTS.map((prod) => (
                        <motion.div
                            key={prod.id}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                show: { opacity: 1, y: 0, transition: { duration: 0.5, type: 'spring' } }
                            }}
                        >
                            <ProductCard
                                id={prod.id}
                                title={prod.titolo}
                                price={prod.prezzo}
                                category={prod.categoria}
                                descrizione_breve={prod.descrizione_breve}
                            />
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
}
