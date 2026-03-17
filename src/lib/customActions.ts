'use server';

import { db } from '@/lib/db';
import { customOrders } from '@/lib/schema';
import { revalidatePath } from 'next/cache';

export async function submitCustomOrder(data: {
    userId: string;
    productType: string;
    configurationData: any;
    baseText?: string;
    notes?: string;
}) {
    try {
        await db.insert(customOrders).values({
            userId: data.userId,
            productType: data.productType,
            configurationData: data.configurationData,
            baseText: data.baseText,
            notes: data.notes,
        });

        revalidatePath('/account');
        return { success: true };
    } catch (error) {
        console.error('Error submitting custom order:', error);
        return { success: false, error: 'Database submission failed' };
    }
}
