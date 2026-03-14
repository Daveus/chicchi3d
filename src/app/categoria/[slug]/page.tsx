import { mockProducts } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import { PackageOpen, Smile, Lightbulb, Gift } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ReactNode } from 'react';

export function generateStaticParams() {
    return [
        { slug: 'contenitori' },
        { slug: 'vignette' },
        { slug: 'lampade' },
        { slug: 'auguri' }
    ];
}

const CATEGORY_MAP: Record<string, { nome: string; icon: ReactNode; desc: string }> = {
    'contenitori': {
        nome: 'Contenitori',
        icon: <PackageOpen className="w-8 h-8 text-primary-dark" />,
        desc: 'Organizza i tuoi spazi con design geometrici, fluidi o irriverenti.'
    },
    'vignette': {
        nome: 'Vignette',
        icon: <Smile className="w-8 h-8 text-secondary-dark" />,
        desc: 'Piccoli statement ironici da scrivania. Dillo con una vignetta!'
    },
    'lampade': {
        nome: 'Lampade',
        icon: <Lightbulb className="w-8 h-8 text-yellow-500" />,
        desc: 'Luci stampate in 3D che creano l\'atmosfera perfetta.'
    },
    'auguri': {
        nome: 'Biglietti 3D',
        icon: <Gift className="w-8 h-8 text-pink-500" />,
        desc: 'Un regalo nel regalo. I nostri biglietti pop-up sorprendono sempre.'
    }
};

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const categoryInfo = CATEGORY_MAP[resolvedParams.slug];

    if (!categoryInfo) {
        notFound();
    }

    const filteredProducts = mockProducts.filter(p => p.categoria === categoryInfo.nome);

    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Breadcrumb & Header */}
                <div className="mb-12 border-b border-gray-100 pb-8 text-center md:text-left flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                        <nav className="text-sm text-gray-400 mb-4 font-medium flex justify-center md:justify-start space-x-2">
                            <Link href="/" className="hover:text-primary transition-soft">Home</Link>
                            <span>/</span>
                            <Link href="/shop" className="hover:text-primary transition-soft">Shop</Link>
                            <span>/</span>
                            <span className="text-foreground capitalize">{categoryInfo.nome}</span>
                        </nav>
                        <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                            <div className="bg-surface-hover p-4 rounded-full shadow-sm">
                                {categoryInfo.icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">I nostri {categoryInfo.nome}</h1>
                        </div>
                        <p className="text-lg text-gray-500 max-w-2xl">{categoryInfo.desc}</p>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 font-medium">Trovati {filteredProducts.length} prodotti</span>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((prod) => (
                        <ProductCard
                            key={prod.id}
                            id={prod.id}
                            title={prod.titolo}
                            price={prod.prezzo}
                            category={prod.categoria}
                            descrizione_breve={prod.descrizione_breve}
                        />
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-20 text-center text-gray-400">
                        Prodotti in arrivo... stay tuned!
                    </div>
                )}

            </div>
        </div>
    );
}
