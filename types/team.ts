import { IUser } from './user';
import { IProject } from './project';

export interface ITeam {
   _id: string;
   name: string;
   description?: string;
   members: IUser[];
   projects: IProject[];
   icon?: string;
   joined?: boolean;
}
