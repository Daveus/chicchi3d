'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SignJWT } from 'jose';
import { db } from '@/lib/db';
import { products, type NewProduct } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chicchi3d-super-secret-jwt-key-2026'
);

// --- AUTH ---
export async function loginAction(prevState: { error: string }, formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    if (username === 'admin' && password === 'admin') {
        const token = await new SignJWT({ role: 'admin' })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('8h')
            .sign(JWT_SECRET);

        const cookieStore = await cookies();
        cookieStore.set('admin-token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 8,
            path: '/',
        });

        redirect('/admin');
    }

    return { error: 'Credenziali non valide. Riprova.' };
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('admin-token');
    redirect('/admin/login');
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
