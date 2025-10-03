import { create } from 'zustand';
import { Notification } from '@/lib/schemas';
import { Issue } from '@/mock-data/issues';
import { User } from '@/mock-data/users';
import { NotificationType } from '@/mock-data/inbox';

export type HydratedNotification = Notification & {
  issue?: Issue;
  actor?: User;
};

interface NotificationsState {
   // Data
   notifications: HydratedNotification[];
   selectedNotification: HydratedNotification | undefined;

   // Actions
   fetchNotifications: () => Promise<void>;
   setNotifications: (notifications: HydratedNotification[]) => void;
   setSelectedNotification: (notification: HydratedNotification | undefined) => void;
   markAsRead: (id: string) => void;
   markAllAsRead: () => void;
   markAsUnread: (id: string) => void;

   // Filters
   getUnreadNotifications: () => HydratedNotification[];
   getReadNotifications: () => HydratedNotification[];
   getNotificationsByType: (type: NotificationType) => HydratedNotification[];
   getNotificationsByUser: (userId: string) => HydratedNotification[];

   // Utility functions
   getNotificationById: (id: string) => HydratedNotification | undefined;
   getUnreadCount: () => number;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
   // Initial state
   notifications: [],
   selectedNotification: undefined,

   // Actions
   fetchNotifications: async () => {
      const response = await fetch('/api/notifications');
      const notifications = await response.json();
      set({ notifications });
   },
   setNotifications: (notifications: HydratedNotification[]) => {
      set({ notifications });
   },
   setSelectedNotification: (notification: HydratedNotification | undefined) => {
      set({ selectedNotification: notification });
   },

   markAsRead: async (id: string) => {
      set((state) => ({
         notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: true } : notification
         ),
         selectedNotification:
            state.selectedNotification?.id === id
               ? { ...state.selectedNotification, isRead: true }
               : state.selectedNotification,
      }));
      await fetch(`/api/notifications/${id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ isRead: true }),
      });
   },

   markAllAsRead: () => {
      set((state) => {
         const unreadNotifications = state.notifications.filter(n => !n.isRead);
         unreadNotifications.forEach(async (notification) => {
            await fetch(`/api/notifications/${notification.id}`, {
               method: 'PATCH',
               headers: {
                  'Content-Type': 'application/json',
               },
               body: JSON.stringify({ isRead: true }),
            });
         });
         return {
            notifications: state.notifications.map((notification) => ({
               ...notification,
               isRead: true,
            })),
            selectedNotification: state.selectedNotification
               ? { ...state.selectedNotification, isRead: true }
               : undefined,
         }
      });
   },

   markAsUnread: async (id: string) => {
      set((state) => ({
         notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, isRead: false } : notification
         ),
         selectedNotification:
            state.selectedNotification?.id === id
               ? { ...state.selectedNotification, isRead: false }
               : state.selectedNotification,
      }));
      await fetch(`/api/notifications/${id}`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ isRead: false }),
      });
   },

   // Filters
   getUnreadNotifications: () => {
      return get().notifications.filter((notification) => !notification.isRead);
   },

   getReadNotifications: () => {
      return get().notifications.filter((notification) => notification.isRead);
   },

   getNotificationsByType: (type: NotificationType) => {
      return get().notifications.filter((notification) => notification.type === type);
   },

   getNotificationsByUser: (userId: string) => {
      return get().notifications.filter((notification) => notification.userId === userId);
   },

   // Utility functions
   getNotificationById: (id: string) => {
      return get().notifications.find((notification) => notification.id === id);
   },

   getUnreadCount: () => {
      return get().notifications.filter((notification) => !notification.isRead).length;
   },
}));
