'use client';

import { useActionState } from 'react';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { changeAdminUsername, changeAdminPassword } from '@/lib/adminActions';
import { User, Lock, ShieldCheck } from 'lucide-react';

type ActionState = { error: string; success: string };
const initialState: ActionState = { error: '', success: '' };

// ─── Cambio Username Form ────────────────────────────────────────────────────
function ChangeUsernameForm({ currentUsername }: { currentUsername: string }) {
    const [state, formAction, isPending] = useActionState(changeAdminUsername, initialState);

    useEffect(() => {
        if (state.error) toast.error(state.error);
        if (state.success) toast.success(state.success);
    }, [state]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Cambio Username</h3>
                    <p className="text-slate-500 text-xs">
                        Username attuale: <span className="text-slate-300 font-mono">{currentUsername}</span>
                    </p>
                </div>
            </div>

            <form action={formAction} className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Nuovo Username
                    </label>
                    <input
                        name="newUsername"
                        type="text"
                        required
                        minLength={3}
                        placeholder="nuovo_username"
                        className="w-full bg-slate-800 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    />
                </div>

                {state.error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvataggio...
                        </>
                    ) : (
                        'Aggiorna Username'
                    )}
                </button>
            </form>
        </div>
    );
}

// ─── Cambio Password Form ────────────────────────────────────────────────────
function ChangePasswordForm() {
    const [state, formAction, isPending] = useActionState(changeAdminPassword, initialState);

    useEffect(() => {
        if (state.error) toast.error(state.error);
        if (state.success) toast.success(state.success);
    }, [state]);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 bg-pink-500/20 rounded-xl flex items-center justify-center">
                    <Lock className="w-4 h-4 text-pink-400" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Cambio Password</h3>
                    <p className="text-slate-500 text-xs">Minimo 6 caratteri. Verrai disconnesso dopo il cambio.</p>
                </div>
            </div>

            <form action={formAction} className="space-y-3">
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Password Attuale
                    </label>
                    <input
                        name="oldPassword"
                        type="password"
                        required
                        placeholder="••••••"
                        autoComplete="current-password"
                        className="w-full bg-slate-800 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Nuova Password
                    </label>
                    <input
                        name="newPassword"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••"
                        autoComplete="new-password"
                        className="w-full bg-slate-800 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Conferma Nuova Password
                    </label>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        minLength={6}
                        placeholder="••••••"
                        autoComplete="new-password"
                        className="w-full bg-slate-800 border border-white/10 text-white placeholder-slate-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 focus:border-pink-500/50 transition-all"
                    />
                </div>

                {state.error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                        {state.error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-1"
                >
                    {isPending ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Salvataggio...
                        </>
                    ) : (
                        'Aggiorna Password'
                    )}
                </button>
            </form>
        </div>
    );
}

// ─── Root Client Component ───────────────────────────────────────────────────
export default function AdminSettingsClient({ currentUsername }: { currentUsername: string }) {
    return (
        <div className="space-y-6">
            {/* Banner info */}
            <div className="flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3">
                <ShieldCheck className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-amber-300 text-xs leading-relaxed">
                    Dopo ogni modifica verrai disconnesso automaticamente e dovrai effettuare nuovamente il login con le nuove credenziali.
                </p>
            </div>

            <ChangeUsernameForm currentUsername={currentUsername} />
            <ChangePasswordForm />
        </div>
    );
}
