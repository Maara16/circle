import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';
import MemberActions from './member-actions';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

interface MemberLineProps {
  user: User;
  onEdit: () => void;
}

export default function MemberLine({ user, onEdit }: MemberLineProps) {
  return (
    <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm last:border-b-0">
      <div className="w-[60%] md:w-[50%] lg:w-[45%] flex items-center gap-2">
        <div className="relative">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col items-start overflow-hidden">
          <span className="font-medium truncate w-full">{user.name}</span>
          <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
        </div>
      </div>
      <div className="w-[20%] md:w-[15%] lg:w-[15%] text-xs text-muted-foreground">
        <Badge variant={user.status === 'active' ? 'default' : 'outline'}>
          {user.status}
        </Badge>
      </div>
      <div className="hidden lg:block w-[15%] text-xs text-muted-foreground">
        {format(new Date(user.joinDate), 'MMM d, yyyy')}
      </div>
      <div className="w-[20%] hidden md:flex md:w-[15%] lg:w-[15%] text-xs text-muted-foreground">
        {user.teams.length}
      </div>
      <div className="w-[10%]">
        <MemberActions memberId={user._id} onEdit={onEdit} />
      </div>
    </div>
  );
}
