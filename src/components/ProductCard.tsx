'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
    title: string;
    price: number;
    category: string;
    id: string | number;
    descrizione_breve?: string;
}

export default function ProductCard({ title, price, category, id, descrizione_breve }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    // Helper per ottenere le iniziali dal titolo
    const getInitials = (text: string) => {
        return text.substring(0, 2).toUpperCase();
    };

    // Colori background dinamici in base alla categoria
    const getCategoryBgColor = (cat: string) => {
        switch (cat) {
            case 'Contenitori': return 'bg-primary/20';
            case 'Vignette': return 'bg-secondary/20';
            case 'Lampade': return 'bg-accent/30';
            case 'Biglietti 3D': return 'bg-pink-100';
            default: return 'bg-gray-100';
        }
    };

    const colorClass = getCategoryBgColor(category);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Evita la navigazione se clicco il btn add to cart
        console.log(`[Carrello] Prodotto aggiunto: ${title} (Ref: ${id}) - Prezzo: €${price.toFixed(2)}`);
        alert(`Aggiunto al carrello: ${title}`);
    };

    return (
        <motion.div
            className="bg-surface rounded-2xl overflow-hidden shadow-soft flex flex-col group border border-gray-100/50"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Visual Placeholder (NO IMG TAG) */}
            <div className={`relative aspect-[4/5] flex flex-col items-center justify-center p-6 transition-colors duration-300 ${colorClass}`}>
                <div className="w-24 h-24 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm mb-4 transition-transform duration-500 group-hover:scale-110">
                    <span className="text-3xl font-black text-foreground/40">{getInitials(title)}</span>
                </div>

                <span className="text-center font-bold text-foreground/60 text-sm px-4">
                    {title}
                </span>

                {/* Quick Actions (visible on hover) */}
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-soft active:scale-90">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Info Container */}
            <div className="p-5 flex flex-col flex-grow bg-white">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{category}</span>
                <Link href={`/product/${id}`} className="text-lg font-bold text-foreground hover:text-primary transition-soft line-clamp-2">
                    {title}
                </Link>
                {descrizione_breve && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
                        {descrizione_breve}
                    </p>
                )}
                <div className="flex items-center justify-between mt-auto border-t border-gray-100 pt-4">
                    <span className="text-xl font-black text-foreground">€{price.toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="bg-primary/20 text-primary-dark hover:bg-primary hover:text-foreground p-2 rounded-xl transition-soft active:scale-95"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
