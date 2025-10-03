import { create } from 'zustand';
import { ITeam } from '@/types/team';

interface TeamsState {
   teams: ITeam[];
   loading: boolean;
   fetchTeams: () => Promise<void>;
}

export const useTeamsStore = create<TeamsState>((set) => ({
   teams: [],
   loading: false,
   fetchTeams: async () => {
      set({ loading: true });
      try {
         const response = await fetch('/api/teams');
         const data = await response.json();
         if (data.success) {
            set({ teams: data.data, loading: false });
         } else {
            set({ loading: false });
         }
      } catch (error) {
         set({ loading: false });
         console.error('Failed to fetch teams:', error);
      }
   },
}));
