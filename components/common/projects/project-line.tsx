import { HealthPopover } from './health-popover';
import { LeadSelector } from './lead-selector';
import { Project } from '@/types';

interface ProjectLineProps {
   project: Project;
}

export default function ProjectLine({ project }: ProjectLineProps) {
   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
         <div className="w-[60%] sm:w-[70%] xl:w-[46%] flex items-center gap-2">
            <div className="flex flex-col items-start overflow-hidden">
               <span className="font-medium truncate w-full">{project.name}</span>
            </div>
         </div>

         <div className="w-[20%] sm:w-[10%] xl:w-[13%]">
            <HealthPopover project={project} />
         </div>

         <div className="hidden w-[10%] sm:block">
            {/* Priority has been removed from the new Project type */}
         </div>
         <div className="hidden xl:block xl:w-[13%]">
            <LeadSelector lead={project.lead} />
         </div>

         <div className="hidden xl:block xl:w-[13%]">
            {/* Date has been removed from the new Project type */}
         </div>

         <div className="w-[20%] sm:w-[10%]">
            {project.status}
         </div>
      </div>
   );
}
