import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import UserModel from '@/models/User';

export async function GET() {
  try {
    await connectToDatabase();
    const users = await UserModel.find({}).populate('teams');
    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const newUser = new UserModel(body);
    await newUser.save();
    const populatedUser = await UserModel.findById(newUser._id).populate('teams');
    return NextResponse.json({ success: true, data: populatedUser }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}