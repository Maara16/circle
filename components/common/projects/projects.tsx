'use client';

import ProjectLine from '@/components/common/projects/project-line';
import { useProjectsFilterStore } from '@/store/projects-filter-store';
import { useEffect, useMemo } from 'react';
import { useProjectsStore } from '@/store/projects-store';
import { Project } from '@/types';

export default function Projects() {
   const { filters, sort } = useProjectsFilterStore();
   const { projects, loading, error, fetchProjects } = useProjectsStore();

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

   const displayed = useMemo(() => {
      let list = projects.slice();

      // filters
      if (filters.health.length > 0) {
         const hs = new Set(filters.health);
         list = list.filter((p) => hs.has(p.health));
      }
      // Priority filter needs to be adapted if it exists in your new Project type
      // if (filters.priority.length > 0) {
      //    const ps = new Set(filters.priority);
      //    list = list.filter((p) => ps.has(p.priority));
      // }

      // sorting
      const compare = (a: Project, b: Project) => {
         switch (sort) {
            case 'title-asc':
               return a.name.localeCompare(b.name);
            case 'title-desc':
               return b.name.localeCompare(a.name);
            // date-asc and date-desc need to be adapted to your new Project type fields
            // case 'date-asc':
            //    return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
            // case 'date-desc':
            //    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
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

   if (loading) {
      return <div>Loading...</div>;
   }

   if (error) {
      return <div>Error: {error}</div>;
   }

   return (
      <div className="w-full">
         <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
            <div className="w-[60%] sm:w-[70%] xl:w-[46%]">Title</div>
            <div className="w-[20%] sm:w-[10%] xl:w-[13%] pl-2.5">Health</div>
            <div className="hidden w-[10%] sm:block pl-2">Priority</div>
            <div className="hidden xl:block xl:w-[13%] pl-2">Lead</div>
            <div className="hidden xl:block xl:w-[13%] pl-2.5">Target date</div>
            <div className="w-[20%] sm:w-[10%] pl-2">Status</div>
         </div>

         <div className="w-full">
            {displayed.map((project) => (
               <ProjectLine key={project._id} project={project} />
            ))}
         </div>
      </div>
   );
}
