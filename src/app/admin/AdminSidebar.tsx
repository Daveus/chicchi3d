'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PackageOpen, LogOut, LayoutDashboard } from 'lucide-react';
import { logoutAction } from '@/lib/adminActions';

export default function AdminSidebar() {
    const pathname = usePathname();

    const links = [
        { href: '/admin', icon: LayoutDashboard, label: 'Prodotti' },
    ];

    return (
        <aside className="w-64 min-h-screen bg-slate-900 border-r border-slate-700/50 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-700/50">
                <Link href="/admin" className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <PackageOpen className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-black text-white text-sm">Chicchi 3D</p>
                        <p className="text-slate-500 text-xs">Admin Panel</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {links.map(({ href, icon: Icon, label }) => {
                    const isActive = pathname === href;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-700/50">
                <form action={logoutAction}>
                    <button
                        type="submit"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Disconnettiti
                    </button>
                </form>
            </div>
        </aside>
    );
}
