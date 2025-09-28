'use client';

import MemberLine from './member-line';
import { useMembersFilterStore } from '@/store/members-filter-store';
import { useEffect, useMemo } from 'react';
import { useUsersStore } from '@/store/users-store';
import { User } from '@/types';
import ListSkeleton from '@/components/ui/list-skeleton';
import { UserSearch } from 'lucide-react';

interface MembersProps {
  onEditMember: (member: User) => void;
}

export default function Members({ onEditMember }: MembersProps) {
  const { filters, sort } = useMembersFilterStore();
  const { users, loading, error, fetchUsers } = useUsersStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const displayed = useMemo(() => {
    let list = users.slice();

    // This needs to be adapted if role filtering is added
    // if (filters.role.length > 0) {
    //    const roles = new Set(filters.role);
    //    list = list.filter((u) => roles.has(u.role));
    // }

    const compare = (a: User, b: User) => {
      switch (sort) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'joined-asc':
           return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        case 'joined-desc':
           return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'teams-asc':
          return a.teams.length - b.teams.length;
        case 'teams-desc':
          return b.teams.length - a.teams.length;
        default:
          return 0;
      }
    };

    return list.sort(compare);
  }, [users, filters, sort]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="w-full">
      <div className="bg-container px-6 py-1.5 text-sm flex items-center text-muted-foreground border-b sticky top-0 z-10">
        <div className="w-[60%] md:w-[50%] lg:w-[45%]">Name</div>
        <div className="w-[20%] md:w-[15%] lg:w-[15%]">Status</div>
        <div className="hidden lg:block w-[15%]">Joined</div>
        <div className="w-[20%] hidden md:block md:w-[15%] lg:w-[15%]">Teams</div>
        <div className="w-[10%]">Actions</div>
      </div>

      {loading ? (
        <ListSkeleton
          columns={[
            { width: 'w-[60%] md:w-[50%] lg:w-[45%]' },
            { width: 'w-[20%] md:w-[15%] lg:w-[15%]' },
            { width: 'lg:w-[15%]', className: 'hidden lg:block' },
            { width: 'md:w-[15%] lg:w-[15%]', className: 'hidden md:block' },
            { width: 'w-[10%]' },
          ]}
        />
      ) : displayed.length > 0 ? (
        <div className="w-full">
          {displayed.map((user) => (
            <MemberLine key={user._id} user={user} onEdit={() => onEditMember(user)} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96">
          <img
            src="https://ik.imagekit.io/storyset/preview/images/rafiki/business-team.svg?tr=w-400"
            alt="No Members Found"
            className="w-80 h-80"
          />
          <p className="text-muted-foreground mt-4">No members found. Get started by adding one.</p>
        </div>
      )}
    </div>
  );
}
