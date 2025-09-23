import { create } from 'zustand';
import { Project } from '@/types';
import api from '@/lib/api';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchProjects: () => Promise<void>;
  addProject: (projectData: Omit<Project, '_id' | 'team' | 'lead' | 'issues'> & { team: string, lead?: string }) => Promise<void>;
  updateProject: (projectId: string, updatedData: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const projects = await api.get<Project[]>('projects');
      set({ projects, loading: false });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addProject: async (projectData) => {
    try {
      const newProject = await api.post<Project>('projects', projectData);
      set((state) => ({
        projects: [...state.projects, newProject],
      }));
    } catch (error) {
      console.error("Failed to add project:", error);
    }
  },

  updateProject: async (projectId, updatedData) => {
    try {
      const updatedProject = await api.put<Project>(`projects/${projectId}`, updatedData);
      set((state) => ({
        projects: state.projects.map((p) =>
          p._id === projectId ? updatedProject : p
        ),
      }));
    } catch (error) {
      console.error("Failed to update project:", error);
    }
  },

  deleteProject: async (projectId) => {
    try {
      await api.delete(`projects/${projectId}`);
      set((state) => ({
        projects: state.projects.filter((p) => p._id !== projectId),
      }));
    } catch (error) {
      console.error("Failed to delete project:", error);
    }
  },

  getProjectById: (id: string) => {
    return get().projects.find((p) => p._id === id);
  },
}));
