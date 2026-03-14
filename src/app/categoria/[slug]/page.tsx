import { getProducts } from '@/lib/adminActions';
import ProductCard from '@/components/ProductCard';
import { PackageOpen, Smile, Lightbulb, Gift, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode, Suspense } from 'react';

export function generateStaticParams() {
    return [
        { slug: 'contenitori' },
        { slug: 'vignette' },
        { slug: 'lampade' },
        { slug: 'biglietti-3d' }
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
    'biglietti-3d': {
        nome: 'Biglietti 3D',
        icon: <Gift className="w-8 h-8 text-pink-500" />,
        desc: 'Un regalo nel regalo. I nostri biglietti pop-up sorprendono sempre.'
    }
};

// Skeleton Screen per il caricamento
function CategorySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-[400px]" />
            ))}
        </div>
    );
}

async function CategoryProductsList({ categoryName }: { categoryName: string }) {
    const allProducts = await getProducts();
    const filteredProducts = allProducts.filter(p => p.category === categoryName);

    if (filteredProducts.length === 0) {
        return (
            <div className="py-20 text-center">
                <div className="bg-surface inline-block p-6 rounded-full mb-4">
                    <PackageOpen className="w-12 h-12 text-gray-300 mx-auto" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Nessun prodotto disponibile</h3>
                <p className="text-gray-500 mt-2">Stiamo lavorando per aggiungere nuove creazioni in questa categoria!</p>
                <Link href="/shop" className="mt-6 inline-block text-primary font-bold hover:underline">
                    Esplora tutto lo shop
                </Link>
            </div>
        );
    }

    return (
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
    );
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const categoryInfo = CATEGORY_MAP[resolvedParams.slug];

    if (!categoryInfo) {
        notFound();
    }

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
                            <div className="bg-surface p-4 rounded-3xl shadow-sm border border-gray-100">
                                {categoryInfo.icon}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">
                                {categoryInfo.nome}
                            </h1>
                        </div>
                        <p className="text-lg text-gray-500 max-w-2xl">{categoryInfo.desc}</p>
                    </div>
                </div>

                <Suspense fallback={<CategorySkeleton />}>
                    <CategoryProductsList categoryName={categoryInfo.nome} />
                </Suspense>

            </div>
        </div>
    );
}

