'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import CartDrawer from '@/components/CartDrawer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminPath = pathname?.startsWith('/admin');

    return (
        <AuthProvider>
            <CartProvider>
                <div className="flex flex-col min-h-screen relative z-10">
                    {!isAdminPath && <Navbar />}
                    <main className="flex-grow">
                        {children}
                    </main>
                    {!isAdminPath && <Footer />}
                </div>
                {/* CartDrawer globale (fuori dal flex col per z-index) */}
                {!isAdminPath && <CartDrawer />}
                
                {/* Effetto Cornice Globale Animata */}
                {!isAdminPath && <div className="page-frame pointer-events-none" />}
            </CartProvider>
        </AuthProvider>
    );
}
