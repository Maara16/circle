import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { issues } from '@/mock-data/issues';
import { users } from '@/mock-data/users';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const query: { isDeleted: boolean; userId?: string } = { isDeleted: false };
    if (userId) {
      query.userId = userId;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const hydratedNotifications = notifications.map((notification) => {
        const issue = issues.find((issue) => issue.id === notification.entityId);
        const actor = users.find((user) => user.id === notification.actorId);

        return {
        ...notification,
        issue,
        actor,
        };
    });

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: hydratedNotifications,
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

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    const notification = await Notification.create({
      ...data,
      uid: uuidv4(),
      isRead: false,
      isDeleted: false,
    });

    const issue = issues.find((issue) => issue.id === notification.entityId);
    const actor = users.find((user) => user.id === notification.actorId);

    const hydratedNotification = {
        ...notification.toObject(),
        issue,
        actor,
    };

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: hydratedNotification,
    }, { status: 201 });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({
      success: false,
      statusCode: 500,
      message: err.message,
    }, { status: 500 });
  }
}