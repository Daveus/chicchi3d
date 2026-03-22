'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';
import { products, users, orders, adminSettings, type NewProduct } from '@/lib/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chicchi3d-super-secret-jwt-key-2026'
);

// Blacklist di password troppo deboli
const WEAK_PASSWORDS = ['admin', 'password', '123456', '12345678', 'qwerty', 'pass', 'admin123'];

// --- SEED ADMIN (lazy init) ---
async function ensureAdminSettingsSeeded() {
    const existing = await db.select().from(adminSettings).limit(1);
    if (existing.length === 0) {
        const initUsername = process.env.ADMIN_USERNAME || 'admin';
        const initPassword = process.env.ADMIN_PASSWORD || 'chicchi3d-admin-2026';
        const passwordHash = await bcrypt.hash(initPassword, 10);
        await db.insert(adminSettings).values({ username: initUsername, passwordHash });
    }
}

// --- AUTH ---
export async function loginAction(prevState: { error: string }, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // Seed le credenziali default se la tabella è vuota
    await ensureAdminSettingsSeeded();

    const [adminRecord] = await db
        .select()
        .from(adminSettings)
        .limit(1);

    const isValid =
        adminRecord &&
        adminRecord.username === username &&
        (await bcrypt.compare(password, adminRecord.passwordHash));

    if (!isValid) {
        return { error: 'Credenziali non valide. Riprova.' };
    }

    const token = await new SignJWT({ role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('8h')
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('admin-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 8,
        path: '/',
    });

    redirect('/admin');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin-token');
    redirect('/admin/login');
}

// --- ADMIN SETTINGS ---
export async function getAdminSettings() {
    await ensureAdminSettingsSeeded();
    const [record] = await db.select().from(adminSettings).limit(1);
    return record ?? null;
}

export async function changeAdminUsername(
    prevState: { error: string; success: string },
    formData: FormData
) {
    const newUsername = (formData.get('newUsername') as string)?.trim();

    if (!newUsername || newUsername.length < 3) {
        return { error: "L'username deve avere almeno 3 caratteri.", success: '' };
    }

    const [record] = await db.select().from(adminSettings).limit(1);
    if (!record) return { error: 'Record admin non trovato.', success: '' };

    await db
        .update(adminSettings)
        .set({ username: newUsername, updatedAt: new Date() })
        .where(eq(adminSettings.id, record.id));

    // Invalida il cookie lato server
    const cookieStore = await cookies();
    cookieStore.delete('admin-token');

    return { error: '', success: 'Username aggiornato. Effettua nuovamente il login.' };
}

export async function changeAdminPassword(
    prevState: { error: string; success: string },
    formData: FormData
) {
    const oldPassword = formData.get('oldPassword') as string;
    const newPassword = (formData.get('newPassword') as string)?.trim();
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!oldPassword || !newPassword || !confirmPassword) {
        return { error: 'Tutti i campi sono obbligatori.', success: '' };
    }

    if (newPassword.length < 8) {
        return { error: 'La nuova password deve avere almeno 8 caratteri.', success: '' };
    }

    if (WEAK_PASSWORDS.includes(newPassword.toLowerCase())) {
        return { error: '⚠️ Password troppo debole e compromessa. Scegli una password più sicura.', success: '' };
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Le password non coincidono.', success: '' };
    }

    const [record] = await db.select().from(adminSettings).limit(1);
    if (!record) return { error: 'Record admin non trovato.', success: '' };

    const isOldValid = await bcrypt.compare(oldPassword, record.passwordHash);
    if (!isOldValid) {
        return { error: 'La password attuale non è corretta.', success: '' };
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await db
        .update(adminSettings)
        .set({ passwordHash: newHash, updatedAt: new Date() })
        .where(eq(adminSettings.id, record.id));

    // Invalida il cookie lato server
    const cookieStore = await cookies();
    cookieStore.delete('admin-token');

    return { error: '', success: 'Password aggiornata. Effettua nuovamente il login.' };
}

// --- PRODUCTS CRUD ---
export async function getProducts() {
    return await db.select().from(products).orderBy(desc(products.createdAt));
}

export async function getProductById(id: string) {
    const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
    return result[0] ?? null;
}

export async function createProduct(data: NewProduct) {
    await db.insert(products).values(data);
    revalidatePath('/admin');
}

export async function updateProduct(id: string, data: Partial<NewProduct>) {
    await db.update(products).set(data).where(eq(products.id, id));
    revalidatePath('/admin');
}

export async function deleteProduct(id: string) {
    await db.delete(products).where(eq(products.id, id));
    revalidatePath('/admin');
}

export async function incrementSales(id: string) {
    await db.update(products)
        .set({ numberSaled: sql`${products.numberSaled} + 1` })
        .where(eq(products.id, id));
    revalidatePath('/admin');
}

// --- USERS CRUD (Admin) ---
export async function getAllUsers() {
    return await db.select().from(users).orderBy(desc(users.createdAt));
}

// --- ORDERS CRUD (Admin) ---
export async function getAllOrders() {
    return await db.select({
        order: orders,
        user: {
            id: users.id,
            nome: users.nome,
            cognome: users.cognome,
            email: users.email
        }
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.dataOrdine));
}

export async function getOrderById(id: string) {
    const result = await db.select({
        order: orders,
        user: {
            id: users.id,
            nome: users.nome,
            cognome: users.cognome,
            email: users.email
        }
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .where(eq(orders.id, id))
    .limit(1);

    return result[0] ?? null;
}

export async function updateOrderStatus(id: string, newStatus: string) {
    await db.update(orders)
        .set({ stato: newStatus })
        .where(eq(orders.id, id));

    revalidatePath('/admin/orders');
    revalidatePath('/admin/orders/[id]', 'page');
    revalidatePath('/account');

    return { success: true };
}
