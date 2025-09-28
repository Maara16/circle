'use client';

import { useEffect } from 'react';
import { useTeamsStore } from '@/store/teams-store';
import TeamLine from './team-line';
import { Team } from '@/types';
import ListSkeleton from '@/components/ui/list-skeleton';
import { Users } from 'lucide-react';

interface TeamsProps {
  onEditTeam: (team: Team) => void;
}

export default function Teams({ onEditTeam }: TeamsProps) {
  const { teams, loading, error, fetchTeams } = useTeamsStore();

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[60%] sm:w-[40%] md:w-[35%] lg:w-[30%]">Name</div>
        <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Membership</div>
        <div className="hidden sm:block sm:w-[20%] md:w-[15%]">Identifier</div>
        <div className="w-[20%] sm:w-[15%] md:w-[15%]">Members</div>
        <div className="hidden sm:block sm:w-[15%] md:w-[10%]">Projects</div>
        <div className="w-[20%] sm:w-[10%] md:w-[10%]">Actions</div>
      </div>

      {loading ? (
        <ListSkeleton
          columns={[
            { width: 'w-[60%] sm:w-[40%] md:w-[35%] lg:w-[30%]' },
            { width: 'sm:w-[20%] md:w-[15%]', className: 'hidden sm:block' },
            { width: 'sm:w-[20%] md:w-[15%]', className: 'hidden sm:block' },
            { width: 'w-[20%] sm:w-[15%] md:w-[15%]' },
            { width: 'sm:w-[15%] md:w-[10%]', className: 'hidden sm:block' },
            { width: 'w-[20%] sm:w-[10%] md:w-[10%]' },
          ]}
        />
      ) : teams.length > 0 ? (
        <div className="w-full">
          {teams.map((team) => (
            <TeamLine key={team._id} team={team} onEdit={() => onEditTeam(team)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <img
            src="https://ik.imagekit.io/storyset/preview/images/rafiki/team-spirit.svg?tr=w-400"
            alt="No Teams Found"
            className="w-80 h-80"
          />
          <p className="text-muted-foreground mt-4">No teams found. Get started by creating one.</p>
        </div>
      )}
    </div>
  );
}
