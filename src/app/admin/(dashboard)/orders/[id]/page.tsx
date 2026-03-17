import { getOrderById } from '@/lib/adminActions';
import OrderDetailClient from './OrderDetailClient';
import { redirect } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const data = await getOrderById(id);

    if (!data) {
        redirect('/admin/orders');
    }

    return <OrderDetailClient orderData={data} />;
}
