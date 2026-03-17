'use client';

import { useRouter } from 'next/navigation';
import { Package, Clock, CheckCircle2, Truck, User } from 'lucide-react';
import { motion } from 'framer-motion';

type OrderData = {
    order: any;
    user: any;
};

interface AdminOrdersClientProps {
    initialOrders: OrderData[];
}

export default function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
    const router = useRouter();

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'in_elaborazione':
                return { bg: 'bg-stone-100', text: 'text-stone-600', icon: Clock };
            case 'in_lavorazione':
                return { bg: 'bg-blue-50', text: 'text-blue-600', icon: Package };
            case 'spedito':
                return { bg: 'bg-green-50', text: 'text-green-600', icon: Truck };
            case 'completato':
                return { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: CheckCircle2 };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-600', icon: Package };
        }
    };

    const formatStatusName = (status: string) => {
        return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <Package className="w-8 h-8 text-secondary" />
                        Gestione Ordini
                    </h1>
                    <p className="text-stone-500 font-medium mt-1">Monitora e aggiorna lo stato delle spedizioni</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                            <tr className="bg-surface-hover border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Ordine</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Cliente</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap text-center">Articoli</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap text-right">Totale</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap text-center">Stato</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {initialOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-stone-500 font-medium">
                                        Nessun ordine presente a sistema.
                                    </td>
                                </tr>
                            ) : (
                                initialOrders.map(({ order, user }, index) => {
                                    const StatusIcon = getStatusStyle(order.stato).icon;
                                    const itemsQty = Array.isArray(order.dettagliProdotti) 
                                        ? order.dettagliProdotti.reduce((acc: number, item: any) => acc + item.quantity, 0) 
                                        : 0;
                                    
                                    const clientName = user 
                                        ? `${user.nome} ${user.cognome}` 
                                        : order.nomeSpedizione || 'Utente Guest';

                                    const clientEmail = user ? user.email : order.guestEmail || 'N/A';

                                    return (
                                        <motion.tr 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            key={order.id} 
                                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                                            className="hover:bg-surface-hover/80 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-foreground">
                                                    #{String(order.id).substring(0, 8).toUpperCase()}
                                                </div>
                                                <div className="text-xs text-stone-500 font-medium mt-0.5">
                                                    {new Date(order.dataOrdine).toLocaleDateString('it-IT', { 
                                                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm">{clientName}</p>
                                                        <p className="text-xs text-stone-500">{clientEmail}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-block bg-gray-50 text-stone-600 font-black text-xs px-2.5 py-1 rounded-lg">
                                                    {itemsQty} pz
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="font-black text-base text-foreground">
                                                    €{Number(order.totale).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center">
                                                    <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-black uppercase tracking-widest ${getStatusStyle(order.stato).bg} ${getStatusStyle(order.stato).text}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {formatStatusName(order.stato)}
                                                    </div>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
