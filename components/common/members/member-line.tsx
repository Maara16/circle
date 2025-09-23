import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface MemberLineProps {
   user: User;
}

export default function MemberLine({ user }: MemberLineProps) {
   return (
      <div className="w-full flex items-center py-3 px-6 border-b hover:bg-sidebar/50 border-muted-foreground/5 text-sm last:border-b-0">
         <div className="w-[70%] md:w-[60%] lg:w-[55%] flex items-center gap-2">
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
         <div className="w-[30%] md:w-[20%] lg:w-[15%] text-xs text-muted-foreground">
            {/* Role has been removed */}
         </div>
         <div className="hidden lg:block w-[15%] text-xs text-muted-foreground">
            {/* Joined date has been removed */}
         </div>
         <div className="w-[30%] hidden md:flex md:w-[20%] lg:w-[15%] text-xs text-muted-foreground">
            {/* Teams need to be handled differently */}
         </div>
      </div>
   );
}
