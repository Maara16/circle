import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const getSecret = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
    return new TextEncoder().encode(secret);
};

const publicPaths = ['/login', '/register', '/api/auth/login', '/api/auth/register'];

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const { pathname } = req.nextUrl;

    let isAuthenticated = false;
    if (token) {
        try {
            await jwtVerify(token, getSecret());
            isAuthenticated = true;
        } catch (error) {
            isAuthenticated = false;
        }
    }

    const isPublic = publicPaths.some(path => pathname.startsWith(path));

    if (isAuthenticated) {
        if (isPublic && !pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    } else {
        if (!isPublic) {
            if (pathname.startsWith('/api')) {
                return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
            }
            const response = NextResponse.redirect(new URL('/login', req.url));
            if (token) {
                response.cookies.delete('token');
            }
            return response;
        }
        return NextResponse.next();
    }
}

export const config = {
  matcher: [
    // Match all paths except for the ones starting with:
    // - /api (API routes)
    // - /_next/static (static files)
    // - /_next/image (image optimization files)
    // - /favicon.ico (favicon file)
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Match all API routes except for the auth routes
    '/api/((?!auth).*)',
  ],
};