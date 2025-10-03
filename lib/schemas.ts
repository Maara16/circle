export type NotificationType =
  | 'comment'
  | 'mention'
  | 'assignment'
  | 'status'
  | 'reopened'
  | 'closed'
  | 'edited'
  | 'created'
  | 'upload';

export interface Notification {
  id: string;
  userId: string; // The ID of the user receiving the notification
  actorId: string; // The ID of the user who triggered the notification
  type: NotificationType;
  message: string;
  entityId?: string;
  isRead: boolean;
  createdAt: Date;
}