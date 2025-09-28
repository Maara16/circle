'use client';

import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Filter } from './filter';

interface HeaderOptionsProps {
  onAddProject: () => void;
}

export default function HeaderOptions({ onAddProject }: HeaderOptionsProps) {
  return (
    <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
      <div className="flex items-center gap-2">
        <Filter />
        <Button className="relative" size="xs" variant="secondary">
          <SlidersHorizontal className="size-4" />
          <span className="hidden sm:inline ml-1">Display</span>
        </Button>
      </div>
      <Button size="xs" onClick={onAddProject}>
        <Plus className="size-4 mr-1" />
        Add Project
      </Button>
    </div>
  );
}
