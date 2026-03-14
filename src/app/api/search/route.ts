import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products } from '@/lib/schema';
import { or, ilike, sql } from 'drizzle-orm';

const PAGE_SIZE = 10;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q')?.trim() ?? '';
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);
    const limit = parseInt(searchParams.get('limit') ?? String(PAGE_SIZE), 10);

    if (q.length < 3) {
        return NextResponse.json({ results: [], hasMore: false });
    }

    const pattern = `%${q}%`;

    const rows = await db
        .select({
            id: products.id,
            name: products.name,
            category: products.category,
            price: products.price,
            images: products.images,
            description: products.description,
        })
        .from(products)
        .where(
            or(
                ilike(products.name, pattern),
                ilike(products.description, pattern)
            )
        )
        .limit(limit + 1)   // fetch one extra to detect if there are more results
        .offset(offset);

    const hasMore = rows.length > limit;
    const results = hasMore ? rows.slice(0, limit) : rows;

    return NextResponse.json({ results, hasMore });
}
