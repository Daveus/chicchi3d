'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CATEGORY_SLUG: Record<string, string> = {
    'Contenitori': 'contenitori',
    'Vignette': 'vignette',
    'Lampade': 'lampade',
    'Biglietti 3D': 'biglietti-3d',
};

interface SearchResult {
    id: string;
    name: string;
    category: string;
    price: string;
    images: string[];
}

const PAGE_SIZE = 10;

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [isFetchingMore, setIsFetchingMore] = useState(false);

    const debouncedQuery = useDebounce(query, 300);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Fetch initial search results
    useEffect(() => {
        if (debouncedQuery.length < 3) {
            setResults([]);
            setIsOpen(false);
            setHasMore(false);
            setOffset(0);
            return;
        }

        let cancelled = false;
        setIsLoading(true);
        setOffset(0);

        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&offset=0&limit=${PAGE_SIZE}`)
            .then(r => r.json())
            .then(data => {
                if (cancelled) return;
                setResults(data.results);
                setHasMore(data.hasMore);
                setOffset(PAGE_SIZE);
                setIsOpen(true);
            })
            .catch(() => {
                if (!cancelled) setResults([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => { cancelled = true; };
    }, [debouncedQuery]);

    // Load more results (infinite scroll)
    const loadMore = useCallback(() => {
        if (isFetchingMore || !hasMore || debouncedQuery.length < 3) return;
        setIsFetchingMore(true);

        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}&offset=${offset}&limit=${PAGE_SIZE}`)
            .then(r => r.json())
            .then(data => {
                setResults(prev => [...prev, ...data.results]);
                setHasMore(data.hasMore);
                setOffset(prev => prev + PAGE_SIZE);
            })
            .finally(() => setIsFetchingMore(false));
    }, [debouncedQuery, offset, hasMore, isFetchingMore]);

    // Intersection Observer for infinite scroll inside dropdown
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            entries => { if (entries[0].isIntersecting) loadMore(); },
            { root: dropdownRef.current, threshold: 0.1 }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [loadMore]);

    // Close on outside click
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    const handleResultClick = (product: SearchResult) => {
        setIsOpen(false);
        setQuery('');
        const slug = CATEGORY_SLUG[product.category] ?? 'contenitori';
        router.push(`/categoria/${slug}`);
    };

    return (
        <div ref={containerRef} className="relative group">
            {/* Input */}
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onFocus={() => results.length > 0 && setIsOpen(true)}
                    placeholder="Cerca prodotti..."
                    className="bg-surface-hover border border-gray-200 rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64 transition-soft text-sm"
                    aria-label="Cerca prodotti"
                    aria-expanded={isOpen}
                    aria-haspopup="listbox"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {query.length > 0 ? (
                        <button
                            onClick={handleClear}
                            className="text-stone-500 hover:text-foreground transition-soft"
                            aria-label="Cancella ricerca"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    ) : (
                        isLoading
                            ? <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                            : <Search className="w-4 h-4 text-stone-500 group-focus-within:text-primary transition-soft" />
                    )}
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    role="listbox"
                    aria-label="Risultati ricerca"
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 max-h-[400px] overflow-y-auto z-[999] w-80"
                    style={{ minWidth: '20rem' }}
                >
                    {results.length === 0 && !isLoading ? (
                        <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                            <ShoppingBag className="w-10 h-10 text-gray-200 mb-3" />
                            <p className="text-sm font-semibold text-stone-500">Nessun prodotto trovato</p>
                            <p className="text-xs text-stone-400 mt-1">Prova con un termine diverso</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-50">
                            {results.map(product => (
                                <li key={product.id} role="option" aria-selected="false">
                                    <button
                                        onClick={() => handleResultClick(product)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface transition-soft text-left"
                                    >
                                        {/* Miniatura */}
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-surface-hover border border-gray-100">
                                            {product.images?.[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-stone-400">
                                                    {product.name.slice(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{product.name}</p>
                                            <p className="text-xs text-stone-500">{product.category}</p>
                                        </div>

                                        {/* Prezzo */}
                                        <span className="flex-shrink-0 text-sm font-black text-primary">
                                            €{parseFloat(product.price).toFixed(2)}
                                        </span>
                                    </button>
                                </li>
                            ))}

                            {/* Sentinel per infinite scroll */}
                            <li>
                                <div ref={sentinelRef} className="h-1" />
                            </li>

                            {isFetchingMore && (
                                <li className="flex justify-center py-3">
                                    <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                                </li>
                            )}

                            {!hasMore && results.length > 0 && (
                                <li className="px-4 py-2 text-center text-xs text-stone-400">
                                    Tutti i risultati visualizzati
                                </li>
                            )}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
