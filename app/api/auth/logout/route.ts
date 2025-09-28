import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  cookies().set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  return NextResponse.json({ success: true, message: 'Logged out successfully' });
}