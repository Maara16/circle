export interface IUser {
   _id: string;
   name: string;
   email: string;
   avatar?: string;
   role: string;
   joinDate: string;
   status: 'active' | 'inactive';
}
