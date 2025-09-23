import { create } from 'zustand';
import { Issue, Label, Project, User } from '@/types';
import api from '@/lib/api';
import { Status, status as statusData } from '@/mock-data/status';
import { Priority, priorities as priorityData } from '@/mock-data/priorities';

// Helper to group issues by status
const groupIssuesByStatus = (issues: Issue[]): Record<string, Issue[]> => {
  return issues.reduce((acc, issue) => {
    const statusKey = issue.status;
    if (!acc[statusKey]) {
      acc[statusKey] = [];
    }
    acc[statusKey].push(issue);
    return acc;
  }, {} as Record<string, Issue[]>);
};

interface IssuesState {
  issues: Issue[];
  issuesByStatus: Record<string, Issue[]>;
  loading: boolean;
  error: string | null;

  fetchIssues: () => Promise<void>;
  addIssue: (issueData: Omit<Issue, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateIssue: (issueId: string, updatedData: Partial<Issue>) => Promise<void>;
  deleteIssue: (issueId: string) => Promise<void>;

  // The rest of the filter/utility functions can be adapted or kept as is if they work with the new data structure
  getIssueById: (id: string) => Issue | undefined;
  updateIssueStatus: (issueId: string, newStatus: string) => void;
  updateIssuePriority: (issueId: string, newPriority: string) => void;
  updateIssueAssignee: (issueId: string, newAssignee: User | null) => void;
  addIssueLabel: (issueId: string, label: Label) => void;
  removeIssueLabel: (issueId: string, labelId: string) => void;
  updateIssueProject: (issueId: string, newProject: Project | undefined) => void;
}

export const useIssuesStore = create<IssuesState>((set, get) => ({
  issues: [],
  issuesByStatus: {},
  loading: false,
  error: null,

  fetchIssues: async () => {
    set({ loading: true, error: null });
    try {
      const issues = await api.get<Issue[]>('issues');
      set({
        issues,
        issuesByStatus: groupIssuesByStatus(issues),
        loading: false,
      });
    } catch (error) {
      set({ error: (error as Error).message, loading: false });
    }
  },

  addIssue: async (issueData) => {
    try {
      const newIssue = await api.post<Issue>('issues', issueData);
      set((state) => {
        const newIssues = [...state.issues, newIssue];
        return {
          issues: newIssues,
          issuesByStatus: groupIssuesByStatus(newIssues),
        };
      });
    } catch (error) {
      // Handle error appropriately
      console.error("Failed to add issue:", error);
    }
  },

  updateIssue: async (issueId, updatedData) => {
    try {
      const updatedIssue = await api.put<Issue>(`issues/${issueId}`, updatedData);
      set((state) => {
        const newIssues = state.issues.map((issue) =>
          issue._id === issueId ? updatedIssue : issue
        );
        return {
          issues: newIssues,
          issuesByStatus: groupIssuesByStatus(newIssues),
        };
      });
    } catch (error) {
      console.error("Failed to update issue:", error);
    }
  },

  deleteIssue: async (issueId) => {
    try {
      await api.delete(`issues/${issueId}`);
      set((state) => {
        const newIssues = state.issues.filter((issue) => issue._id !== issueId);
        return {
          issues: newIssues,
          issuesByStatus: groupIssuesByStatus(newIssues),
        };
      });
    } catch (error) {
      console.error("Failed to delete issue:", error);
    }
  },

  getIssueById: (id: string) => {
    return get().issues.find((issue) => issue._id === id);
  },

  updateIssueStatus: (issueId: string, newStatus: string) => {
      get().updateIssue(issueId, { status: newStatus as Issue['status'] });
  },

  updateIssuePriority: (issueId: string, newPriority: string) => {
      get().updateIssue(issueId, { priority: newPriority as Issue['priority'] });
  },

  updateIssueAssignee: (issueId: string, newAssignee: User | null) => {
      get().updateIssue(issueId, { assignee: newAssignee });
  },

  addIssueLabel: (issueId: string, label: Label) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
          const updatedLabels = [...issue.labels, label];
          get().updateIssue(issueId, { labels: updatedLabels });
      }
  },

  removeIssueLabel: (issueId: string, labelId: string) => {
      const issue = get().getIssueById(issueId);
      if (issue) {
          const updatedLabels = issue.labels.filter((label) => label._id !== labelId);
          get().updateIssue(issueId, { labels: updatedLabels });
      }
  },

  updateIssueProject: (issueId: string, newProject: Project | undefined) => {
      get().updateIssue(issueId, { project: newProject });
  },
}));
