import { getProducts } from '@/lib/adminActions';
import AdminProductsClient from '@/app/admin/(dashboard)/AdminProductsClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const products = await getProducts();

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-black text-white">Catalogo Prodotti</h1>
                    <p className="text-slate-400 text-sm mt-1">{products.length} prodotti nel database</p>
                </div>
            </div>

            <AdminProductsClient initialProducts={products} />
        </div>
    );
}
