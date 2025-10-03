import { IUser } from './user';
import { ITeam } from './team';

export interface IProject {
   _id: string;
   name: string;
   description?: string;
   team: ITeam;
   lead?: IUser;
   status: 'Not Started' | 'In Progress' | 'Completed';
   health: 'On Track' | 'At Risk' | 'Off Track';
   startDate: string;
   endDate?: string;
}
