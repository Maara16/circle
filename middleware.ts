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

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  const token = req.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Authorization token not found' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    await jwtVerify(token, getSecret());
    return NextResponse.next();
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ success: false, error: 'Invalid token' }),
      { status: 401, headers: { 'content-type': 'application/json' } }
    );
  }
}

export const config = {
  matcher: '/api/:path*',
};
