'use client';

import Link from 'next/link';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '@/components/SearchBar';
import AccountDropdown from '@/components/AccountDropdown';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const prevTotalRef = useRef(totalItems);
  const [badgeBump, setBadgeBump] = useState(false);

  // Animazione bump quando viene aggiunto un articolo
  useEffect(() => {
    if (totalItems > prevTotalRef.current) {
      setBadgeBump(true);
      setTimeout(() => setBadgeBump(false), 400);
    }
    prevTotalRef.current = totalItems;
  }, [totalItems]);

  const CartButton = ({ mobile = false }: { mobile?: boolean }) => (
    <button
      onClick={openCart}
      className={`text-foreground hover:text-primary transition-soft relative p-1 ${mobile ? '' : ''}`}
    >
      <ShoppingCart className="w-6 h-6" />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key="badge"
            initial={{ scale: 0 }}
            animate={{ scale: badgeBump ? 1.4 : 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            className="absolute top-0 right-0 bg-primary-dark text-foreground text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1 leading-none"
          >
            {totalItems > 9 ? '9+' : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-surface-hover">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black tracking-tighter text-foreground hover:text-primary transition-soft">
              Chicchi <span className="text-primary">3D</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 items-center">
            <Link href="/categoria/contenitori" className="text-foreground/80 hover:text-primary transition-soft font-medium">Contenitori</Link>
            <Link href="/categoria/vignette" className="text-foreground/80 hover:text-primary transition-soft font-medium">Vignette</Link>
            <Link href="/categoria/lampade" className="text-foreground/80 hover:text-primary transition-soft font-medium">Lampade</Link>
            <Link href="/categoria/biglietti-3d" className="text-foreground/80 hover:text-primary transition-soft font-medium">Biglietti 3D</Link>
            <Link href="/crea-su-misura" className="bg-primary/10 text-primary hover:bg-primary/20 transition-all px-4 py-1.5 rounded-full font-black text-xs uppercase tracking-widest">Crea su Misura</Link>
          </div>

          {/* Right section: Search & Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <SearchBar />
            <AccountDropdown />
            <CartButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <CartButton mobile />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-foreground hover:text-primary transition-soft p-1"
            >
              <Menu className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-surface-hover px-4 pt-2 pb-6 space-y-4 shadow-soft">
          <SearchBar />
          <div className="flex flex-col space-y-3 pt-2">
            <Link href="/categoria/contenitori" className="text-lg font-medium text-foreground hover:text-primary">Contenitori</Link>
            <Link href="/categoria/vignette" className="text-lg font-medium text-foreground hover:text-primary">Vignette</Link>
            <Link href="/categoria/lampade" className="text-lg font-medium text-foreground hover:text-primary">Lampade</Link>
            <Link href="/categoria/biglietti-3d" className="text-lg font-medium text-foreground hover:text-primary">Biglietti 3D</Link>
            <Link href="/crea-su-misura" className="text-lg font-black text-primary hover:text-primary-dark">Crea su Misura</Link>
            <div className="h-px bg-gray-100 my-2"></div>
            <Link href="/account" className="flex items-center space-x-2 text-lg font-medium text-foreground hover:text-primary">
              <User className="w-5 h-5" />
              <span>Il mio Account</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
