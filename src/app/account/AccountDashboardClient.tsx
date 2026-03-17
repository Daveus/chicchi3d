'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Heart, Settings, LogOut, Loader2, Save, Key, MapPin, Truck, CheckCircle2, Clock, Trash2, User, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserFavorites, getUserOrders, updateUserProfile, changePassword, logoutUser } from '@/lib/userActions';
import { Product, Order } from '@/lib/schema';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';

interface AccountDashboardClientProps {
    user: any;
}

type TabType = 'orders' | 'favorites' | 'settings';

export default function AccountDashboardClient({ user: initialUser }: AccountDashboardClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { logout, refreshUser, favorites: globalFavIds } = useAuth();

    const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'orders');
    const [favorites, setFavorites] = useState<Product[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [profileData, setProfileData] = useState({
        nome: initialUser.nome,
        cognome: initialUser.cognome,
        indirizzo: initialUser.indirizzo || '',
        citta: initialUser.citta || '',
        cap: initialUser.cap || '',
    });

    const [pwData, setPwData] = useState({
        oldPw: '',
        newPw: '',
        confirmPw: '',
    });

    const fetchData = useCallback(async () => {
        setIsLoadingData(true);
        try {
            if (activeTab === 'favorites') {
                const favs = await getUserFavorites();
                setFavorites(favs);
            } else if (activeTab === 'orders') {
                const ords = await getUserOrders();
                setOrders(ords as any);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingData(false);
        }
    }, [activeTab]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const displayedFavorites = favorites.filter(p => globalFavIds.includes(p.id));

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await updateUserProfile(profileData);
        if (res.success) {
            toast.success("Profilo aggiornato!");
            refreshUser();
        } else {
            toast.error(res.error || "Errore durante l'aggiornamento.");
        }
    };

    const handleChangePw = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwData.newPw !== pwData.confirmPw) {
            return toast.error("Le password non coincidono.");
        }
        if (pwData.newPw.length < 8) {
            return toast.error("La nuova password deve essere di almeno 8 caratteri.");
        }

        const res = await changePassword(pwData.oldPw, pwData.newPw);
        if (res.success) {
            toast.success("Password cambiata con successo!");
            setPwData({ oldPw: '', newPw: '', confirmPw: '' });
        } else {
            toast.error(res.error || "Errore durante il cambio password.");
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
        toast.success("Ti sei disconnesso.");
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex flex-col md:flex-row gap-12">

                {/* Sidebar Navigation */}
                <div className="w-full md:w-80 shrink-0">
                    <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 p-8 sticky top-32">
                        <div className="flex flex-col items-center mb-10">
                            <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center text-foreground font-black text-3xl shadow-soft mb-4">
                                {initialUser.nome[0].toUpperCase()}
                            </div>
                            <h2 className="text-xl font-black text-foreground">{initialUser.nome} {initialUser.cognome}</h2>
                            <p className="text-stone-500 text-sm font-medium">{initialUser.email}</p>
                        </div>

                        <nav className="space-y-2">
                            {[
                                { id: 'orders', label: 'I miei Ordini', icon: Package, color: 'text-secondary' },
                                { id: 'favorites', label: 'Preferiti', icon: Heart, color: 'text-primary' },
                                { id: 'crea', label: 'Crea su Misura', icon: Sparkles, color: 'text-primary-dark' },
                                { id: 'settings', label: 'Impostazioni', icon: Settings, color: 'text-accent' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (tab.id === 'crea') {
                                            router.push('/crea-su-misura');
                                        } else {
                                            setActiveTab(tab.id as TabType);
                                        }
                                    }}
                                    className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab.id
                                        ? 'bg-surface-hover text-foreground ring-1 ring-gray-100 shadow-sm'
                                        : 'text-stone-500 hover:text-foreground hover:bg-surface-hover'
                                        }`}
                                >
                                    <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? tab.color : ''}`} />
                                    {tab.label}
                                </button>
                            ))}

                            <div className="h-px bg-gray-100 my-4 mx-4"></div>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-black text-red-400 hover:bg-red-50 transition-all text-left"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-[3rem] shadow-xl border border-gray-100 p-8 md:p-12 min-h-[600px]"
                        >
                            {/* Tab Title */}
                            <div className="mb-12">
                                <h1 className="text-4xl font-black text-foreground capitalize tracking-tight">
                                    {activeTab === 'orders' && 'Storico Ordini'}
                                    {activeTab === 'favorites' && 'I tuoi Preferiti'}
                                    {activeTab === 'settings' && 'Profilo e Sicurezza'}
                                </h1>
                            </div>

                            {activeTab === 'orders' && (
                                <div className="space-y-6">
                                    {isLoadingData ? (
                                        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
                                    ) : orders.length === 0 ? (
                                        <div className="py-20 text-center bg-surface-hover rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                            <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                            <p className="text-stone-500 font-bold">Non hai ancora effettuato ordini.</p>
                                            <button
                                                onClick={() => router.push('/shop')}
                                                className="mt-6 text-primary font-black hover:underline"
                                            >
                                                Inizia lo shopping
                                            </button>
                                        </div>
                                    ) : (
                                        orders.map((order) => (
                                            <div key={order.id} className="p-6 rounded-3xl border border-gray-100 hover:border-secondary/20 transition-all group hover:shadow-lg hover:shadow-secondary/5">
                                                <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary">
                                                            <Package className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-black text-stone-500 uppercase tracking-widest">Ordine #{(order.id as string).substring(0, 8)}</p>
                                                            <p className="font-black text-foreground">{new Date(order.dataOrdine).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-right">
                                                            <p className="text-xs font-black text-stone-500 uppercase tracking-widest">Totale</p>
                                                            <p className="text-xl font-black text-foreground">€{Number(order.totale).toFixed(2)}</p>
                                                        </div>
                                                        <span className="px-4 py-2 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                            {order.stato.replace('_', ' ')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'favorites' && (
                                <div>
                                    {isLoadingData ? (
                                        <div className="py-20 flex justify-center"><Loader2 className="w-10 h-10 text-primary animate-spin" /></div>
                                    ) : displayedFavorites.length === 0 ? (
                                        <div className="py-20 text-center bg-surface-hover rounded-[2.5rem] border-2 border-dashed border-gray-100">
                                            <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                            <p className="text-stone-500 font-bold">La tua lista dei desideri è vuota.</p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                            {displayedFavorites.map((p) => (
                                                <div key={p.id} className="relative">
                                                    <ProductCard
                                                        title={p.name}
                                                        price={p.price}
                                                        category={p.category}
                                                        id={p.id}
                                                        images={p.images}
                                                        descrizione_breve={p.description}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-12">
                                    {/* Profile Info */}
                                    <form onSubmit={handleUpdateProfile} className="space-y-8">
                                        <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                                            <User className="w-5 h-5 text-secondary" />
                                            Informazioni Profilo
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nome</label>
                                                <input
                                                    value={profileData.nome}
                                                    onChange={(e) => setProfileData({ ...profileData, nome: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Cognome</label>
                                                <input
                                                    value={profileData.cognome}
                                                    onChange={(e) => setProfileData({ ...profileData, cognome: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5 md:col-span-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Indirizzo Spedizione</label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                                                    <input
                                                        value={profileData.indirizzo}
                                                        onChange={(e) => setProfileData({ ...profileData, indirizzo: e.target.value })}
                                                        placeholder="Via delle Rose, 10"
                                                        className="w-full h-12 pl-11 pr-4 rounded-2xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Città</label>
                                                <input
                                                    value={profileData.citta}
                                                    onChange={(e) => setProfileData({ ...profileData, citta: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">CAP</label>
                                                <input
                                                    value={profileData.cap}
                                                    onChange={(e) => setProfileData({ ...profileData, cap: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-primary focus:bg-white transition-all outline-none text-sm font-medium"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full h-14 bg-secondary text-white font-black rounded-2xl hover:shadow-lg hover:shadow-secondary/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <Save className="w-6 h-6" />
                                            Salva Modifiche Profilo
                                        </button>
                                    </form>

                                    <div className="h-px bg-gray-50"></div>

                                    {/* Security Section */}
                                    <form onSubmit={handleChangePw} className="space-y-8">
                                        <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                                            <Key className="w-5 h-5 text-accent" />
                                            Sicurezza Password
                                        </h3>

                                        <div className="space-y-6">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Password Attuale</label>
                                                <input
                                                    type="password"
                                                    required
                                                    value={pwData.oldPw}
                                                    onChange={(e) => setPwData({ ...pwData, oldPw: e.target.value })}
                                                    className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-accent focus:bg-white transition-all outline-none text-sm font-medium"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Nuova Password</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={pwData.newPw}
                                                        onChange={(e) => setPwData({ ...pwData, newPw: e.target.value })}
                                                        className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-accent focus:bg-white transition-all outline-none text-sm font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Conferma Nuova Password</label>
                                                    <input
                                                        type="password"
                                                        required
                                                        value={pwData.confirmPw}
                                                        onChange={(e) => setPwData({ ...pwData, confirmPw: e.target.value })}
                                                        className="w-full h-12 px-4 rounded-2xl bg-surface-hover border border-transparent focus:border-accent focus:bg-white transition-all outline-none text-sm font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full h-14 bg-accent text-white font-black rounded-2xl hover:shadow-lg hover:shadow-accent/20 transition-all flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <Key className="w-6 h-6" />
                                            Aggiorna Password
                                        </button>
                                    </form>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
