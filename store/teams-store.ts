import { create } from 'zustand';
import { Team } from '@/types';
import api from '@/lib/api';

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;

  fetchTeams: () => Promise<void>;
  addTeam: (teamData: Omit<Team, '_id' | 'members' | 'projects'>) => Promise<void>;
  updateTeam: (teamId: string, updatedData: Partial<Team>) => Promise<void>;
  deleteTeam: (teamId: string) => Promise<void>;
  getTeamById: (id: string) => Team | undefined;
}

export const useTeamsStore = create<TeamsState>((set, get) => ({
  teams: [],
  loading: false,
  error: null,

  fetchTeams: async () => {
    set({ loading: true, error: null });
    try {
      const teams = await api.get<Team[]>('teams');
      set({ teams, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addTeam: async (teamData) => {
    try {
      const newTeam = await api.post<Team>('teams', teamData);
      set((state) => ({
        teams: [...state.teams, newTeam],
      }));
    } catch (error) {
      console.error("Failed to add team:", error);
    }
  },

  updateTeam: async (teamId, updatedData) => {
    try {
      const updatedTeam = await api.put<Team>(`teams/${teamId}`, updatedData);
      set((state) => ({
        teams: state.teams.map((t) =>
          t._id === teamId ? updatedTeam : t
        ),
      }));
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  },

  deleteTeam: async (teamId) => {
    try {
      await api.delete(`teams/${teamId}`);
      set((state) => ({
        teams: state.teams.filter((t) => t._id !== teamId),
      }));
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  },

  getTeamById: (id: string) => {
    return get().teams.find((t) => t._id === id);
  },
}));
