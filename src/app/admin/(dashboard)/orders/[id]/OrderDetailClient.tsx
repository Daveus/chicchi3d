'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus } from '@/lib/adminActions';
import { ArrowLeft, Package, User, MapPin, CheckCircle2, Truck, Clock, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type OrderData = {
    order: any;
    user: any;
};

interface OrderDetailClientProps {
    orderData: OrderData;
}

const statusOptions = [
    { value: 'in_elaborazione', label: 'In Elaborazione', icon: Clock, color: 'text-stone-600 bg-stone-100' },
    { value: 'in_lavorazione', label: 'In Lavorazione', icon: Package, color: 'text-blue-600 bg-blue-50' },
    { value: 'spedito', label: 'Spedito', icon: Truck, color: 'text-green-600 bg-green-50' },
    { value: 'completato', label: 'Completato', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' }
];

export default function OrderDetailClient({ orderData }: OrderDetailClientProps) {
    const { order, user } = orderData;
    const router = useRouter();
    
    const [currentStatus, setCurrentStatus] = useState(order.stato);
    const [isSaving, setIsSaving] = useState(false);

    const clientName = user ? `${user.nome} ${user.cognome}` : order.nomeSpedizione || 'Utente Guest';
    const clientEmail = user ? user.email : order.guestEmail || 'Nessuna Email';
    
    // Fallback sicuro se lo schema jsonb non fosse formattato come atteso
    const orderItems = Array.isArray(order.dettagliProdotti) ? order.dettagliProdotti : [];

    const handleStatusChange = async () => {
        if (currentStatus === order.stato) return; // nessuna mod reale

        setIsSaving(true);
        try {
            const res = await updateOrderStatus(order.id, currentStatus);
            if (res.success) {
                toast.success('Stato ordine aggiornato con successo');
                router.refresh();
            } else {
                toast.error('Errore durante l\'aggiornamento dello stato');
            }
        } catch (e) {
            toast.error('Errore di connessione al database');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            
            {/* Header & Back Action */}
            <div className="flex items-center gap-4 mb-2">
                <button 
                    onClick={() => router.push('/admin/orders')}
                    className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-stone-500 hover:text-stone-800 hover:border-gray-300 transition-all font-bold flex items-center justify-center"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-foreground flex items-center gap-3 tracking-tight">
                        Ordine #{String(order.id).substring(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-stone-500 font-medium">
                        Effettuato il {new Date(order.dataOrdine).toLocaleDateString('it-IT', { 
                            day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column (Info) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* Prodotti Acquistati */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
                            <Package className="w-5 h-5 text-secondary" /> Prodotti Acquistati
                        </h2>
                        
                        <div className="space-y-4">
                            {orderItems.map((item: any, idx: number) => (
                                <div key={idx} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center font-black text-stone-400">
                                            {item.quantity}x
                                        </div>
                                        <div>
                                            <p className="font-bold text-foreground text-sm">{item.name}</p>
                                            <p className="text-xs font-black text-stone-400 uppercase tracking-widest mt-1">ID: {String(item.id).substring(0,8)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-foreground">€{(item.price * item.quantity).toFixed(2)}</p>
                                        <p className="text-xs text-stone-400 font-medium">€{Number(item.price).toFixed(2)} cad.</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-end">
                            <p className="font-black text-stone-500 uppercase tracking-widest text-xs">Totale Pagato</p>
                            <p className="text-3xl font-black text-foreground">€{Number(order.totale).toFixed(2)}</p>
                        </div>
                    </div>

                </div>

                {/* Right Column (Status & Customer) */}
                <div className="space-y-8">
                    
                    {/* Gestione Stato */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                        <h2 className="text-xl font-black text-foreground mb-6">Workflow Ordine</h2>
                        
                        <div className="space-y-4">
                            <label className="text-xs font-black text-stone-500 uppercase tracking-widest">Attuale Stato di Avanzamento</label>
                            
                            <select 
                                value={currentStatus}
                                onChange={(e) => setCurrentStatus(e.target.value)}
                                className="w-full h-14 px-4 bg-surface-hover border border-gray-200 rounded-2xl font-bold text-stone-700 outline-none focus:border-secondary focus:ring-4 focus:ring-secondary/10 transition-all cursor-pointer"
                            >
                                {statusOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>

                            <button 
                                onClick={handleStatusChange}
                                disabled={isSaving || currentStatus === order.stato}
                                className={`w-full h-14 rounded-2xl font-black flex justify-center items-center gap-2 transition-all active:scale-95 ${
                                    currentStatus !== order.stato 
                                    ? 'bg-secondary text-white hover:shadow-lg hover:shadow-secondary/20' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {isSaving ? 'Salvataggio...' : 'Applica Modifica'}
                            </button>
                        </div>
                    </div>

                    {/* Dati Cliente */}
                    <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 space-y-6">
                        <h2 className="text-xl font-black text-foreground flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Anagrafica
                        </h2>
                        
                        <div>
                            <p className="font-bold text-foreground">{clientName}</p>
                            <p className="text-sm text-stone-500 mt-1">{clientEmail}</p>
                            
                            {!user && (
                                <span className="inline-block mt-3 bg-gray-100 text-stone-500 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">
                                    Ordine Guest
                                </span>
                            )}
                        </div>
                        
                        <div className="h-px bg-gray-50"></div>

                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 flex items-center gap-1.5 mb-2">
                                <MapPin className="w-3 h-3" /> Indirizzo Spedizione
                            </p>
                            <p className="font-medium text-stone-600 text-sm leading-relaxed">
                                {order.indirizzoSpedizione || 'Nessun indirizzo specificato.'}
                            </p>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
}
