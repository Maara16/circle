'use client';

import { Button } from '@/components/ui/button';
import {
   Command,
   CommandEmpty,
   CommandGroup,
   CommandInput,
   CommandItem,
   CommandList,
} from '@/components/ui/command';
import { EmptyState } from '@/components/ui/empty-state';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useProjectsStore } from '@/store/projects-store';
import { Box, CheckIcon, FolderIcon, FolderOpen } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface ProjectSelectorProps {
   project: string;
   onChange: (projectId: string) => void;
}

export function ProjectSelector({ project, onChange }: ProjectSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string>(project);
   const { projects, fetchProjects } = useProjectsStore();

   useEffect(() => {
      fetchProjects();
   }, [fetchProjects]);

   useEffect(() => {
      setValue(project);
   }, [project]);

   const handleProjectChange = (projectId: string) => {
      if (projectId === 'no-project') {
         setValue('');
         onChange('');
      } else {
         setValue(projectId);
         onChange(projectId);
      }
      setOpen(false);
   };

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="flex items-center justify-center"
                  size="xs"
                  variant="secondary"
                  role="combobox"
                  aria-expanded={open}
               >
                  <Box className="size-4" />
                  <span>{value ? projects.find((p) => p._id === value)?.name : 'No project'}</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set project..." />
                  <CommandList>
                     <CommandEmpty>
                        <EmptyState
                           icon={FolderOpen}
                           title="No projects found"
                           description="Try a different keyword."
                           className="py-4"
                        />
                     </CommandEmpty>
                     <CommandGroup>
                        <CommandItem
                           value="no-project"
                           onSelect={() => handleProjectChange('no-project')}
                           className="flex items-center justify-between"
                        >
                           <div className="flex items-center gap-2">
                              <FolderIcon className="size-4" />
                              No Project
                           </div>
                           {value === '' && <CheckIcon size={16} className="ml-auto" />}
                        </CommandItem>
                        {projects.map((project) => (
                           <CommandItem
                              key={project._id}
                              value={project._id}
                              onSelect={() => handleProjectChange(project._id)}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">{project.name}</div>
                              {value === project._id && <CheckIcon size={16} className="ml-auto" />}
                           </CommandItem>
                        ))}
                     </CommandGroup>
                  </CommandList>
               </Command>
            </PopoverContent>
         </Popover>
      </div>
   );
}
