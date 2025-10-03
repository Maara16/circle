import { NextRequest, NextResponse } from 'next/server';
import { notifications } from '@/lib/db';
import { issues } from '@/mock-data/issues';
import { users } from '@/mock-data/users';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { isRead } = await request.json();
  const notificationIndex = notifications.findIndex((n) => n.id === id);

  if (notificationIndex === -1) {
    return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
  }

  notifications[notificationIndex].isRead = isRead;
  const updatedNotification = notifications[notificationIndex];

  const issue = issues.find((issue) => issue.id === updatedNotification.entityId);
  const actor = users.find((user) => user.id === updatedNotification.actorId);

  const hydratedNotification = {
    ...updatedNotification,
    issue,
    actor,
  };

  return NextResponse.json(hydratedNotification);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const notificationIndex = notifications.findIndex((n) => n.id === id);

  if (notificationIndex === -1) {
    return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
  }

  const [deletedNotification] = notifications.splice(notificationIndex, 1);

  const issue = issues.find((issue) => issue.id === deletedNotification.entityId);
  const actor = users.find((user) => user.id === deletedNotification.actorId);

  const hydratedNotification = {
    ...deletedNotification,
    issue,
    actor,
  };

  return NextResponse.json(hydratedNotification);
}