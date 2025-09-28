import { HealthPopover } from './health-popover';
import { LeadSelector } from './lead-selector';
import { Project } from '@/types';
import ProjectActions from './project-actions';
import { format } from 'date-fns';

interface ProjectLineProps {
  project: Project;
  onEdit: () => void;
}

export default function ProjectLine({ project, onEdit }: ProjectLineProps) {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm">
      <div className="w-[50%] sm:w-[60%] xl:w-[40%] flex items-center gap-2">
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">{project.name}</span>
        </div>
      </div>

      <div className="w-[20%] sm:w-[10%] xl:w-[12%]">
        <HealthPopover project={project} />
      </div>

      <div className="hidden xl:block xl:w-[12%]">
        <LeadSelector lead={project.lead} />
      </div>

      <div className="hidden xl:block xl:w-[12%]">
        {project.endDate ? format(new Date(project.endDate), 'MMM d, yyyy') : 'N/A'}
      </div>

      <div className="w-[20%] sm:w-[10%] xl:w-[12%]">{project.status}</div>

      <div className="w-[10%] sm:w-[10%] xl:w-[12%]">
        <ProjectActions projectId={project._id} onEdit={onEdit} />
      </div>
    </div>
  );
}
