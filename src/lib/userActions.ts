'use server';

import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { users, favorites, products, orders, type NewUser, type User } from '@/lib/schema';
import { eq, and, desc } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chicchi3d-user-secret-jwt-key-2026'
);
const COOKIE_NAME = 'user-token';

// --- AUTH ---

export async function registerUser(data: NewUser) {
    // Check if email exists
    const existing = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existing.length > 0) {
        return { error: 'Email già registrata.' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Insert user
    const [newUser] = await db.insert(users).values({
        ...data,
        password: hashedPassword,
    }).returning();

    // Sign JWT
    const token = await new SignJWT({ userId: newUser.id, email: newUser.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

    // Set Cookie
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
    });

    return { success: true, user: { id: newUser.id, nome: newUser.nome, email: newUser.email } };
}

export async function loginUser(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
        return { error: 'Credenziali non valide.' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return { error: 'Credenziali non valide.' };
    }

    const token = await new SignJWT({ userId: user.id, email: user.email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('7d')
        .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
    });

    return { success: true, user: { id: user.id, nome: user.nome, email: user.email } };
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    revalidatePath('/');
    return { success: true };
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) return null;

        const { password, ...safeUser } = user;
        return safeUser;
    } catch {
        return null;
    }
}

// --- PROFILE ---

export async function updateUserProfile(data: Partial<User>) {
    const currentUser = await getCurrentUser();
    if (!currentUser) return { error: 'Non autorizzato.' };

    await db.update(users)
        .set(data)
        .where(eq(users.id, currentUser.id));

    revalidatePath('/account');
    return { success: true };
}

export async function changePassword(oldPw: string, newPw: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return { error: 'Non autorizzato.' };

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
        if (!user) return { error: 'Utente non trovato.' };

        const isMatch = await bcrypt.compare(oldPw, user.password);
        if (!isMatch) return { error: 'Vecchia password errata.' };

        const hashedNewPw = await bcrypt.hash(newPw, 10);
        await db.update(users).set({ password: hashedNewPw }).where(eq(users.id, userId));

        return { success: true };
    } catch {
        return { error: 'Errore durante il cambio password.' };
    }
}

// --- FAVORITES ---

export async function toggleFavorite(productId: string) {
    const user = await getCurrentUser();
    if (!user) return { error: 'Devi effettuare il login.' };

    const existing = await db.select()
        .from(favorites)
        .where(and(eq(favorites.userId, user.id), eq(favorites.productId, productId)))
        .limit(1);

    if (existing.length > 0) {
        await db.delete(favorites).where(eq(favorites.id, existing[0].id));
        revalidatePath('/');
        return { success: true, action: 'removed' };
    } else {
        await db.insert(favorites).values({
            userId: user.id,
            productId: productId,
        });
        revalidatePath('/');
        return { success: true, action: 'added' };
    }
}

export async function getUserFavorites() {
    const user = await getCurrentUser();
    if (!user) return [];

    const result = await db.select({
        product: products
    })
        .from(favorites)
        .innerJoin(products, eq(favorites.productId, products.id))
        .where(eq(favorites.userId, user.id));

    return result.map(r => r.product);
}

export async function getFavoriteIds() {
    const user = await getCurrentUser();
    if (!user) return [];

    const result = await db.select({
        productId: favorites.productId
    })
        .from(favorites)
        .where(eq(favorites.userId, user.id));

    return result.map(r => r.productId);
}

// --- ORDERS ---

export async function getUserOrders() {
    const user = await getCurrentUser();
    if (!user) return [];

    return await db.select()
        .from(orders)
        .where(eq(orders.userId, user.id))
        .orderBy(desc(orders.dataOrdine));
}

// --- CREATE ORDER ---

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
}

export interface CreateOrderData {
    items: OrderItem[];
    totale: number;
    nomeSpedizione: string;
    indirizzoSpedizione: string;
    guestEmail?: string;
}

export async function createOrder(data: CreateOrderData) {
    const currentUser = await getCurrentUser();

    const orderValues = {
        userId: currentUser?.id ?? null,
        guestEmail: currentUser ? null : (data.guestEmail ?? null),
        nomeSpedizione: data.nomeSpedizione,
        indirizzoSpedizione: data.indirizzoSpedizione,
        totale: String(data.totale),
        stato: 'in_elaborazione',
        dettagliProdotti: data.items,
    };

    try {
        const [newOrder] = await db.insert(orders).values(orderValues).returning();
        return { success: true, orderId: newOrder.id };
    } catch (error) {
        console.error('[createOrder] Errore:', error);
        return { error: 'Impossibile salvare l\'ordine. Riprova.' };
    }
}
