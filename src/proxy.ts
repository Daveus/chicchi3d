import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'chicchi3d-super-secret-jwt-key-2026'
);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Protezione /admin
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = request.cookies.get('admin-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // Protezione /account
    if (pathname.startsWith('/account')) {
        const token = request.cookies.get('user-token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/', request.url));
        }

        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/account/:path*'],
};
