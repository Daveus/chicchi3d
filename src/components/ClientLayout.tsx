'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    return (
        <div className="flex flex-col min-h-screen">
            {!isAdminPath && <Navbar />}
            <main className="flex-grow">
                {children}
            </main>
            {!isAdminPath && <Footer />}
        </div>
    );
}
