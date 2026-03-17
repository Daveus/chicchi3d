'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCurrentUser, logoutUser, getFavoriteIds, toggleFavorite as toggleFavoriteAction } from '@/lib/userActions';
import { toast } from 'sonner';

interface AuthUser {
    id: string;
    email: string;
    nome: string;
    cognome: string;
    indirizzo?: string | null;
    citta?: string | null;
    cap?: string | null;
}

interface AuthContextType {
    user: AuthUser | null;
    isLoading: boolean;
    isLoginOpen: boolean;
    favorites: string[];
    openLogin: () => void;
    closeLogin: () => void;
    login: (userData: AuthUser) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    toggleFavorite: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]);

    const refreshUser = useCallback(async () => {
        setIsLoading(true);
        try {
            const [userData, favoriteIds] = await Promise.all([
                getCurrentUser(),
                getFavoriteIds()
            ]);
            setUser(userData as AuthUser | null);
            setFavorites(favoriteIds || []);
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
            setFavorites([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const openLogin = () => setIsLoginOpen(true);
    const closeLogin = () => setIsLoginOpen(false);

    const login = (userData: AuthUser) => {
        setUser(userData);
        setIsLoginOpen(false);
        // Refresh to fetch favorites after login
        refreshUser();
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
        setFavorites([]);
    };

    const toggleFavorite = async (productId: string) => {
        if (!user) {
            openLogin();
            return;
        }

        const wasFavorite = favorites.includes(productId);
        
        // Optimistic Update
        setFavorites(prev => 
            wasFavorite 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );

        try {
            const result = await toggleFavoriteAction(productId);
            if (result.error) {
                throw new Error(result.error);
            }
        } catch (error) {
            // Rollback on error
            setFavorites(prev => 
                wasFavorite 
                    ? [...prev, productId]
                    : prev.filter(id => id !== productId)
            );
            toast.error('Errore durante l\'aggiornamento dei preferiti.');
            console.error('Toggle favorite error:', error);
        }
    };

    const isFavorite = useCallback((productId: string) => {
        return favorites.includes(productId);
    }, [favorites]);

    return (
        <AuthContext.Provider value={{
            user,
            isLoading,
            isLoginOpen,
            favorites,
            openLogin,
            closeLogin,
            login,
            logout,
            refreshUser,
            toggleFavorite,
            isFavorite
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
