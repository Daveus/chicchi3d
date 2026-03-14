import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/adminActions';

export default async function FeaturedProducts() {
    const allProducts = await getProducts();
    // Prendiamo i primi 4 prodotti più recenti
    const featured = allProducts.slice(0, 4);

    if (featured.length === 0) return null;

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featured.map((prod) => (
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

            </div>
        </section>
    );
}

