'use client';

import { useEffect } from 'react';
import { useTeamsStore } from '@/store/teams-store';
import TeamLine from './team-line';

export default function Teams() {
   const { teams, loading, error, fetchTeams } = useTeamsStore();

   useEffect(() => {
      fetchTeams();
   }, [fetchTeams]);

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[70%] sm:w-[50%] md:w-[45%] lg:w-[40%]">Name</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Membership</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Identifier</div>
            <div className="w-[30%] sm:w-[20%] md:w-[15%]">Members</div>
            <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Projects</div>
         </div>

         <div className="w-full">
            {teams.map((team) => (
               <TeamLine key={team._id} team={team} />
            ))}
         </div>
      </div>
   );
}
