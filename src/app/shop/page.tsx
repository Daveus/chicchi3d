import { getProducts } from '@/lib/adminActions';
import ShopClient from './ShopClient';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function ShopSkeleton() {
    return (
        <div className="bg-background min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="h-10 w-48 bg-gray-100 animate-pulse mx-auto mb-12 rounded-full" />
                <div className="flex justify-center gap-4 mb-12">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 w-32 bg-gray-100 animate-pulse rounded-full" />
                    ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-2xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}

async function ShopPageContent() {
    const products = await getProducts();
    return <ShopClient initialProducts={products} />;
}

export default function ShopPage() {
    return (
        <Suspense fallback={<ShopSkeleton />}>
            <ShopPageContent />
        </Suspense>
    );
}

