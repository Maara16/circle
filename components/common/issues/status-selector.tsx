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
import { renderStatusIcon } from '@/lib/status-utils';
import { status as allStatus } from '@/mock-data/status';
import { useIssuesStore } from '@/store/issues-store';
import { CheckIcon, CircleOff } from 'lucide-react';
import { useEffect, useId, useState } from 'react';

interface StatusSelectorProps {
   status: string;
   issueId: string;
}

export function StatusSelector({ status, issueId }: StatusSelectorProps) {
   const id = useId();
   const [open, setOpen] = useState<boolean>(false);
   const [value, setValue] = useState<string>(status);

   const { updateIssueStatus } = useIssuesStore();

   useEffect(() => {
      setValue(status);
   }, [status]);

   const handleStatusChange = (statusId: string) => {
      setValue(statusId);
      setOpen(false);

      if (issueId) {
         updateIssueStatus(issueId, statusId);
      }
   };

   return (
      <div className="*:not-first:mt-2">
         <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
               <Button
                  id={id}
                  className="size-7 flex items-center justify-center"
                  size="icon"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
               >
                  {renderStatusIcon(value)}
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="border-input w-full min-w-[var(--radix-popper-anchor-width)] p-0"
               align="start"
            >
               <Command>
                  <CommandInput placeholder="Set status..." />
                  <CommandList>
                     <CommandEmpty className="p-0">
                        <EmptyState
                           title="No status found"
                           description="Try a different keyword."
                           icon={CircleOff}
                           className="py-4"
                        />
                     </CommandEmpty>
                     <CommandGroup>
                        {allStatus.map((item) => (
                           <CommandItem
                              key={item.id}
                              value={item.id}
                              onSelect={handleStatusChange}
                              className="flex items-center justify-between"
                           >
                              <div className="flex items-center gap-2">
                                 <item.icon />
                                 {item.label}
                              </div>
                              {value === item.id && <CheckIcon size={16} className="ml-auto" />}
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
