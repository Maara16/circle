import { MembersTooltip } from './members-tooltip';
import { ProjectsTooltip } from './projects-tooltip';
import { Team } from '@/types';
import TeamActions from './team-actions';

interface TeamLineProps {
  team: Team;
  onEdit: () => void;
}

export default function TeamLine({ team, onEdit }: TeamLineProps) {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
      <div className="w-[60%] sm:w-[40%] md:w-[35%] lg:w-[30%] flex items-center gap-2">
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">{team.name}</span>
        </div>
      </div>
      <div className="hidden sm:block sm:w-[20%] md:w-[15%] text-xs text-muted-foreground">
        {/* Membership type can be added here if available */}
      </div>
      <div className="hidden sm:block sm:w-[20%] md:w-[15%] text-xs text-muted-foreground">
        {team._id}
      </div>
      <div className="w-[20%] sm:w-[15%] md:w-[15%] flex">
        {team.members.length > 0 && <MembersTooltip members={team.members} />}
      </div>
      <div className="hidden sm:block sm:w-[15%] md:w-[10%] text-xs text-muted-foreground">
        {team.projects.length > 0 && <ProjectsTooltip projects={team.projects} />}
      </div>
      <div className="w-[20%] sm:w-[10%] md:w-[10%]">
        <TeamActions teamId={team._id} onEdit={onEdit} />
      </div>
    </div>
  );
}
