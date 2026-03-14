'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, ChevronLeft, ChevronRight, Star, Share2, ArrowLeft, Check } from 'lucide-react';
import { Product } from '@/lib/schema';
import { incrementSales } from '@/lib/adminActions';
import { toast } from 'sonner';
import Link from 'next/link';

interface ProductDetailClientProps {
    product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const images = (product.images as string[]) || [];
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        setIsAdding(true);
        try {
            await incrementSales(product.id);
            toast.success(`Aggiunto al carrello!`, {
                description: `${product.name} è stato aggiunto con successo.`
            });
        } catch (error) {
            console.error(error);
            toast.error("Errore durante l'aggiunta al carrello");
        } finally {
            setTimeout(() => setIsAdding(false), 1000);
        }
    };

    const nextImage = () => {
        if (images.length <= 1) return;
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        if (images.length <= 1) return;
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Back Link */}
            <Link
                href="/shop"
                className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-8 group"
            >
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Torna allo Shop
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                {/* Left: Product Media */}
                <div className="space-y-6">
                    <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-surface-hover border border-gray-100 shadow-soft group">
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImageIndex}
                                src={images[currentImageIndex] || ''}
                                alt={product.name}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className="w-full h-full object-cover"
                            />
                        </AnimatePresence>

                        {/* Carousel Controls */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={prevImage}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm hover:bg-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={nextImage}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-foreground shadow-sm hover:bg-white transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>

                                {/* Indicators */}
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            className={`h-2 rounded-full transition-all duration-300 ${currentImageIndex === idx ? 'bg-primary w-8' : 'bg-white/50 w-2 hover:bg-white/80'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="grid grid-cols-5 gap-4">
                            {images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-200'
                                        }`}
                                >
                                    <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col h-full">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-primary/10 text-primary-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                                {product.category}
                            </span>
                            <div className="flex items-center text-accent ml-2">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-gray-400 text-xs font-bold ml-1.5">(5.0)</span>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">
                            {product.name}
                        </h1>

                        <p className="text-3xl font-black text-primary">
                            €{Number(product.price).toFixed(2)}
                        </p>
                    </div>

                    <div className="space-y-6 mb-8 flex-grow">
                        <div className="bg-surface rounded-3xl p-6 border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Descrizione</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {product.description || "Nessuna descrizione disponibile per questo prodotto."}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Spedizione Gratis</span>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <Check className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Eco-Friendly</span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto space-y-4">
                        <div className="flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAdding}
                                className={`flex-1 relative h-16 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${isAdding
                                        ? 'bg-secondary text-white'
                                        : 'bg-primary text-foreground hover:shadow-lg hover:shadow-primary/20'
                                    }`}
                            >
                                {isAdding ? (
                                    <Check className="w-6 h-6 animate-bounce" />
                                ) : (
                                    <>
                                        <ShoppingCart className="w-6 h-6" />
                                        Aggiungi al Carrello
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setIsLiked(!isLiked);
                                    if (!isLiked) toast.success("Aggiunto ai preferiti!");
                                }}
                                className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all active:scale-[0.95] ${isLiked
                                        ? 'bg-red-50 border-red-200 text-red-500'
                                        : 'border-gray-200 text-gray-400 hover:border-gray-300'
                                    }`}
                            >
                                <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        <button className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-gray-400 font-bold hover:text-foreground hover:bg-surface-hover transition-all">
                            <Share2 className="w-4 h-4" />
                            Condividi con un amico
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
