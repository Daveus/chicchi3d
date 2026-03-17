import { getCurrentUser } from "@/lib/userActions";
import { redirect } from "next/navigation";
import AccountDashboardClient from "@/app/account/AccountDashboardClient";

export default async function AccountPage() {
    const user = await getCurrentUser();

    if (!user) {
        redirect('/');
    }

    return (
        <main className="min-h-screen pt-28">
            <AccountDashboardClient user={user as any} />
        </main>
    );
}
