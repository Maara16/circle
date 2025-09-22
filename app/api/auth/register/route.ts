import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json({ success: false, error: 'User with this email already exists' }, { status: 400 });
    }

    const user = new User({
      name,
      email,
      password,
    });

    await user.save();

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
