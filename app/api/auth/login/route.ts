import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1d',
    });

    // Return user and token, but don't include password in the user object
    const userResponse = { ...user.toObject() };
    delete userResponse.password;

    return NextResponse.json({ success: true, data: { user: userResponse, token } });
  } catch (error) {
    const e = error as Error
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
