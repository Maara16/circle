import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/models/Notification';
import dbConnect from '@/lib/db';
import { issues } from '@/mock-data/issues';
import { users } from '@/mock-data/users';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;
    const { isRead } = await request.json();

    const notification = await Notification.findOneAndUpdate(
      { uid: id, isDeleted: false },
      { isRead, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({
        success: false,
        statusCode: 404,
        message: 'Notification not found',
      }, { status: 404 });
    }

    const issue = issues.find((issue) => issue.id === notification.entityId);
    const actor = users.find((user) => user.id === notification.actorId);

    const hydratedNotification = {
      ...notification.toObject(),
      issue,
      actor,
    };

    return NextResponse.json({
      success: true,
      statusCode: 200,
      data: hydratedNotification,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();

    const { id } = params;

    const notification = await Notification.findOneAndUpdate(
      { uid: id, isDeleted: false },
      { isDeleted: true, updatedAt: new Date() },
      { new: true }
    );

    if (!notification) {
      return NextResponse.json({
        success: false,
        statusCode: 404,
        message: 'Notification not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      statusCode: 200,
      message: 'Notification deleted successfully',
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