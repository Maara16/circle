import mongoose, { Schema, Document } from 'mongoose';
import { NotificationType } from '@/lib/schemas';

export interface INotification extends Document {
  uid: string;
  userId: string;
  actorId: string;
  type: NotificationType;
  message: string;
  entityId?: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>({
  uid: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
    index: true,
  },
  actorId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['comment', 'mention', 'assignment', 'status', 'reopened', 'closed', 'edited', 'created', 'upload'],
  },
  message: {
    type: String,
    required: true,
  },
  entityId: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', notificationSchema);