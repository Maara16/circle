import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(request: Request) {
  await dbConnect();

  try {
    const users = await User.find({}).select('-password');
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    const e = error as Error;
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
