'use client';

import MemberLine from './member-line';
import { useMembersFilterStore } from '@/store/members-filter-store';
import { useEffect, useMemo } from 'react';
import { useUsersStore } from '@/store/users-store';
import { User } from '@/types';

export default function Members() {
   const { filters, sort } = useMembersFilterStore();
   const { users, loading, error, fetchUsers } = useUsersStore();

   useEffect(() => {
      fetchUsers();
   }, [fetchUsers]);

   const displayed = useMemo(() => {
      let list = users.slice();

      // filter by role (called Status in UI)
      // This needs to be adapted to your new User type
      // if (filters.role.length > 0) {
      //    const roles = new Set(filters.role);
      //    list = list.filter((u) => roles.has(u.role));
      // }

      // sorting
      const compare = (a: User, b: User) => {
         switch (sort) {
            case 'name-asc':
               return a.name.localeCompare(b.name);
            case 'name-desc':
               return b.name.localeCompare(a.name);
            // joined-asc and joined-desc need to be adapted
            // case 'joined-asc':
            //    return new Date(a.joinedDate).getTime() - new Date(b.joinedDate).getTime();
            // case 'joined-desc':
            //    return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
            case 'teams-asc':
               return a.teams.length - b.teams.length;
            case 'teams-desc':
               return b.teams.length - a.teams.length;
            default:
               return 0;
         }
      };

      return list.sort(compare);
   }, [users, filters, sort]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] md:w-[60%] lg:w-[55%]">Name</div>
            <div className="w-[30%] md:w-[20%] lg:w-[15%]">Status</div>
            <div className="hidden lg:block w-[15%]">Joined</div>
            <div className="w-[30%] hidden md:block md:w-[20%] lg:w-[15%]">Teams</div>
         </div>

         <div className="w-full">
            {displayed.map((user) => (
               <MemberLine key={user._id} user={user} />
            ))}
         </div>
      </div>
   );
}
