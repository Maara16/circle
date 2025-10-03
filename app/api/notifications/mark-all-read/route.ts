import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/db';

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        statusCode: 400,
        message: 'userId is required',
      }, { status: 400 });
    }

    await Notification.updateMany(
      { userId, isRead: false, isDeleted: false },
      { isRead: true, updatedAt: new Date() }
    );

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'All notifications marked as read',
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