'use client';

import { useState, useTransition, useRef } from 'react';
import { Plus, Pencil, Trash2, X, ImagePlus, PackageOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { createProduct, updateProduct, deleteProduct } from '@/lib/adminActions';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/schema';

const CATEGORIES = ['Contenitori', 'Vignette', 'Lampade', 'Biglietti 3D'];

const EMPTY_FORM = {
    name: '',
    category: 'Contenitori',
    price: '',
    description: '',
    images: [] as string[],
};

interface Props {
    initialProducts: Product[];
}

export default function AdminProductsClient({ initialProducts }: Props) {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [showModal, setShowModal] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [isPending, startTransition] = useTransition();
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    // ---- helpers ----
    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (p: Product) => {
        setEditing(p);
        setForm({
            name: p.name,
            category: p.category,
            price: String(p.price),
            description: p.description,
            images: (p.images as string[]) ?? [],
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditing(null);
    };

    // ---- Base64 conversion ----
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        if (!files.length) return;
        setIsLoadingImages(true);
        try {
            const b64s = await Promise.all(
                files.map(
                    (f) =>
                        new Promise<string>((res, rej) => {
                            const reader = new FileReader();
                            reader.onload = () => res(reader.result as string);
                            reader.onerror = rej;
                            reader.readAsDataURL(f);
                        })
                )
            );
            setForm((prev) => ({ ...prev, images: [...prev.images, ...b64s] }));
        } catch {
            toast.error('Errore durante la conversione delle immagini');
        } finally {
            setIsLoadingImages(false);
            if (fileRef.current) fileRef.current.value = '';
        }
    };

    const removeImage = (idx: number) => {
        setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    };

    // ---- Submit ----
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.price) {
            toast.error('Nome e prezzo sono obbligatori');
            return;
        }
        startTransition(async () => {
            try {
                const payload = {
                    name: form.name,
                    category: form.category,
                    price: form.price,
                    description: form.description,
                    images: form.images,
                };
                if (editing) {
                    await updateProduct(editing.id, payload);
                    toast.success('Prodotto aggiornato!');
                } else {
                    await createProduct(payload);
                    toast.success('Prodotto aggiunto!');
                }
                closeModal();
                router.refresh();
                // Aggiorno state locale ottimisticamente
                const res = await fetch('/api/admin/products');
                if (res.ok) setProducts(await res.json());
                else router.refresh();
            } catch {
                toast.error('Errore durante il salvataggio. Riprova.');
            }
        });
    };

    // ---- Delete ----
    const handleDelete = (id: string, name: string) => {
        if (!confirm(`Eliminare definitivamente "${name}"?`)) return;
        startTransition(async () => {
            try {
                await deleteProduct(id);
                setProducts((prev) => prev.filter((p) => p.id !== id));
                toast.success('Prodotto eliminato.');
            } catch {
                toast.error('Errore durante l\'eliminazione.');
            }
        });
    };

    return (
        <>
            {/* Toolbar */}
            <div className="mb-6 flex justify-end">
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-pink-500/20"
                >
                    <Plus className="w-4 h-4" />
                    Aggiungi Prodotto
                </button>
            </div>

            {/* Table */}
            {products.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                    <PackageOpen className="w-12 h-12 mb-4 opacity-40" />
                    <p className="text-lg font-medium">Nessun prodotto nel database</p>
                    <p className="text-sm mt-1">Inizia aggiungendo il tuo primo prodotto</p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700/50">
                                <th className="text-left text-slate-400 font-medium px-6 py-4">Immagine</th>
                                <th className="text-left text-slate-400 font-medium px-6 py-4">Nome</th>
                                <th className="text-left text-slate-400 font-medium px-6 py-4">Categoria</th>
                                <th className="text-left text-slate-400 font-medium px-6 py-4">Prezzo</th>
                                <th className="text-right text-slate-400 font-medium px-6 py-4">Azioni</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => {
                                const imgs = (p.images as string[]) ?? [];
                                return (
                                    <tr
                                        key={p.id}
                                        className={`border-b border-slate-800/60 hover:bg-white/[0.02] transition-colors ${i === products.length - 1 ? 'border-b-0' : ''
                                            }`}
                                    >
                                        {/* Thumbnail */}
                                        <td className="px-6 py-3">
                                            {imgs[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={imgs[0]}
                                                    alt={p.name}
                                                    className="w-12 h-12 object-cover rounded-lg border border-slate-700"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs font-bold">
                                                    {p.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-3 text-white font-medium max-w-[200px] truncate">{p.name}</td>
                                        <td className="px-6 py-3">
                                            <span className="bg-pink-500/20 text-pink-400 border border-pink-500/30 text-xs font-bold px-2.5 py-1 rounded-full">
                                                {p.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 text-white font-semibold">
                                            €{Number(p.price).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-3">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEdit(p)}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                                                    title="Modifica"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(p.id, p.name)}
                                                    disabled={isPending}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                                                    title="Elimina"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal Prodotto */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeModal}
                    />

                    {/* Modal */}
                    <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 flex-shrink-0">
                            <h2 className="text-lg font-bold text-white">
                                {editing ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
                            <div className="p-6 space-y-5">
                                {/* Nome */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome prodotto *</label>
                                    <input
                                        value={form.name}
                                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                        required
                                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                        placeholder="Es. Portapenne Esagonale"
                                    />
                                </div>

                                {/* Grid: Categoria + Prezzo */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Categoria *</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                                            className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-1.5">Prezzo (€) *</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={form.price}
                                            onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                                            required
                                            className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                {/* Descrizione */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">Descrizione</label>
                                    <textarea
                                        value={form.description}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                        rows={3}
                                        className="w-full bg-slate-800 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all resize-none"
                                        placeholder="Descrizione breve del prodotto..."
                                    />
                                </div>

                                {/* Immagini */}
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                                        Immagini
                                        <span className="ml-2 text-xs text-slate-500 font-normal">(convertite in Base64)</span>
                                    </label>

                                    {/* Anteprima immagini */}
                                    {form.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {form.images.map((src, idx) => (
                                                <div key={idx} className="relative group">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={src}
                                                        alt={`img-${idx}`}
                                                        className="w-16 h-16 object-cover rounded-lg border border-slate-700"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Upload */}
                                    <label className="relative flex items-center justify-center gap-3 w-full h-24 bg-slate-800 border-2 border-dashed border-slate-700 hover:border-pink-500/50 hover:bg-slate-750 rounded-xl cursor-pointer transition-all">
                                        {isLoadingImages ? (
                                            <div className="flex items-center gap-2 text-slate-400">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span className="text-sm">Conversione in corso...</span>
                                            </div>
                                        ) : (
                                            <>
                                                <ImagePlus className="w-5 h-5 text-slate-500" />
                                                <span className="text-sm text-slate-500">Clicca per caricare immagini</span>
                                            </>
                                        )}
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            disabled={isLoadingImages}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 border-t border-slate-700/50 flex items-center justify-end gap-3 flex-shrink-0 bg-slate-900">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                                >
                                    Annulla
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending || isLoadingImages}
                                    className="flex items-center gap-2 bg-pink-500 hover:bg-pink-400 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl transition-all"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Salvataggio...
                                        </>
                                    ) : editing ? (
                                        'Salva modifiche'
                                    ) : (
                                        'Aggiungi prodotto'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
