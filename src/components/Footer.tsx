import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">

                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-black tracking-tighter text-foreground">
                            Chicchi <span className="text-primary">3D</span>
                        </Link>
                        <p className="text-stone-600 text-sm leading-relaxed">
                            Diamo forma alle tue idee con stampe 3D personalizzate. Giocose, colorate, uniche! Made in Italy con ❤️.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 text-foreground">Esplora</h3>
                        <ul className="space-y-3">
                            <li><Link href="/shop" className="text-stone-600 hover:text-primary transition-soft">Tutti i prodotti</Link></li>
                            <li><Link href="/categoria/contenitori" className="text-stone-600 hover:text-primary transition-soft">Contenitori</Link></li>
                            <li><Link href="/categoria/vignette" className="text-stone-600 hover:text-primary transition-soft">Vignette</Link></li>
                            <li><Link href="/categoria/lampade" className="text-stone-600 hover:text-primary transition-soft">Lampade</Link></li>
                            <li><Link href="/categoria/auguri" className="text-stone-600 hover:text-primary transition-soft">Biglietti 3D</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 text-foreground">Supporto</h3>
                        <ul className="space-y-3">
                            <li><Link href="/faq" className="text-stone-600 hover:text-primary transition-soft">FAQ</Link></li>
                            <li><Link href="/spedizioni" className="text-stone-600 hover:text-primary transition-soft">Spedizioni & Resi</Link></li>
                            <li><Link href="/contatti" className="text-stone-600 hover:text-primary transition-soft">Contattaci</Link></li>
                            <li><Link href="/privacy" className="text-stone-600 hover:text-primary transition-soft">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-4 text-foreground">Iscriviti al Club!</h3>
                        <p className="text-stone-600 text-sm mb-4">Ricevi sconti zuccherati e novità pazzesche.</p>
                        <form className="flex flex-col space-y-2">
                            <input
                                type="email"
                                placeholder="La tua email"
                                className="w-full bg-surface-hover border border-gray-200 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-soft"
                            />
                            <button
                                type="button"
                                className="w-full bg-foreground text-background font-bold py-3 px-4 rounded-xl hover:bg-foreground/90 transition-soft active:scale-[0.98]"
                            >
                                Iscrivimi
                            </button>
                        </form>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-stone-600">
                    <p>© {new Date().getFullYear()} Chicchi 3D. Tutti i diritti riservati.</p>
                    <div className="flex space-x-6">
                        {/* Social Icons Placeholder */}
                        <a href="#" className="hover:text-primary transition-soft flex items-center justify-center w-8 h-8 rounded-full bg-surface-hover">Ig</a>
                        <a href="#" className="hover:text-primary transition-soft flex items-center justify-center w-8 h-8 rounded-full bg-surface-hover">Fb</a>
                        <a href="#" className="hover:text-primary transition-soft flex items-center justify-center w-8 h-8 rounded-full bg-surface-hover">Tt</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
