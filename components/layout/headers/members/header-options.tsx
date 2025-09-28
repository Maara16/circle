'use client';

import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { Filter } from './filter';

interface HeaderOptionsProps {
  onAddMember: () => void;
}

export default function HeaderOptions({ onAddMember }: HeaderOptionsProps) {
  return (
    <div className="w-full flex justify-between items-center border-b py-1.5 px-6 h-10">
      <Filter />
      <div className="flex items-center gap-2">
        <Button className="relative" size="xs" variant="secondary">
          <SlidersHorizontal className="size-4 mr-1" />
          Display
        </Button>
        <Button size="xs" onClick={onAddMember}>
          <Plus className="size-4 mr-1" />
          Add Member
        </Button>
      </div>
    </div>
  );
}
