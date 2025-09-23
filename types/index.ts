export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  teams: string[];
}

export interface Team {
  _id: string;
  name:string;
  description?: string;
  members: User[];
  projects: Project[];
}

export interface Project {
  _id: string;
  name: string;
  description?: string;
  team: Team;
  lead?: User;
  status: 'Not Started' | 'In Progress' | 'Completed';
  health: 'On Track' | 'At Risk' | 'Off Track';
  issues: Issue[];
}

export interface Issue {
  _id: string;
  title: string;
  description?: string;
  project: Project;
  assignee?: User;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
  priority: 'No priority' | 'Low' | 'Medium' | 'High' | 'Urgent';
  labels: Label[];
  createdAt: string;
  updatedAt: string;
}

export interface Label {
  _id: string;
  name: string;
  color: string;
  description?: string;
}
