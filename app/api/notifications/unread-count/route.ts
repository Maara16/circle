import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({
        success: false,
        statusCode: 400,
        message: 'userId is required',
      }, { status: 400 });
    }

    const count = await Notification.countDocuments({
      userId,
      isRead: false,
      isDeleted: false,
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: { count },
    });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      statusCode: 500,
      message: err.message,
    }, { status: 500 });
  }
}