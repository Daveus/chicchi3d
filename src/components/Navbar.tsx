'use client';

import Link from 'next/link';
import { Search, ShoppingCart, User, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <Link href="/categoria/auguri" className="text-foreground/80 hover:text-primary transition-soft font-medium">Biglietti 3D</Link>
          </div>

          {/* Right section: Search & Icons */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group">
              <input
                type="text"
                placeholder="Cerca prodotti..."
                className="bg-surface-hover border border-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64 transition-soft"
              />
              <Search className="absolute right-3 top-2.5 text-gray-400 group-focus-within:text-primary w-5 h-5" />
            </div>
            <button className="text-foreground hover:text-primary transition-soft relative p-1">
              <User className="w-6 h-6" />
            </button>
            <button className="text-foreground hover:text-primary transition-soft relative p-1">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-accent text-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
                2
              </span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button className="text-foreground relative p-1">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-accent text-foreground text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center translate-x-1 -translate-y-1">
                2
              </span>
            </button>
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
          <div className="relative">
            <input
              type="text"
              placeholder="Cerca prodotti..."
              className="w-full bg-surface-hover border border-gray-200 rounded-xl py-3 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-soft"
            />
            <Search className="absolute right-3 top-3.5 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex flex-col space-y-3 pt-2">
            <Link href="/categoria/contenitori" className="text-lg font-medium text-foreground hover:text-primary">Contenitori</Link>
            <Link href="/categoria/vignette" className="text-lg font-medium text-foreground hover:text-primary">Vignette</Link>
            <Link href="/categoria/lampade" className="text-lg font-medium text-foreground hover:text-primary">Lampade</Link>
            <Link href="/categoria/auguri" className="text-lg font-medium text-foreground hover:text-primary">Biglietti 3D</Link>
            <div className="h-px bg-gray-100 my-2"></div>
            <Link href="/profile" className="flex items-center space-x-2 text-lg font-medium text-foreground hover:text-primary">
              <User className="w-5 h-5" />
              <span>Il mio Account</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
