import { NextRequest, NextResponse } from 'next/server';
import { Notification } from '@/lib/schemas';
import { issues } from '@/mock-data/issues';
import { users } from '@/mock-data/users';
import { projects } from '@/mock-data/projects';
import { notifications } from '@/lib/db';

export async function GET() {
  const hydratedNotifications = notifications.map((notification) => {
    const issue = issues.find((issue) => issue.id === notification.entityId);
    const actor = users.find((user) => user.id === notification.actorId);

    return {
      ...notification,
      issue,
      actor,
    };
  });
  return NextResponse.json(hydratedNotifications);
}

export async function POST(request: NextRequest) {
  const newNotificationData: Omit<Notification, 'id' | 'createdAt'> = await request.json();
  const newNotification: Notification = {
    ...newNotificationData,
    id: (notifications.length + 1).toString(),
    createdAt: new Date(),
  };
  notifications.push(newNotification);

  const issue = issues.find((issue) => issue.id === newNotification.entityId);
  const actor = users.find((user) => user.id === newNotification.actorId);

  const hydratedNotification = {
    ...newNotification,
    issue,
    actor,
  };

  return NextResponse.json(hydratedNotification, { status: 201 });
}