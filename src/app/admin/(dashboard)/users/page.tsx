import { getAllUsers } from '@/lib/adminActions';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
    const users = await getAllUsers();
    
    return <AdminUsersClient initialUsers={users} />;
}
