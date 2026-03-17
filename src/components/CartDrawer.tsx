'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, ArrowRight, Minus, Plus } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
    const { items, isCartOpen, closeCart, removeItem, clearCart, totalItems, totalPrice, addItem } = useCart();

    const handleIncreaseQty = (item: { id: string; name: string; price: number; image?: string }) => {
        addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
    };

    const handleDecreaseQty = (id: string) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        if (item.quantity <= 1) {
            removeItem(id);
        } else {
            // Decrementa: rimuovi e reinserisci con qty-1
            // Usiamo un trucco diretto: aggiorniamo via removeItem + addItem × (qty-1)
            removeItem(id);
            for (let i = 0; i < item.quantity - 1; i++) {
                addItem({ id: item.id, name: item.name, price: item.price, image: item.image });
            }
        }
    };

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-surface shadow-2xl z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="w-5 h-5 text-primary-dark" />
                                <h2 className="text-lg font-bold text-foreground">Il tuo carrello</h2>
                                {totalItems > 0 && (
                                    <span className="bg-primary text-foreground text-xs font-bold rounded-full px-2 py-0.5">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={closeCart}
                                className="p-2 rounded-xl hover:bg-gray-100 text-stone-500 hover:text-foreground transition-soft"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Corpo */}
                        <div className="flex-1 overflow-y-auto px-6 py-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center gap-6 pb-20">
                                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                                        <ShoppingCart className="w-10 h-10 text-primary-dark" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground text-lg">Il carrello è vuoto</p>
                                        <p className="text-sm text-stone-500 mt-1">Aggiungi qualcosa di speciale!</p>
                                    </div>
                                    <Link
                                        href="/shop"
                                        onClick={closeCart}
                                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-foreground font-semibold px-6 py-3 rounded-xl transition-soft"
                                    >
                                        Vai allo Shop
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="flex gap-4 p-4 bg-background rounded-2xl border border-gray-100"
                                        >
                                            {/* Miniatura */}
                                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-primary/10 flex-shrink-0">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingCart className="w-6 h-6 text-primary-dark/40" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-foreground text-sm line-clamp-2 leading-tight">{item.name}</p>
                                                <p className="text-primary-dark font-bold text-sm mt-1">
                                                    €{(item.price * item.quantity).toFixed(2)}
                                                </p>
                                                <p className="text-xs text-stone-500">
                                                    €{item.price.toFixed(2)} × {item.quantity}
                                                </p>

                                                {/* Qty controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleDecreaseQty(item.id)}
                                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-primary/20 flex items-center justify-center transition-soft"
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleIncreaseQty(item)}
                                                        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-primary/20 flex items-center justify-center transition-soft"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Rimuovi */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-400 hover:bg-red-50 transition-soft flex-shrink-0 self-start"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer con totale e CTA */}
                        {items.length > 0 && (
                            <div className="border-t border-gray-100 px-6 py-5 space-y-4 bg-surface">
                                {/* Svuota */}
                                <button
                                    onClick={clearCart}
                                    className="flex items-center gap-2 text-sm text-stone-500 hover:text-red-400 transition-soft"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Svuota carrello
                                </button>

                                {/* Totale */}
                                <div className="flex items-center justify-between">
                                    <span className="text-stone-600 font-medium">Totale</span>
                                    <span className="text-2xl font-black text-foreground">€{totalPrice.toFixed(2)}</span>
                                </div>

                                {/* CTA */}
                                <Link
                                    href="/checkout"
                                    onClick={closeCart}
                                    className="flex items-center justify-center gap-2 w-full bg-foreground text-background font-bold py-4 rounded-2xl hover:opacity-80 transition-soft text-base"
                                >
                                    Procedi al Checkout
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
