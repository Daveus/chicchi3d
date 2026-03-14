'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { incrementSales } from '@/lib/adminActions';
import { toast } from 'sonner';

interface ProductCardProps {
    title: string;
    price: number | string;
    category: string;
    id: string | number;
    descrizione_breve?: string;
    images?: string[] | any;
}

export default function ProductCard({ title, price, category, id, descrizione_breve, images }: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const productImages = Array.isArray(images) ? images : [];
    const hasImages = productImages.length > 0;
    const isCarousel = productImages.length > 1;

    // Carousel handlers
    const nextImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.preventDefault();
        setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
    };

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

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await incrementSales(String(id));
            toast.success(`Aggiunto al carrello! (Vendite incrementate)`, {
                description: title
            });
            console.log(`[Vendite] Incrementata per: ${title} (${id})`);
        } catch (error) {
            console.error(error);
            toast.error("Errore nell'incremento vendite");
        }
    };

    return (
        <motion.div
            className="bg-surface rounded-2xl overflow-hidden shadow-soft flex flex-col group border border-gray-100/50 h-full"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {/* Visual Container */}
            <div className={`relative aspect-[4/5] overflow-hidden flex items-center justify-center transition-colors duration-300 ${!hasImages ? colorClass : 'bg-gray-50'}`}>

                {hasImages ? (
                    <div className="relative w-full h-full">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex}
                                src={productImages[currentImageIndex]}
                                alt={`${title} - ${currentImageIndex + 1}`}
                                className="w-full h-full object-cover"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.3 }}
                            />
                        </AnimatePresence>

                        {/* Carousel Arrows */}
                        {isCarousel && isHovered && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-foreground hover:bg-white transition-all z-10"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md text-foreground hover:bg-white transition-all z-10"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        {/* Carousel Dots */}
                        {isCarousel && (
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                                {productImages.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`w-1.5 h-1.5 rounded-full transition-all ${currentImageIndex === idx ? 'bg-primary w-3' : 'bg-gray-300'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                        <div className="w-20 h-20 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center shadow-sm mb-4 transition-transform duration-500 group-hover:scale-110">
                            <span className="text-3xl font-black text-foreground/40">{getInitials(title)}</span>
                        </div>
                        <span className="text-center font-bold text-foreground/60 text-sm px-4">
                            {title}
                        </span>
                    </div>
                )}

                {/* Quick Actions */}
                <div className={`absolute top-4 right-4 flex flex-col space-y-2 transition-all duration-300 z-20 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                    <button className="bg-white p-2 rounded-full shadow-md text-gray-400 hover:text-red-500 transition-soft active:scale-90">
                        <Heart className="w-5 h-5" />
                    </button>
                </div>

                {/* Visual indicator for multiple images (desktop only, optional) */}
                {isCarousel && !isHovered && (
                    <div className="absolute bottom-3 right-3 bg-black/20 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-bold">
                        1/{productImages.length}
                    </div>
                )}
            </div>

            {/* Info Container */}
            <div className="p-5 flex flex-col flex-grow bg-white">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{category}</span>
                <Link href={`/product/${id}`} className="text-lg font-bold text-foreground hover:text-primary transition-soft line-clamp-1">
                    {title}
                </Link>
                {descrizione_breve && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2 flex-grow">
                        {descrizione_breve}
                    </p>
                )}
                <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-4">
                    <span className="text-xl font-black text-foreground">€{Number(price).toFixed(2)}</span>
                    <button
                        onClick={handleAddToCart}
                        className="bg-primary/10 text-primary-dark hover:bg-primary hover:text-foreground p-2 rounded-xl transition-all active:scale-95"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

