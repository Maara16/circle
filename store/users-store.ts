import { create } from 'zustand';
import { User } from '@/types';
import api from '@/lib/api';

interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;

  fetchUsers: () => Promise<void>;
  addUser: (userData: Omit<User, '_id' | 'teams'>) => Promise<void>;
  updateUser: (userId: string, updatedData: Partial<User>) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
}

export const useUsersStore = create<UsersState>((set, get) => ({
  users: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const users = await api.get<User[]>('members');
      set({ users, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addUser: async (userData) => {
    set({ loading: true });
    try {
      const newUser = await api.post<User>('members', userData);
      set((state) => ({
        users: [...state.users, newUser],
      }));
    } catch (error) {
      console.error("Failed to add user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  updateUser: async (userId, updatedData) => {
    set({ loading: true });
    try {
      const updatedUser = await api.put<User>(`members/${userId}`, updatedData);
      set((state) => ({
        users: state.users.map((u) =>
          u._id === userId ? updatedUser : u
        ),
      }));
    } catch (error) {
      console.error("Failed to update user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ loading: true });
    try {
      await api.delete(`members/${userId}`);
      set((state) => ({
        users: state.users.filter((u) => u._id !== userId),
      }));
    } catch (error) {
      console.error("Failed to delete user:", error);
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  getUserById: (id: string) => {
    return get().users.find((u) => u._id === id);
  },
}));
