import { getAllOrders } from '@/lib/adminActions';
import AdminOrdersClient from './AdminOrdersClient';

export default async function AdminOrdersPage() {
    const ordersData = await getAllOrders();
    
    return <AdminOrdersClient initialOrders={ordersData} />;
}
