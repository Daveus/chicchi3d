import AdminSidebar from '@/app/admin/AdminSidebar';
import { Toaster } from 'sonner';

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-950">
            <AdminSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
            <Toaster position="top-right" richColors />
        </div>
    );
}
