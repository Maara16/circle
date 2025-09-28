'use client';

import ProjectLine from '@/components/common/projects/project-line';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useEffect, useMemo } from 'react';
import { useProjectsStore } from '@/store/projects-store';
import { Project } from '@/types';
import ListSkeleton from '@/components/ui/list-skeleton';
import { FolderKanban } from 'lucide-react';

interface ProjectsProps {
  onEditProject: (project: Project) => void;
}

export default function Projects({ onEditProject }: ProjectsProps) {
  const { filters, sort } = useProjectsFilterStore();
  const { projects, loading, error, fetchProjects } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const displayed = useMemo(() => {
    let list = projects.slice();

    if (filters.health.length > 0) {
      const hs = new Set(filters.health);
      list = list.filter((p) => hs.has(p.health));
    }

    const compare = (a: Project, b: Project) => {
      switch (sort) {
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'date-asc':
          return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        case 'date-desc':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        case 'status-asc':
          return a.status.localeCompare(b.status);
        case 'status-desc':
          return b.status.localeCompare(a.status);
        default:
          return 0;
      }
    };
    return list.sort(compare);
  }, [projects, filters, sort]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[50%] sm:w-[60%] xl:w-[40%]">Title</div>
        <div className="w-[20%] sm:w-[10%] xl:w-[12%] pl-2.5">Health</div>
        <div className="hidden xl:block xl:w-[12%] pl-2">Lead</div>
        <div className="hidden xl:block xl:w-[12%] pl-2.5">Target date</div>
        <div className="w-[20%] sm:w-[10%] xl:w-[12%] pl-2">Status</div>
        <div className="w-[10%] sm:w-[10%] xl:w-[12%]">Actions</div>
      </div>

      {loading ? (
        <ListSkeleton
          columns={[
            { width: 'w-[50%] sm:w-[60%] xl:w-[40%]' },
            { width: 'w-[20%] sm:w-[10%] xl:w-[12%]' },
            { width: 'xl:w-[12%]', className: 'hidden xl:block' },
            { width: 'xl:w-[12%]', className: 'hidden xl:block' },
            { width: 'w-[20%] sm:w-[10%] xl:w-[12%]' },
            { width: 'w-[10%] sm:w-[10%] xl:w-[12%]' },
          ]}
        />
      ) : displayed.length > 0 ? (
        <div className="w-full">
          {displayed.map((project) => (
            <ProjectLine key={project._id} project={project} onEdit={() => onEditProject(project)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <img
            src="https://ik.imagekit.io/storyset/preview/images/rafiki/add-files.svg?tr=w-400"
            alt="No Projects Found"
            className="w-80 h-80"
          />
          <p className="text-muted-foreground mt-4">No projects found. Get started by creating one.</p>
        </div>
      )}
    </div>
  );
}
