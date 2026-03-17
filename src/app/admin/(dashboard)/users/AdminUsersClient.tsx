'use client';

import { useState } from 'react';
import { Search, User, Mail, Calendar, MapPin } from 'lucide-react';
import { User as UserSchemaType } from '@/lib/schema';
import { motion } from 'framer-motion';

interface AdminUsersClientProps {
    initialUsers: UserSchemaType[];
}

export default function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = initialUsers.filter((user) => {
        const search = searchTerm.toLowerCase();
        return (
            (user.nome?.toLowerCase() || '').includes(search) ||
            (user.cognome?.toLowerCase() || '').includes(search) ||
            (user.email?.toLowerCase() || '').includes(search)
        );
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-3">
                        <User className="w-8 h-8 text-primary" />
                        Utenti Registrati
                    </h1>
                    <p className="text-stone-500 font-medium mt-1">Gestisci i clienti iscritti allo store</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Cerca per nome o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full h-12 pl-12 pr-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none font-medium placeholder:text-stone-400"
                    />
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-hover border-b border-gray-100">
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Utente</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Recapiti</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap">Iscrizione</th>
                                <th className="px-6 py-4 text-[11px] font-black text-stone-500 uppercase tracking-widest whitespace-nowrap text-right">Rif. ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-stone-500 font-medium">
                                        Nessun utente trovato con questi criteri di ricerca.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        key={user.id} 
                                        className="hover:bg-surface-hover/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                                                    {user.nome[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{user.nome} {user.cognome}</p>
                                                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium mt-0.5">
                                                        <Mail className="w-3 h-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {user.indirizzo || user.citta ? (
                                                    <>
                                                        <span className="text-sm font-medium text-foreground">{user.indirizzo || '-'}</span>
                                                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                                            <MapPin className="w-3 h-3" />
                                                            {user.cap} {user.citta}
                                                        </div>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-stone-400 italic">Dati non inseriti</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm font-medium text-stone-600">
                                                <Calendar className="w-4 h-4 text-stone-400" />
                                                {new Date(user.createdAt).toLocaleDateString('it-IT', { 
                                                    day: '2-digit', month: 'short', year: 'numeric' 
                                                })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <code className="bg-gray-50 px-2 py-1 rounded text-xs text-stone-500 font-mono tracking-tighter">
                                                {(user.id as string).split('-')[0]}
                                            </code>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
