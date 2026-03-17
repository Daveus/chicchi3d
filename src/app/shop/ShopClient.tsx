'use client';

import { useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { PackageOpen, Smile, Lightbulb, Gift } from 'lucide-react';

const CATEGORIES = [
    { name: 'Tutti', icon: null },
    { name: 'Contenitori', icon: <PackageOpen className="w-5 h-5 mr-2" /> },
    { name: 'Vignette', icon: <Smile className="w-5 h-5 mr-2" /> },
    { name: 'Lampade', icon: <Lightbulb className="w-5 h-5 mr-2" /> },
    { name: 'Biglietti 3D', icon: <Gift className="w-5 h-5 mr-2" /> }
];

interface ShopClientProps {
    initialProducts: any[];
}

export default function ShopClient({ initialProducts }: ShopClientProps) {
    const [activeCategory, setActiveCategory] = useState('Tutti');

    const filteredProducts = activeCategory === 'Tutti'
        ? initialProducts
        : initialProducts.filter(p => p.category === activeCategory);

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4">Lo Shop</h1>
                    <p className="text-lg text-stone-600 max-w-2xl mx-auto">
                        Scopri tutte le nostre creazioni stampate in 3D. Divertenti, colorate e perfette per te o come regalo!
                    </p>
                </div>

                {/* Filter Navigation */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`flex items-center px-6 py-3 rounded-full font-bold transition-soft ${activeCategory === cat.name
                                ? 'bg-foreground text-background shadow-md'
                                : 'bg-surface-hover text-stone-600 hover:bg-gray-200'
                                }`}
                        >
                            {cat.icon}
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-stone-600 font-medium tracking-tight">
                        Trovati <span className="text-foreground font-black">{filteredProducts.length}</span> prodotti
                    </span>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((prod) => (
                        <ProductCard
                            key={prod.id}
                            id={prod.id}
                            title={prod.name}
                            price={prod.price}
                            category={prod.category}
                            descrizione_breve={prod.description || ''}
                            images={prod.images}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center">
                        <div className="bg-surface inline-block p-8 rounded-full mb-4">
                            <PackageOpen className="w-16 h-16 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Ancora nulla qui...</h3>
                        <p className="text-stone-600 mt-2">Stiamo rifornendo lo shop. Torna a trovarci presto!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
