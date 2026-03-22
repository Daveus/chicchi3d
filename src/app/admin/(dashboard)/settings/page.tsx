import { getAdminSettings } from '@/lib/adminActions';
import AdminSettingsClient from './AdminSettingsClient';

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const adminRecord = await getAdminSettings();

    return (
        <div className="p-8 max-w-2xl">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-black text-white">Impostazioni Sicurezza</h1>
                <p className="text-slate-400 text-sm mt-1">
                    Gestisci le credenziali di accesso al pannello admin.
                </p>
            </div>

            <AdminSettingsClient currentUsername={adminRecord?.username ?? 'admin'} />
        </div>
    );
}
