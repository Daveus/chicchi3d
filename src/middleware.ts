import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chicchi3d-super-secret-jwt-key-2026'
);

const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Solo le rotte /admin/* (escluso /admin/login)
    if (!pathname.startsWith('/admin')) return NextResponse.next();
    if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }

    try {
        await jwtVerify(token, JWT_SECRET);
        return NextResponse.next();
    } catch {
        // Token scaduto o non valido
        const loginUrl = new URL('/admin/login', request.url);
        const response = NextResponse.redirect(loginUrl);
        response.cookies.delete('admin-token');
        return response;
    }
}

export const config = {
    matcher: ['/admin/:path*'],
};
