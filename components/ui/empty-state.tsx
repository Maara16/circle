import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { FC, ReactNode } from 'react';

interface EmptyStateProps {
   title: string;
   description: string;
   icon?: LucideIcon;
   className?: string;
}

export const EmptyState: FC<EmptyStateProps> = ({ title, description, icon: Icon, className }) => {
   return (
      <div
         className={cn(
            'flex flex-col items-center justify-center gap-4 p-8 text-center',
            className
         )}
      >
         {Icon && (
            <div className="rounded-full bg-primary/10 p-3">
               <Icon className="size-6 text-primary" />
            </div>
         )}
         <div className="space-y-1">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
         </div>
      </div>
   );
};
